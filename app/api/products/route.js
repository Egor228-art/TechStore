import { getAllProducts } from "../../lib";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const products = await getAllProducts(category);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}