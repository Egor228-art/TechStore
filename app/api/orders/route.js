import { createOrder, getUserOrders } from "../../lib";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    
    const orders = await getUserOrders(session.user.id);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    
    const { address, phone } = await request.json();
    const order = await createOrder(session.user.id, address, phone);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}