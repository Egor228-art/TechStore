"use client";

export const dynamic = 'force-dynamic'

import { useState } from 'react'

const faqs = [
  { question: 'Сколько стоит доставка?', answer: 'Доставка по Москве — 300 ₽, бесплатно при заказе от 5000 ₽. По России — от 500 ₽, бесплатно от 10000 ₽.' },
  { question: 'Какая гарантия на товары?', answer: 'Гарантия на все товары составляет 12 месяцев. На некоторые категории — 24 месяца.' },
  { question: 'Как вернуть товар?', answer: 'Вы можете вернуть товар в течение 14 дней после покупки при условии сохранения товарного вида.' },
  { question: 'Есть ли рассрочка?', answer: 'Да, мы сотрудничаем с банками-партнерами. Рассрочка доступна на срок до 12 месяцев без переплаты.' },
  { question: 'Как отследить заказ?', answer: 'После отправки заказа вы получите трек-номер на email для отслеживания.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div>
      <div className="page-hero">
        <h1>Часто задаваемые вопросы</h1>
        <p>Ответы на популярные вопросы</p>
      </div>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: 'white', borderRadius: '1rem', marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontWeight: '600' }} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span>{faq.question}</span>
                <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--gray)', borderTop: '1px solid #e5e7eb' }}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}