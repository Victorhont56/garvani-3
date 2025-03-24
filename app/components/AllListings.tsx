"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {ListingCard} from "./ListingCard";
import CategoryCarousal from "./CategoryCarousal";
import { SearchModalComponentThree } from "./SearchComponentThree";
import { FaPlus } from "react-icons/fa6";

interface Listing {
  id: string;
  photo: string;
  description: string;
  state: string;
  lga: string;
  mode: string;
  type: string;
  price: number;
  Favorite: { id: string; userId: string }[];
}

export default function AllListings() {
  const { user } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [mode, setMode] = useState<"Rent" | "Sale">("Rent");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listings?mode=${mode}`);
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    fetchListings();
  }, [mode, selectedCategory]);

  const filteredListings = selectedCategory
    ? listings.filter((listing) => listing.type === selectedCategory)
    : listings;

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="sticky fixed top-0 bg-white z-[100]  w-full ">
          <h1 className="text-3xl font-bold mb-[10px]">All Listings</h1>

            <div className="flex flex-row justify-between items-center mb-[20px]">
              {/* Toggle Button */}
              <div className="flex flex-start">
                <button
                  onClick={() => setMode("Rent")}
                  className={`flex justify-center px-6 py-2 rounded-l-lg w-[70px] h-[30px] items-center  ${
                    mode === "Rent" ? "bg-secondary text-white" : "bg-gray-200"
                  }`}
                >
                  Rent
                </button>
                <button
                  onClick={() => setMode("Sale")}
                  className={`flex justify-center items-center px-6 py-2 rounded-r-lg w-[70px] h-[30px] ${
                    mode === "Sale" ? "bg-secondary text-white" : "bg-gray-200"
                  }`}
                >
                  Sale
                </button>
              </div>
            
              {/* Search Modal */}
            <button className="bg-primary text-secondary rounded-full px-4 h-[30px]">
              <div className="flex flex-row justify-between items-center gap-4">     
                <span> Add a New Listing</span><span><FaPlus /></span>
              </div>
            </button>
            </div>

            <SearchModalComponentThree />

          {/* Category Carousal */}
          <CategoryCarousal
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
      </div>  
      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            imagePath={listing.photo}
            description={listing.description}
            state={listing.state}
            lga={listing.lga}
            mode={listing.mode}
            type={listing.type}
            price={listing.price}
            userId={user?.id}
            isInFavoriteList={listing.Favorite.some(
              (fav) => fav.userId === user?.id
            )}
            favoriteId={listing.Favorite.find((fav) => fav.userId === user?.id)?.id || ""}
            homeId={listing.id}
            pathName="/all-listings"
          />
        ))}
      </div>
    </div>
  );
}