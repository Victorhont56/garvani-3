"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useListModal from "./useListModal";
import Modal from "./Modal";
import Counter from "./CounterTwo";
import CategoryInput from "./CategoryInput";
import { categoryItems } from "./MapFilterItems";
import InputTwo from "./InputTwo";
import Heading from "./Heading";
import { Input } from "@/components/ui/input";
import nigerianStatesWithLga from "./NigerianStatesWithLga"; // Import the states and LGAs data
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook
import { createAirbnbHome, CreateDescription } from "../actions"; // Import server actions

enum STEPS {
  CATEGORY = 0,
  MODE = 1,
  TYPE = 2,
  STATE = 3,
  LGA = 4,
  INFO = 5,
  IMAGES = 6,
  DESCRIPTION = 7,
  PRICE = 8,
}

const ListModal = () => {
  const router = useRouter();
  const listModal = useListModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for the selected file
  const { user } = useUser(); // Get the authenticated user from Clerk

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      livingroomCount: 0,
      bedroomCount: 0,
      bathroomCount: 0,
      mode: "Rent",
      type: "Building",
      state: "",
      lga: "",
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
      userId: user?.id, // Add userId to the form data
    },
  });

  const state = watch("state");
  const lga = watch("lga");
  const mode = watch("mode");
  const type = watch("type");
  const category = watch("category");
  const livingroomCount = watch("livingroomCount");
  const bedroomCount = watch("bedroomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    // Ensure the user is authenticated
    if (!user) {
      toast.error("You must be logged in to create a listing.");
      return;
    }

    // Add the userId to the form data
    data.userId = user.id;

    setIsLoading(true);

    try {
      // Create the home and get the homeId
      const homeId = await createAirbnbHome({ userId: user.id });

      // Update the home with additional details
      const formData = new FormData();
      formData.append("homeId", String(homeId));
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("state", data.state);
      formData.append("lga", data.lga);
      formData.append("mode", data.mode);
      formData.append("type", data.type);
      formData.append("livingroom", data.livingroomCount.toString());
      formData.append("bedroom", data.bedroomCount.toString());
      formData.append("bathroom", data.bathroomCount.toString());

      // Append the selected file if it exists
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // Call the CreateDescription server action
      await CreateDescription(formData);

      toast.success("Listing created!");
      router.refresh();
      reset();
      setStep(STEPS.CATEGORY);
      listModal.onClose();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCustomValue("imageSrc", file.name); // Update the form value
    }
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div>
        <Heading
          title="Which of these best describes your place?"
          subtitle="Pick a category"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categoryItems.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.STATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What state is your property located?"
          subtitle="Help guests find you!"
        />
        <select
          {...register("state", { required: true })}
          className="w-full p-2 border rounded"
          onChange={(e) => setCustomValue("state", e.target.value)}
        >
          <option value="">Select a state</option>
          {Object.keys(nigerianStatesWithLga).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (step === STEPS.LGA) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What is the local government area of your property?"
          subtitle="Help guests find you!"
        />
        <select
          {...register("lga", { required: true })}
          className="w-full p-2 border rounded"
          disabled={!state}
          onChange={(e) => setCustomValue("lga", e.target.value)}
        >
          <option value="">Select an LGA</option>
          {nigerianStatesWithLga[state as keyof typeof nigerianStatesWithLga]?.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue("bedroomCount", value)}
          value={bedroomCount}
          title="Bedrooms"
          subtitle="How many bedrooms do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("livingroomCount", value)}
          value={livingroomCount}
          title="Livingrooms"
          subtitle="How many living rooms do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <InputTwo
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <InputTwo
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <InputTwo
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={listModal.isOpen}
      title="Welcome to Garvani"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={listModal.onClose}
      body={bodyContent}
    />
  );
};

export default ListModal;