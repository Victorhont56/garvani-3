"use client"
import Image from "next/image";
import Link from "next/link";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { DeleteFromFavorite, addToFavorite } from "../actions";

interface iAppProps {
  imagePath: string;
  title: string;
  state: string;
  lga: string;
  mode: string;
  price: number;
  userId: string | null | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathName: string;
}

export function ListingCard({
  imagePath,
  state,
  lga,
  mode,
  title,
  price,
  userId,
  favoriteId,
  homeId,
  isInFavoriteList,
  pathName,
}: iAppProps) {
  return (
    <Link href={`/home/${homeId}`} className="mt-2">
      <div className="items-center justify-center w-[270px] flex flex-col bg-[#e7e7d0] rounded-2xl hover:border-[3px] hover:border-gray-300 hover:shadow-2xl shadow:xl md:shadow-none lg:shadow:none transition duration-300 ease-in-out">
        <div className="flex flex-col items-center justify-center">
          <div className="my-[10px]">
            <div className="w-[250px] flex flex-row items-center justify-between">
              <h3 className="font-medium text-[#6D7280]">
                For {mode} {/* Display the mode */}
              </h3>
              <p className="text-muted-foreground">
                <span className="font-medium text-black">${price}</span> /Month
              </p>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {title}
            </p>
          </div>

          <div className="relative h-[200px] w-[250px]">
            <div>
              <Image
                src={imagePath}
                alt="Image of House"
                fill
                className="rounded-lg h-full object-cover"
              />

              {userId && (
                <div className="z-10 absolute top-2 right-2">
                  {isInFavoriteList ? (
                    <form action={DeleteFromFavorite}>
                      <input type="hidden" name="favoriteId" value={favoriteId} />
                      <input type="hidden" name="userId" value={userId} />
                      <input type="hidden" name="pathName" value={pathName} />
                      <DeleteFromFavoriteButton />
                    </form>
                  ) : (
                    <form action={addToFavorite}>
                      <input type="hidden" name="homeId" value={homeId} />
                      <input type="hidden" name="userId" value={userId} />
                      <input type="hidden" name="pathName" value={pathName} />
                      <AddToFavoriteButton />
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Display state and lga */}
          <div className="my-[10px]">
            <div className="flex justify-between w-[250px]">
              <h3 className="font-medium text-base">{state}</h3>
              <h3 className="font-medium text-base">{lga}</h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}