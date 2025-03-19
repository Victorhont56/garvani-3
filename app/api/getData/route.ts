import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') ?? undefined;
  const country = searchParams.get('country') ?? undefined;
  const guest = searchParams.get('guest') ?? undefined;
  const room = searchParams.get('room') ?? undefined;
  const bathroom = searchParams.get('bathroom') ?? undefined;
  const userId = searchParams.get('userId') ?? undefined;

  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedLoaction: true,
      addedDescription: true,
      categoryName: filter,
      country: country,
      guests: guest,
      bedrooms: room,
      bathrooms: bathroom,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      Favorite: {
        where: {
          userId: userId ?? undefined,
        },
      },
    },
  });

  return NextResponse.json(data);
}