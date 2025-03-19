"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";
import { useState } from "react";
import { useCountries } from "../lib/getCountries";
import { HomeMap } from "./HomeMap";
import { Button } from "@/components/ui/button";
import { CreationSubmit } from "./SubmitButtons";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";

interface Props {
  isScrolled: boolean;
}

export function SearchModalCompnent({ isScrolled }: Props) {
  const [step, setStep] = useState(1);
  const [locationValue, setLocationValue] = useState("");
  const { getAllCountries } = useCountries();

  function SubmitButtonLocal() {
    if (step === 1) {
      return (
        <Button onClick={() => setStep(step + 1)} type="button">
          Next
        </Button>
      );
    } else if (step === 2) {
      return <CreationSubmit />;
    }
  }

  return (
    <div className="rounded-full py-2 px-5 border flex items-center cursor-pointer">
      {/* Menu Links - Hidden on Mobile, Visible on Medium and Large */}
      <div className="hidden sm:flex gap-3 font-medium transition-colors duration-300">
        {["Home", "Discover", "About", "Contact", "Settings"].map((label, idx) => (
          <a
            key={idx}
            href="#"
            className={`${
              isScrolled ? "text-black hover:text-gray-600" : "text-white hover:text-gray-400"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Search Icon - Visible Only on Medium and Larger */}
      <div className="hidden sm:flex ml-14">
        <Dialog>
          <DialogTrigger asChild>
            <Search
              className={`bg-primary ${
                isScrolled ? "text-black" : "text-white"
              } p-1 h-8 hover:bg-hover hover:text-gray-400 w-8 rounded-full`}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form className="gap-4 flex flex-col">
              <input type="hidden" name="country" value={locationValue} />
              {step === 1 ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Select a Country</DialogTitle>
                    <DialogDescription>Please choose a country.</DialogDescription>
                  </DialogHeader>

                  <Select
                    required
                    onValueChange={(value) => setLocationValue(value)}
                    value={locationValue}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Countries</SelectLabel>
                        {getAllCountries().map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.flag} {item.label} / {item.region}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <HomeMap locationValue={locationValue} />
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Select all the info you need</DialogTitle>
                    <DialogDescription>Provide more details about your preferences.</DialogDescription>
                  </DialogHeader>

                  <Card>
                    <CardHeader className="flex flex-col gap-y-5">
                      {["Guests", "Rooms", "Bathrooms"].map((label, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <h3 className="underline font-medium">{label}</h3>
                            <p className="text-muted-foreground text-sm">
                              How many {label.toLowerCase()} do you have?
                            </p>
                          </div>
                          <Counter name={label.toLowerCase()} />
                        </div>
                      ))}
                    </CardHeader>
                  </Card>
                </>
              )}
              <DialogFooter>
                <SubmitButtonLocal />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Icon - Visible Only on Mobile */}
      <div className="flex sm:hidden ml-2">
        <Dialog>
          <DialogTrigger asChild>
            <Search
              className={`bg-primary ${
                isScrolled ? "text-black" : "text-white"
              } p-1 h-8 hover:bg-hover hover:text-gray-400 w-8 rounded-full`}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {/* Dialog content same as above */}
            <form className="gap-4 flex flex-col">
              <input type="hidden" name="country" value={locationValue} />
              {step === 1 ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Select a Country</DialogTitle>
                    <DialogDescription>Please choose a country.</DialogDescription>
                  </DialogHeader>

                  <Select
                    required
                    onValueChange={(value) => setLocationValue(value)}
                    value={locationValue}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Countries</SelectLabel>
                        {getAllCountries().map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.flag} {item.label} / {item.region}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <HomeMap locationValue={locationValue} />
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Select all the info you need</DialogTitle>
                    <DialogDescription>Provide more details about your preferences.</DialogDescription>
                  </DialogHeader>

                  <Card>
                    <CardHeader className="flex flex-col gap-y-5">
                      {["Guests", "Rooms", "Bathrooms"].map((label, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <h3 className="underline font-medium">{label}</h3>
                            <p className="text-muted-foreground text-sm">
                              How many {label.toLowerCase()} do you have?
                            </p>
                          </div>
                          <Counter name={label.toLowerCase()} />
                        </div>
                      ))}
                    </CardHeader>
                  </Card>
                </>
              )}
              <DialogFooter>
                <SubmitButtonLocal />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
