import { createUser, getUserByEmail } from "../../lib";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    console.log('Регистрация:', { email, name });
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    }
    
    // Проверка существующего пользователя
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email уже зарегистрирован" },
        { status: 400 }
      );
    }
    
    // Создание пользователя
    const newUser = await createUser(email, password, name);
    
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка:', error);
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}