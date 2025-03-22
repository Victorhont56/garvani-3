"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SuccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if the success query parameter is present
    if (searchParams?.get("success") === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);

    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams?.toString() || "");

    // Remove the "success" query parameter
    params.delete("success");

    // Update the URL without causing a full page reload
    router.replace(`/my-homes?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Listing Created Successfully!</h2>
        <p className="mb-6">Your new listing has been successfully created.</p>
        <Button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          onClick={handleClose} // Use handleClose to close the modal and remove the query parameter
        >
          Go to My Listings
        </Button>
      </div>
    </div>
  );
}