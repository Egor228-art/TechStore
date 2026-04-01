import { getAllProducts, initTables } from "../../lib";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Создаем таблицы при первом запросе
    await initTables();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const products = await getAllProducts(category);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}