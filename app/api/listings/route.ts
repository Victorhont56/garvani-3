import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { headers: { 'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Get Supabase session
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwt);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'type', 'mode', 'state', 'lga'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate images
    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length < 5 || imageFiles.length > 20) {
      return NextResponse.json({ error: "You must upload between 5 and 20 images" }, { status: 400 });
    }

    // Upload images to Supabase
    const uploadedImageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const fileBuffer = await file.arrayBuffer();

        const { error } = await supabaseAdmin.storage
          .from('images')
          .upload(fileName, Buffer.from(fileBuffer), {
            contentType: file.type,
            upsert: false
          });

        if (error) throw new Error(`Failed to upload image: ${error.message}`);

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(fileName);

        return publicUrl;
      })
    );

    // Create listing in database
    const newListing = await prisma.home.create({
      data: {
        userId: user.id,
        categoryName: formData.get("category") as string,
        livingrooms: formData.get("livingroomCount")?.toString() || "0",
        bedrooms: formData.get("bedroomCount")?.toString() || "0",
        bathrooms: formData.get("bathroomCount")?.toString() || "0",
        mode: formData.get("mode") as string,
        type: formData.get("type") as string,
        state: formData.get("state") as string,
        lga: formData.get("lga") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseInt(formData.get("price") as string) || 0,
        photo: uploadedImageUrls[0],
        images: uploadedImageUrls,
        addedCategory: true,
        addedDescription: true,
      },
    });

    return NextResponse.json(
      { message: "Listing created successfully", listing: newListing },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { 
        error: "Failed to create listing",
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    
    // Add filters based on query params
    ['userId', 'state', 'lga', 'mode', 'type', 'filter'].forEach(param => {
      const value = searchParams.get(param);
      if (value) where[param === 'filter' ? 'categoryName' : param] = value;
    });

    // Add numeric filters
    ['livingrooms', 'bedrooms', 'bathrooms'].forEach(param => {
      const value = searchParams.get(param);
      if (value) where[param] = { gte: parseInt(value) };
    });

    const listings = await prisma.home.findMany({
      where,
      include: { Favorite: true },
      orderBy: { createdAT: 'desc' }
    });

    return NextResponse.json(listings);
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings", message: error.message },
      { status: 500 }
    );
  }
}