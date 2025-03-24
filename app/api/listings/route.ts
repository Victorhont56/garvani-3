import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import path from "path";
import fs from "fs";

// GET request handler
export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

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

  const { searchParams } = request.nextUrl;
  const filter = searchParams.get("filter") ?? undefined;
  const mode = searchParams.get("mode") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const state = searchParams.get("state") ?? undefined;
  const lga = searchParams.get("lga") ?? undefined;
  const livingrooms = searchParams.get("room") ?? undefined;
  const bedrooms = searchParams.get("bedroom") ?? undefined;
  const bathroom = searchParams.get("bathroom") ?? undefined;
  const queryUserId = searchParams.get("userId") ?? undefined;

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
      state: true, // Include state
      lga: true,   // Include lga
      mode: true,  // Include mode
      type: true,
      Favorite: {
        where: {
          userId: queryUserId,
        },
      },
    },
  });

  return NextResponse.json(data);
}

// POST request handler
export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the form data from the request
    const formData = await request.formData();

    // Extract fields from the form data
    const category = formData.get("category") as string;
    const livingroomCount = parseInt(formData.get("livingroomCount") as string);
    const bedroomCount = parseInt(formData.get("bedroomCount") as string);
    const bathroomCount = parseInt(formData.get("bathroomCount") as string);
    const mode = formData.get("mode") as string;
    const type = formData.get("type") as string;
    const state = formData.get("state") as string;
    const lga = formData.get("lga") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageFile = formData.get("image") as File | null;

    // Handle file upload (if an image is provided)
    let imageUrl = null;
    if (imageFile) {
      // Save the file to a specific directory (e.g., public/uploads)
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write the file to the upload directory
      const fileBuffer = await imageFile.arrayBuffer();
      fs.writeFileSync(filePath, new Uint8Array(fileBuffer));

      // Set the image URL
      imageUrl = `/uploads/${fileName}`;
    }

    // Create a new listing in the database
    const newListing = await prisma.home.create({
      data: {
        userId: userId,
        categoryName: category,
        livingrooms: livingroomCount.toString(),
        bedrooms: bedroomCount.toString(),
        bathrooms: bathroomCount.toString(),
        mode: mode,
        type: type,
        state: state,
        lga: lga,
        title: title,
        description: description,
        price: price,
        photo: imageUrl,
        addedCategory: true,
        addedDescription: true,
      },
    });

    return NextResponse.json(
      { message: "Listing created successfully", listing: newListing },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}