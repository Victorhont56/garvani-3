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
import nigerianStatesWithLga from "./NigerianStatesWithLga";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import SuccessModal from "./SuccessModal";
import { X } from "lucide-react";

enum STEPS {
  TYPE = 0,
  MODE = 1,
  CATEGORY = 2,
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
  const [step, setStep] = useState(STEPS.TYPE); // Start with TYPE step
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { user } = useUser();

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
      type: "Building", // Default to Building
      state: "",
      lga: "",
      images: [],
      price: 1,
      title: "",
      description: "",
      userId: user?.id,
    },
  });

  const state = watch("state");
  const mode = watch("mode");
  const type = watch("type");
  const category = watch("category");
  const livingroomCount = watch("livingroomCount");
  const bedroomCount = watch("bedroomCount");
  const bathroomCount = watch("bathroomCount");

  let bodyContent = <div></div>;

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
    // Skip category step if property type is Land
    if (step === STEPS.MODE && type === "Land") {
      setStep(STEPS.STATE);
    } else {
      setStep((value) => value + 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      
      if (files.length + selectedFiles.length > 20) {
        toast.error("Maximum 20 images allowed");
        return;
      }

      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) return onNext();
  
    setIsLoading(true);
  
    try {
     // In your onSubmit function, ensure all required fields are included:
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('type', data.type);
        formData.append('mode', data.mode);
        formData.append('state', data.state);
        formData.append('lga', data.lga);
        formData.append('userId', user?.id || '');

        // For Building type only
        if (data.type === 'Building') {
          formData.append('category', data.category);
          formData.append('bedroomCount', data.bedroomCount.toString());
          formData.append('livingroomCount', data.livingroomCount.toString());
        }

        // Always include
        formData.append('bathroomCount', data.bathroomCount.toString());

        // Add images
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });

      const response = await axios.post('/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data, // Prevent axios from transforming FormData
      });
  
      if (response.status === 201) {
        // Success handling
      } else {
        throw new Error(response.data?.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Full error:", error);
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to create listing"
      );
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
    if (step === STEPS.TYPE) {
      return undefined;
    }
    return "Back";
  }, [step]);

  // TYPE step (now first)
  if (step === STEPS.TYPE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What type of property is this?"
          subtitle="Select Building or Land"
        />
        <div className="flex">
          <button
            type="button"
            onClick={() => setCustomValue("type", "Building")}
            className={`flex-1 py-2 border rounded-l-lg ${
              type === "Building" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Building
          </button>
          <button
            type="button"
            onClick={() => setCustomValue("type", "Land")}
            className={`flex-1 py-2 border rounded-r-lg ${
              type === "Land" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Land
          </button>
        </div>
      </div>
    );
  }

  // MODE step (second)
  if (step === STEPS.MODE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What is your property listed for?"
          subtitle="Select Rent or Sale"
        />
        <div className="flex">
          <button
            type="button"
            onClick={() => setCustomValue("mode", "Rent")}
            className={`flex-1 py-2 border rounded-l-lg ${
              mode === "Rent" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Rent
          </button>
          <button
            type="button"
            onClick={() => setCustomValue("mode", "Sale")}
            className={`flex-1 py-2 border rounded-r-lg ${
              mode === "Sale" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Sale
          </button>
        </div>
      </div>
    );
  }



  
  // CATEGORY step (only shown for Building type)
  if (step === STEPS.CATEGORY && type === "Building") {
    bodyContent = (
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
  }

  // STATE step
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

  // LGA step
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

  // INFO step
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        {type === "Building" && (
          <>
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
          </>
        )}
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  // IMAGES step
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your place (5-20 images)"
          subtitle="Show guests what your place looks like!"
        />
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-secondary font-medium">Click to upload</span>
              <span className="text-sm text-gray-500">or drag and drop</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 10MB each)</span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isLoading}
              multiple
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {previewUrls.length} {previewUrls.length === 1 ? "image" : "images"} selected
              </span>
              <span className="text-xs text-gray-500">
                {5 - previewUrls.length > 0 ? `Minimum ${5 - previewUrls.length} more required` : "Maximum 20 images"}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // DESCRIPTION step
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

  // PRICE step
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle={`How much do you charge per ${mode === "Rent" ? "month" : "unit"}?`}
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
    <>
      <Modal
        disabled={isLoading || (step === STEPS.IMAGES && previewUrls.length < 5)}
        isOpen={listModal.isOpen}
        title="Create Listing"
        actionLabel={actionLabel}
        onSubmit={handleSubmit(onSubmit)}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.TYPE ? undefined : onBack}
        onClose={listModal.onClose}
        body={bodyContent}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
};

export default ListModal;