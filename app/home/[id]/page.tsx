/* eslint-disable @next/next/no-img-element */

import { createReservation } from "@/app/actions";
import { CategoryShowcase } from "@/app/components/CategoryShowcase";
import { SelectCalender } from "@/app/components/SelectCalender";
import { ReservationSubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

async function getData(homeid: string) {
  noStore();
  const data = await prisma.home.findUnique({
    where: {
      id: homeid,
    },
    select: {
      photo: true,
      images: true, // Add this to fetch all images
      description: true,
      state: true,
      lga: true,
      mode: true,
      type: true,
      bedrooms: true,
      bathrooms: true,
      title: true,
      categoryName: true,
      price: true,
      Reservation: {
        where: {
          homeId: homeid,
        },
      },
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  });

  return data;
}

export default async function HomeRoute({
  params,
}: {
  params: { id: string };
}) {
  const data = await getData(params.id);
  const { userId } = auth();

  // Create an array of all images (primary photo + additional images)
  const allImages = [
    data?.photo,
    ...(data?.images || [])
  ].filter(Boolean) as string[];

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
      
      {/* Image Gallery */}
      <div className="mb-8">
        {/* Main Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[550px] rounded-lg overflow-hidden">
                  <Image
                    alt={`Property image ${index + 1}`}
                    src={`https://fvqkucnkeeykqwfzutzw.supabase.co/storage/v1/object/public/images/${image}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
        
        {/* Thumbnail Navigation */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2 mt-4">
            {allImages.map((image, index) => (
              <div 
                key={index} 
                className="relative h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition border-2 border-transparent hover:border-secondary"
              >
                <Image
                  alt={`Thumbnail ${index + 1}`}
                  src={`https://fvqkucnkeeykqwfzutzw.supabase.co/storage/v1/object/public/images/${image}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-x-24 mt-8">
        <div className="w-2/3">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-medium bg-secondary/10 px-3 py-1 rounded-full">
              For {data?.mode}
            </h3>
            <h3 className="text-xl font-medium bg-secondary/10 px-3 py-1 rounded-full">
              {data?.type}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-medium">
              <span className="text-muted-foreground">State:</span> {data?.state}
            </h3>
            <h3 className="text-xl font-medium">
              <span className="text-muted-foreground">LGA:</span> {data?.lga}
            </h3>
          </div>

          <div className="flex gap-x-4 text-muted-foreground mb-6">
            <p className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {data?.bedrooms} {parseInt(data?.bedrooms || '0') === 1 ? 'Bedroom' : 'Bedrooms'}
            </p>
            <p className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M2 8h20M6 4v4"></path>
              </svg>
{data?.bedrooms} {parseInt(data?.bedrooms || '0') === 1 ? 'Bedroom' : 'Bedrooms'}
            </p>
          </div>

          <div className="flex items-center mt-6">
            <img
              src={
                data?.User?.profileImage ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="User Profile"
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">
                Hosted by {data?.User?.firstName}
              </h3>
              <p className="text-sm text-muted-foreground">Host since 2015</p>
            </div>
          </div>

          <Separator className="my-7" />

          <CategoryShowcase label={data?.categoryName as string} />

          <Separator className="my-7" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mb-4">About this property</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data?.description}</p>
          </div>

          <Separator className="my-7" />
        </div>

        {/* Reservation Form */}
        <div className="w-1/3">
          <div className="sticky top-28">
            <div className="border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">${data?.price}</h3>
                <span className="text-muted-foreground">
                  {data?.mode === 'Rent' ? 'per month' : 'total price'}
                </span>
              </div>
              
              <form action={createReservation}>
                <input type="hidden" name="homeId" value={params.id} />
                <input type="hidden" name="userId" value={userId ?? ""} />

                <SelectCalender reservation={data?.Reservation} />

                {userId ? (
                  <ReservationSubmitButton />
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/sign-in">Make a Reservation</Link>
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}