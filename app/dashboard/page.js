"use client";

export const dynamic = 'force-dynamic'

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session?.user?.id) {
      fetchPolicies();
      fetchTickets();
    }
  }, [mounted, session]);

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/policies');
      const data = await res.json();
      if (data.success) setPolicies(data.policies);
    } catch (error) {
      console.error('Ошибка загрузки полисов:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (error) {
      console.error('Ошибка загрузки обращений:', error);
    }
  };

  if (status === "loading" || !mounted) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "1.2rem", color: "var(--gray)" }}>Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const getTypeName = (type) => {
    const types = {
      auto: '🚗 Автострахование',
      property: '🏠 Недвижимость',
      health: '❤️ Здоровье',
      travel: '✈️ Путешествия'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { background: '#10b981', color: 'white' },
      expired: { background: '#ef4444', color: 'white' },
      pending: { background: '#f59e0b', color: 'white' },
      new: { background: '#3b82f6', color: 'white' },
      in_progress: { background: '#f59e0b', color: 'white' },
      resolved: { background: '#10b981', color: 'white' }
    };
    const names = {
      active: 'Активен',
      expired: 'Истек',
      pending: 'На рассмотрении',
      new: 'Новое',
      in_progress: 'В обработке',
      resolved: 'Решено'
    };
    return (
      <span style={{
        background: styles[status]?.background || '#6b7280',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        display: 'inline-block'
      }}>
        {names[status] || status}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Шапка дашборда */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: '#1f2937' }}>
            Добро пожаловать, {session.user.name || session.user.email.split('@')[0]}!
          </h2>
          <div style={{
            background: '#f3f4f6',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            color: '#059669',
            fontWeight: '500',
            wordBreak: 'break-all',
            display: 'inline-block'
          }}>
            📧 {session.user.email}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            background: '#ef4444',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
        >
          Выйти
        </button>
      </div>

      {/* Вкладки */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0.5rem'
      }}>
        {['overview', 'policies', 'tickets', 'new'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? '#059669' : 'transparent',
              color: activeTab === tab ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {tab === 'overview' && '📊 Обзор'}
            {tab === 'policies' && `📄 Мои полисы (${policies.length})`}
            {tab === 'tickets' && `💬 Обращения (${tickets.length})`}
            {tab === 'new' && '➕ Оформить полис'}
          </button>
        ))}
      </div>

      {/* Обзор */}
      {activeTab === 'overview' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#6b7280' }}>Активные полисы</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>
                {policies.filter(p => p.status === 'active').length}
              </p>
              <button
                onClick={() => setActiveTab('policies')}
                style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Управлять
              </button>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#6b7280' }}>Открытые обращения</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>
                {tickets.filter(t => t.status !== 'resolved').length}
              </p>
              <button
                onClick={() => setActiveTab('tickets')}
                style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Смотреть
              </button>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#6b7280' }}>Скидка за лояльность</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>15%</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>На следующий полис</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>⚡ Быстрые действия</h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveTab('new')}
                style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Оформить новый полис
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Создать обращение
              </button>
              <button
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Загрузить документы
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Мои полисы */}
      {activeTab === 'policies' && (
        <div>
          {policies.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <p style={{ marginBottom: '1rem', color: '#6b7280' }}>У вас пока нет оформленных полисов</p>
              <button
                onClick={() => setActiveTab('new')}
                style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Оформить первый полис
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {policies.map(policy => (
                <div key={policy.id} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#059669' }}>
                    {getTypeName(policy.type)}
                  </h3>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>№ полиса:</strong> {policy.policy_number}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Сумма:</strong> {policy.amount.toLocaleString()} ₽
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Период:</strong> {new Date(policy.start_date).toLocaleDateString()} - {new Date(policy.end_date).toLocaleDateString()}
                  </p>
                  <div style={{ margin: '1rem 0' }}>
                    {getStatusBadge(policy.status)}
                  </div>
                  <button
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '2px solid #059669',
                      color: '#059669',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Скачать полис
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Обращения */}
      {activeTab === 'tickets' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Создать новое обращение</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subject: formData.get('subject'),
                  message: formData.get('message')
                })
              });
              if (res.ok) {
                fetchTickets();
                e.target.reset();
                alert('Обращение отправлено!');
              } else {
                alert('Ошибка при отправке');
              }
            }}>
              <input
                name="subject"
                placeholder="Тема обращения"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              />
              <textarea
                name="message"
                placeholder="Сообщение"
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Отправить
              </button>
            </form>
          </div>

          {tickets.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <p style={{ color: '#6b7280' }}>У вас пока нет обращений</p>
            </div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{ticket.subject}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{ticket.message}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Оформление полиса */}
      {activeTab === 'new' && (
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
            Оформление полиса
          </h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/api/policies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: formData.get('type'),
                amount: parseInt(formData.get('amount')),
                duration: parseInt(formData.get('duration'))
              })
            });
            if (res.ok) {
              fetchPolicies();
              setActiveTab('policies');
              alert('Полис успешно оформлен!');
            } else {
              alert('Ошибка при оформлении');
            }
          }}>
            <select
              name="type"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="">Выберите тип страхования</option>
              <option value="auto">🚗 Автострахование (ОСАГО/КАСКО)</option>
              <option value="property">🏠 Страхование недвижимости</option>
              <option value="health">❤️ Добровольное медицинское страхование</option>
              <option value="travel">✈️ Страхование путешествий</option>
            </select>
            <input
              name="amount"
              type="number"
              placeholder="Страховая сумма (₽)"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}
            />
            <select
              name="duration"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="12">12 месяцев</option>
              <option value="6">6 месяцев</option>
              <option value="3">3 месяца</option>
            </select>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#059669',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Оформить полис
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>}>
        <DashboardContent />
      </Suspense>
    </SessionProvider>
  );
}