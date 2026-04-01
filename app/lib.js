import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

let tablesInitialized = false;

export async function initTables() {
  if (tablesInitialized) return;
  
  try {
    console.log('🔄 Создание таблиц...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        image VARCHAR(500),
        stock INT DEFAULT 0,
        rating DECIMAL(2,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        address TEXT,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_name VARCHAR(200),
        price DECIMAL(10,2),
        quantity INT
      )
    `;
    
    // Добавляем тестовые товары, если таблица пустая
    const products = await sql`SELECT * FROM products`;
    if (products.rows.length === 0) {
      console.log('🔄 Добавление тестовых товаров...');
      await seedProducts();
    }
    
    tablesInitialized = true;
    console.log('✅ Все таблицы магазина созданы/проверены');
  } catch (error) {
    console.error('❌ Ошибка при создании таблиц:', error.message);
  }
}

async function seedProducts() {
  const testProducts = [
    { name: 'iPhone 15 Pro', description: 'Флагманский смартфон Apple с Titanium корпусом', price: 99990, category: 'phones', image: '📱', stock: 10, rating: 4.8 },
    { name: 'Samsung Galaxy S24', description: 'Мощный Android смартфон с AI функциями', price: 89990, category: 'phones', image: '📱', stock: 15, rating: 4.7 },
    { name: 'MacBook Pro 14"', description: 'Ноутбук для профессионалов с M3 чипом', price: 199990, category: 'laptops', image: '💻', stock: 5, rating: 4.9 },
    { name: 'Sony WH-1000XM5', description: 'Беспроводные наушники с шумоподавлением', price: 29990, category: 'audio', image: '🎧', stock: 20, rating: 4.8 },
    { name: 'iPad Air', description: 'Планшет для творчества и учебы', price: 59990, category: 'tablets', image: '📟', stock: 8, rating: 4.6 },
    { name: 'Apple Watch Series 9', description: 'Умные часы с новыми функциями', price: 39990, category: 'wearables', image: '⌚', stock: 12, rating: 4.7 },
    { name: 'Xiaomi Redmi Note 13', description: 'Доступный смартфон с отличной камерой', price: 24990, category: 'phones', image: '📱', stock: 25, rating: 4.5 },
    { name: 'Dell XPS 15', description: 'Мощный ноутбук для работы и творчества', price: 159990, category: 'laptops', image: '💻', stock: 7, rating: 4.7 },
  ];
  
  for (const product of testProducts) {
    await sql`
      INSERT INTO products (name, description, price, category, image, stock, rating)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.image}, ${product.stock}, ${product.rating})
    `;
  }
}

// Получаем правильный клиент для запросов
function getDb() {
  return getSql();
}

// Пользователи
export async function getUserByEmail(email) {
  try {
    const db = getDb();
    const rows = await db`SELECT * FROM users WHERE email = ${email}`;
    return rows[0];
  } catch (error) {
    console.error('Ошибка поиска:', error.message);
    return null;
  }
}

export async function createUser(email, password, name, phone = '') {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();
    const rows = await db`
      INSERT INTO users (email, password, name, phone)
      VALUES (${email}, ${hashedPassword}, ${name}, ${phone})
      RETURNING id, email, name
    `;
    return rows[0];
  } catch (error) {
    console.error('Ошибка создания:', error.message);
    throw error;
  }
}

// Товары
export async function getAllProducts(category = null) {
  try {
    const db = getDb();
    if (category && category !== 'all') {
      const rows = await db`
        SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC
      `;
      return rows;
    }
    const rows = await db`SELECT * FROM products ORDER BY created_at DESC`;
    return rows;
  } catch (error) {
    console.error('Ошибка получения товаров:', error.message);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const db = getDb();
    const rows = await db`SELECT * FROM products WHERE id = ${id}`;
    return rows[0];
  } catch (error) {
    console.error('Ошибка получения товара:', error.message);
    return null;
  }
}

// Корзина
export async function getCart(userId) {
  try {
    const db = getDb();
    const rows = await db`
      SELECT ci.*, p.name, p.price, p.image, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `;
    return rows;
  } catch (error) {
    console.error('Ошибка получения корзины:', error.message);
    return [];
  }
}

export async function addToCart(userId, productId, quantity = 1) {
  try {
    const db = getDb();
    const existing = await db`
      SELECT * FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId}
    `;
    
    if (existing.length > 0) {
      await db`
        UPDATE cart_items SET quantity = quantity + ${quantity}
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
    } else {
      await db`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
      `;
    }
    return { success: true };
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error.message);
    throw error;
  }
}

export async function updateCartItem(userId, productId, quantity) {
  try {
    const db = getDb();
    if (quantity <= 0) {
      await db`
        DELETE FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId}
      `;
    } else {
      await db`
        UPDATE cart_items SET quantity = ${quantity}
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
    }
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления корзины:', error.message);
    throw error;
  }
}

export async function clearCart(userId) {
  try {
    const db = getDb();
    await db`DELETE FROM cart_items WHERE user_id = ${userId}`;
    return { success: true };
  } catch (error) {
    console.error('Ошибка очистки корзины:', error.message);
    throw error;
  }
}

// Заказы
export async function createOrder(userId, address, phone) {
  try {
    const db = getDb();
    const cart = await getCart(userId);
    if (cart.length === 0) throw new Error('Корзина пуста');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const rows = await db`
      INSERT INTO orders (user_id, total, address, phone)
      VALUES (${userId}, ${total}, ${address}, ${phone})
      RETURNING id
    `;
    
    const orderId = rows[0].id;
    
    for (const item of cart) {
      await db`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (${orderId}, ${item.product_id}, ${item.name}, ${item.price}, ${item.quantity})
      `;
      
      await db`
        UPDATE products SET stock = stock - ${item.quantity}
        WHERE id = ${item.product_id}
      `;
    }
    
    await clearCart(userId);
    
    return { success: true, orderId };
  } catch (error) {
    console.error('Ошибка создания заказа:', error.message);
    throw error;
  }
}

export async function getUserOrders(userId) {
  try {
    const db = getDb();
    const rows = await db`
      SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Ошибка получения заказов:', error.message);
    return [];
  }
}