import { auth } from "@clerk/nextjs"; // Import Clerk's auth function
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { NoItems } from "../components/NoItem";
import { ListingCard } from "../components/ListingCard";
import { unstable_noStore as noStore } from "next/cache";

// Define the type for the Favorite object
interface Favorite {
  id: string;
  userId: string | null;
  homeId: string | null;
  createAt: Date;
}

// Define the type for the Home object
interface Home {
  id: string;
  photo: string | null;
  description: string | null;
  price: number | null;
  state: string | null;
  lga: string | null;
  mode: string | null;
  type: string | null;
  Favorite: Favorite[];
  createdAT: Date; // Match the Prisma schema (uppercase AT)
}

// Define the return type of the getData function
async function getData(userId: string): Promise<Home[]> {
  noStore();
  const data = await prisma.home.findMany({
    where: {
      userId: userId,
      addedCategory: true,
      addedDescription: true,

    },
    select: {
      id: true,
      photo: true,
      description: true,
      price: true,
      state: true,
      lga: true,
      mode: true,
      type: true,
      Favorite: {
        where: {
          userId: userId,
        },
      },
      createdAT: true, // Ensure this matches the Prisma schema
    },
    orderBy: {
      createdAT: "desc",
    },
  });

  return data as Home[];
}

export default async function MyHomes() {
  const { userId } = auth(); // Get the authenticated user's ID from Clerk

  if (!userId) {
    return redirect("/"); // Redirect if the user is not authenticated
  }

  const data = await getData(userId);

  return (
    <section className="container mx-auto px-5 lg:px-10 my-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>

      {data.length === 0 ? (
        <NoItems
          description="Please list a home on Garvani so that you can see it right here"
          title="You don't have any Homes listed"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              imagePath={item.photo ?? ""} // Handle null case
              homeId={item.id}
              price={item.price ?? 0} // Handle null case
              description={item.description ?? ""} // Handle null case
              state={item.state ?? ""} // Handle null case
              lga={item.lga ?? ""} // Handle null case
              mode={item.mode ?? ""} // Handle null case
              type={item.type ?? ""} // Handle null case
              userId={userId}
              pathName="/my-homes"
              favoriteId={item.Favorite[0]?.id}
              isInFavoriteList={item.Favorite.length > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}