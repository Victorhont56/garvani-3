import { auth } from "@clerk/nextjs";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { NoItems } from "../components/NoItem";
import { ListingCard } from "../components/ListingCard";
import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";

type FavoriteWithHome = Prisma.FavoriteGetPayload<{
  include: {
    Home: {
      include: {
        Favorite: true;
      };
    };
  };
}>;

async function getData(userId: string): Promise<FavoriteWithHome[]> {
  noStore();

  const data = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    include: {
      Home: {
        include: {
          Favorite: true,
        },
      },
    },
  });

  return data;
}

export default async function FavoriteRoute() {
  // Use Clerk's auth instead of Kinde's getKindeServerSession
  const { userId } = auth();

  if (!userId) return redirect("/");

  const data = await getData(userId);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>

      {data.length === 0 ? (
        <NoItems
          title="Hey, you don't have any favorites"
          description="Please add favorites to see them right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
         {data.map((item) => {
          if (!item.Home) return null; // ⬅️ Early return if Home is null

        return (
          <ListingCard
            key={item.Home.id}
            state={item.Home.state || ""}
            title={item.Home.title || ""}
            lga={item.Home.lga || ""}
            mode={item.Home.mode || ""}
            pathName="/favorites"
            homeId={item.Home.id}
            imagePath={item.Home.photo || ""}
            price={item.Home.price || 0}
            userId={userId}
            favoriteId={item.Home.Favorite[0]?.id || ""}
            isInFavoriteList={(item.Home.Favorite.length || 0) > 0}
          />
        );
      })}


        </div>
      )}
    </section>
  );
}
