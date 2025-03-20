import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);  // ✅ Now works without .from()
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
   
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.imageUrl,
      },
    });
  }

  const { searchParams } = request.nextUrl;  // ✅ Use request.nextUrl instead of new URL()
  const filter = searchParams.get('filter') ?? undefined;
  const mode = searchParams.get('mode') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const state = searchParams.get('state') ?? undefined;
  const lga = searchParams.get('lga') ?? undefined;
  const livingrooms = searchParams.get('room') ?? undefined;
  const bedrooms = searchParams.get('bedroom') ?? undefined;
  const bathroom = searchParams.get('bathroom') ?? undefined;
  const queryUserId = searchParams.get('userId') ?? undefined;

  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedDescription: true,
      categoryName: filter,
      mode: mode,
      type: type,
      state: state,
      lga: lga,
      livingrooms: livingrooms,
      bedrooms: bedrooms,
      bathrooms: bathroom,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      Favorite: {
        where: {
          userId: queryUserId,
        },
      },
    },
  });

  return NextResponse.json(data);
}
