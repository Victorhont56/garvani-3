import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs"; // Import Clerk's auth function
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/NoItem";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";



type ReservationWithHome = Prisma.ReservationGetPayload<{
  include: {
    Home: {
      include: {
        Favorite: true;
      };
    };
  };
}>;


async function getData(userId: string): Promise<ReservationWithHome[]> {
  noStore();
  const data = await prisma.reservation.findMany({
    where: {
      userId,
    },
    include: {
      Home: {
        include: {
          Favorite: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
  return data;
}

export default async function ReservationsRoute() {
  const { userId } = auth(); // Get the authenticated user's ID from Clerk

  if (!userId) {
    return redirect("/"); // Redirect if the user is not authenticated
  }

  const data = await getData(userId);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">
        Your Reservations
      </h2>

      {data.length === 0 ? (
        <NoItems
          title="Hey, you don't have any Reservations"
          description="Please add a reservation to see it right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
        {data.map((item) => (
          <ListingCard
            key={item.Home?.id}
            state={item.Home?.state || ""}
            title={item.Home?.title || ""}
            lga={item.Home?.lga || ""}
            mode={item.Home?.mode || ""}
            pathName="/favorites"
            homeId={item.Home?.id || ""}
            imagePath={item.Home?.photo || ""}
            price={item.Home?.price || 0}
            userId={userId}
            favoriteId={item.Home?.Favorite[0]?.id || ""}
            isInFavoriteList={(item.Home?.Favorite.length || 0) > 0}
          />
        ))}
        </div>
      )}
    </section>
  );
}