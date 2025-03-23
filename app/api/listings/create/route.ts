// app/api/listings/create/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/app/lib/db";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse form data
    const formData = await request.formData();
    
    // Create a new home first
    const home = await prisma.home.create({
      data: {
        userId: userId,
      },
    });
    
    // Get form values
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const state = formData.get("state") as string;
    const lga = formData.get("lga") as string;
    const mode = formData.get("mode") as string;
    const type = formData.get("type") as string;
    const livingroomNumber = formData.get("livingroom") as string;
    const bedroomNumber = formData.get("bedroom") as string;
    const bathroomNumber = formData.get("bathroom") as string;
    const categoryName = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    
    console.log("Form data received:", { title, description, bedroomNumber, bathroomNumber});
  
  // Upload image to Supabase Storage if it exists
let imagePath = null;
if (imageFile) {
  const { data: imageData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`${imageFile.name}-${new Date().getTime()}`, imageFile, {
      cacheControl: "2592000",
      contentType: imageFile.type,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }

  imagePath = imageData?.path;
}
    
    // Update the home with all details
    const updatedHome = await prisma.home.update({
      where: {
        id: home.id,
      },
      data: {
        title,
        description,
        bedrooms: bedroomNumber,
        bathrooms: bathroomNumber,
        livingrooms: livingroomNumber,
        state,
        lga,
        mode,
        type,
        photo: imagePath,
        price: parseFloat(price),
        categoryName,
        addedCategory: true,
        addedDescription: true,
      },
    });
    
    return NextResponse.json(
      { success: true, homeId: home.id },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create listing" },
      { status: 500 }
    );
  }
}