import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category"; // Make sure this path matches your models folder

export async function GET() {
  try {
    await connectDB();

    const defaultCategories = [
      { name: "Necklaces", slug: "necklaces", description: "Beautiful necklaces" },
      { name: "Earrings", slug: "earrings", description: "Stunning earrings" },
      { name: "Bracelets", slug: "bracelets", description: "Elegant bracelets" },
      { name: "Rings", slug: "rings", description: "Gorgeous rings" },
      { name: "Bags", slug: "bags", description: "Stylish bags" },
    ];

    // Loop through and insert them only if they don't exist
    const results = [];
    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        const newCat = await Category.create(cat);
        results.push(`Created: ${newCat.name}`);
      } else {
        results.push(`Already exists: ${existing.name}`);
      }
    }

    return NextResponse.json({ message: "Categories seeded successfully!", results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}