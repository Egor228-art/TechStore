import { createUser, getUserByEmail, initTables } from "../../lib";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Создаем таблицы при первом запросе
    await initTables();
    
    const { email, password, name, phone } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    }
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email уже зарегистрирован" },
        { status: 400 }
      );
    }
    
    const newUser = await createUser(email, password, name, phone);
    
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}