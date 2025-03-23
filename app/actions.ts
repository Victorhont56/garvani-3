"use server";

import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";

// Create a new Airbnb home and return the homeId
export async function createAirbnbHome({ userId }: { userId: string }) {
  try {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });

    // Redirect to the description page for the new home
    redirect(`/create/${data.id}/description`);
  } catch (error) {
    console.error("Error creating home:", error);
    throw new Error("Failed to create home.");
  }
}
// Update the home with description, price, and image
export async function CreateDescription(formData: FormData) {
  try {
    console.log("Form Data in Server Action:", {
      homeId: formData.get("homeId"),
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      state: formData.get("state"),
      lga: formData.get("lga"),
      mode: formData.get("mode"),
      type: formData.get("type"),
      livingroom: formData.get("livingroom"),
      bedroom: formData.get("bedroom"),
      bathroom: formData.get("bathroom"),
      image: formData.get("image"),
    });

    const homeId = formData.get("homeId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File;
    const state = formData.get("state") as string;
    const lga = formData.get("lga") as string;
    const mode = formData.get("mode") as string;
    const type = formData.get("type") as string;
    const livingroomNumber = formData.get("livingroom") as string;
    const bedroomNumber = formData.get("bedroom") as string;
    const bathroomNumber = formData.get("bathroom") as string;

    // Upload image to Supabase Storage
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
        throw new Error("Failed to upload image.");
      }

      imagePath = imageData?.path;
    }

    // Update the home in the database
    await prisma.home.update({
      where: {
        id: homeId,
      },
      data: {
        title: title,
        description: description,
        bedrooms: bedroomNumber,
        bathrooms: bathroomNumber,
        livingrooms: livingroomNumber,
        state: state,
        lga: lga,
        mode: mode,
        type: type,
        photo: imagePath,
        price: Number(price),
        addedDescription: true,
      },
    });

    console.log("Home updated successfully");
    redirect(`/create/${homeId}/address`); // Redirect after successful update
  } catch (error) {
    console.error("Error updating home description:", error);
    throw new Error("Failed to update home description.");
  }
}

// Create a category page
export async function createCategoryPage(formData: FormData) {
  try {
    const categoryName = formData.get("categoryName") as string;
    const homeId = formData.get("homeId") as string;

    const data = await prisma.home.update({
      where: {
        id: homeId,
      },
      data: {
        categoryName: categoryName,
        addedCategory: true,
      },
    });

    return redirect(`/create/${homeId}/description`);
  } catch (error) {
    console.error("Error creating category page:", error);
    throw new Error("Failed to create category page.");
  }
}

// Add a home to favorites
export async function addToFavorite(formData: FormData) {
  try {
    const homeId = formData.get("homeId") as string;
    const userId = formData.get("userId") as string;
    const pathName = formData.get("pathName") as string;

    const data = await prisma.favorite.create({
      data: {
        homeId: homeId,
        userId: userId,
      },
    });

    revalidatePath(pathName);
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error("Failed to add to favorites.");
  }
}

// Remove a home from favorites
export async function DeleteFromFavorite(formData: FormData) {
  try {
    const favoriteId = formData.get("favoriteId") as string;
    const pathName = formData.get("pathName") as string;
    const userId = formData.get("userId") as string;

    const data = await prisma.favorite.delete({
      where: {
        id: favoriteId,
        userId: userId,
      },
    });

    revalidatePath(pathName);
  } catch (error) {
    console.error("Error deleting from favorites:", error);
    throw new Error("Failed to delete from favorites.");
  }
}

// Create a reservation
export async function createReservation(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const homeId = formData.get("homeId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const data = await prisma.reservation.create({
      data: {
        userId: userId,
        endDate: endDate,
        startDate: startDate,
        homeId: homeId,
      },
    });

    return redirect("/");
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw new Error("Failed to create reservation.");
  }
}