'use client'
import { Suspense } from "react";
import { SkeltonCard } from "../components/SkeletonCard";
import { NoItems } from "../components/NoItem";
import { ListingCard } from "../components/ListingCard";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    state?: string;
    lga?: string;
    mode?: string;
    type?: string;
    guest?: string;
    room?: string;
    bathroom?: string;
  };
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShowItems({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    state?: string;
    lga?: string;
    mode?: string;
    type?: string;
    guest?: string;
    room?: string;
    bathroom?: string;
  };
}) {
  const [data, setData] = useState<any[]>([]);
  const { userId } = useAuth(); // ✅ Get client-side user ID directly
  const safeUserId = userId ?? undefined;

  useEffect(() => {
    if (safeUserId !== undefined) {
      const fetchData = async () => {
        const params = new URLSearchParams({
          ...searchParams,
          userId: safeUserId,
        }).toString();
        const response = await fetch(`/api/getData?${params}`);
        const data = await response.json();
        setData(data);
      };
      fetchData();
    }
  }, [searchParams, safeUserId]);

  return (
    <>
      {data.length === 0 ? (
        <NoItems
          description="Please check another category or create your own listing!"
          title="Sorry no listings found for this category..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              description={item.description as string}
              imagePath={item.photo as string}
              state={item.state as string}
              lga={item.lga as string}
              mode={item.mode as string}
              type={item.type as string}
              price={item.price as number}
              userId={userId}
              favoriteId={item.Favorite[0]?.id}
              isInFavoriteList={item.Favorite.length > 0}
              homeId={item.id}
              pathName="/"
            />
          ))}
        </div>
      )}
    </>
  );
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      {Array.from({ length: 9 }).map((_, index) => (
        <SkeltonCard key={index} />
      ))}
    </div>
  );
}