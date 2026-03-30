import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const sections = [
    {
      id: 'quick-commerce',
      title: 'Quick Commerce',
      subtitle: 'Fastest delivery, best price',
      description: 'Compare prices across instant delivery platforms. Find the best unit value before you order.',
      providers: ['Open Food Facts', 'DummyJSON', 'FakeStore'],
      accent: '#2E7D32',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce',
      subtitle: 'Smart online shopping',
      description: 'Compare packaged goods and everyday products across multiple ecommerce data sources.',
      providers: ['DummyJSON', 'FakeStore', 'Open Food Facts'],
      accent: '#1B5E20',
    },
    {
      id: 'food',
      title: 'Food & Grocery',
      subtitle: 'Eat well, spend less',
      description: 'Real grocery data with full nutritional info. Compare dairy, snacks, beverages and more.',
      providers: ['Open Food Facts', 'DummyJSON', 'FakeStore'],
      accent: '#33691E',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0E0E0E',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #1E1E1E',
        backgroundColor: '#0E0E0E',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '800',
            color: '#fff',
          }}>P</div>
          <span style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#F0EDE8',
            letterSpacing: '-0.5px',
          }}>
            Pram<span style={{ color: '#4CAF50' }}>ā</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => { setAuthMode('login'); setShowAuth(true) }}
            style={{
              background: 'transparent',
              border: '1px solid #2C2C2C',
              color: '#F0EDE8',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#4CAF50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2C2C2C'}
          >
            Log in
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
            style={{
              background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
              border: 'none',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '80px 20px 60px',
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#1A2E1A',
          border: '1px solid #2E7D32',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '13px',
          color: '#4CAF50',
          fontWeight: '500',
          marginBottom: '24px',
          letterSpacing: '0.3px',
        }}>
          Smart price intelligence
        </div>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '800',
          color: '#F0EDE8',
          letterSpacing: '-2px',
          lineHeight: '1.1',
          marginBottom: '16px',
        }}>
          Stop overpaying.<br />
          <span style={{ color: '#4CAF50' }}>Start comparing.</span>
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#9E9E9E',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          Pramā compares unit prices across platforms so you always know where to buy smarter.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '0 48px 80px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => router.push(`/${section.id}`)}
            style={{
              backgroundColor: '#D4C9B0',
              border: '1px solid #BFB49A',
              borderRadius: '20px',
              padding: '36px 32px',
              width: '300px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#2E7D32'
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(46,125,50,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#BFB49A'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Green accent top bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2E7D32, #66BB6A)',
              borderRadius: '20px 20px 0 0',
            }} />

            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1A1A1A',
              marginBottom: '6px',
              letterSpacing: '-0.3px',
            }}>
              {section.title}
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#2E7D32',
              fontWeight: '600',
              marginBottom: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {section.subtitle}
            </p>

            <p style={{
              fontSize: '14px',
              color: '#3D3D3D',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              {section.description}
            </p>

            {/* Provider pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {section.providers.map((p, i) => (
                <span key={i} style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#1A2E1A',
                  color: '#66BB6A',
                  border: '1px solid #2E7D32',
                }}>
                  {p}
                </span>
              ))}
            </div>

            {/* Arrow button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1A1A1A',
              }}>
                Explore →
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
              }}>
                →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div
          onClick={() => setShowAuth(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2C2C2C',
              borderRadius: '20px',
              padding: '40px',
              width: '400px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowAuth(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#9E9E9E',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >×</button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '800',
                color: '#fff',
                margin: '0 auto 16px',
              }}>P</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#F0EDE8',
                marginBottom: '8px',
              }}>
                {authMode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ fontSize: '14px', color: '#9E9E9E' }}>
                {authMode === 'login' ? 'Log in to your Pramā account' : 'Start comparing smarter today'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full name"
                  style={{
                    backgroundColor: '#0E0E0E',
                    border: '1px solid #2C2C2C',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#F0EDE8',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4CAF50'}
                  onBlur={e => e.target.style.borderColor = '#2C2C2C'}
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                style={{
                  backgroundColor: '#0E0E0E',
                  border: '1px solid #2C2C2C',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#F0EDE8',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                }}
                onFocus={e => e.target.style.borderColor = '#4CAF50'}
                onBlur={e => e.target.style.borderColor = '#2C2C2C'}
              />
              <input
                type="password"
                placeholder="Password"
                style={{
                  backgroundColor: '#0E0E0E',
                  border: '1px solid #2C2C2C',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#F0EDE8',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                }}
                onFocus={e => e.target.style.borderColor = '#4CAF50'}
                onBlur={e => e.target.style.borderColor = '#2C2C2C'}
              />

              <button style={{
                background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                border: 'none',
                color: '#fff',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px',
              }}>
                {authMode === 'login' ? 'Log in' : 'Create account'}
              </button>

              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#9E9E9E',
              }}>
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <span
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: '500' }}
                >
                  {authMode === 'login' ? 'Sign up' : 'Log in'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}