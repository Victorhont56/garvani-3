import Image from "next/image";
import Link from "next/link";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { DeleteFromFavorite, addToFavorite } from "../actions";

interface iAppProps {
  imagePath: string;
  description: string;
  state: string;
  lga: string;
  mode: string;
  type: string;
  price: number;
  userId: string | null | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathName: string;
}


export function ListingCard({
  description,
  imagePath,
  state,
  lga,
  mode,
  type,
  price,
  userId,
  favoriteId,
  homeId,
  isInFavoriteList,
  pathName,
}: iAppProps) {

  return (
    <div className="flex flex-col">
      <div className="relative h-72">
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

      <Link href={`/home/${homeId}`} className="mt-2">
        <h3 className="font-medium text-base">
          {mode}
        </h3>
        <h3 className="font-medium text-base">
          {type}
        </h3>
        <h3 className="font-medium text-base">
          {state}
        </h3>
        <h3 className="font-medium text-base">
          {lga}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span> Night
        </p>
      </Link>
    </div>
  );
}
