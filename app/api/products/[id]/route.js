import { getProductById } from "../../../lib";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const product = await getProductById(parseInt(params.id));
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}