import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import useAuthStore from '../store/authStore'

export default function Home() {
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [sloganIndex, setSloganIndex] = useState(0)
  const [sloganFade, setSloganFade] = useState(true)

  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')

  const [demoStep, setDemoStep] = useState(0)
  const [demoTyped, setDemoTyped] = useState('')
  const [howVisible, setHowVisible] = useState(false)
  const howRef = useRef(null)

  const { user, isLoggedIn, error: authError, loading: authLoading, hydrate: hydrateAuth, signup, login, logout, clearError } = useAuthStore()
  const [pageLoaded, setPageLoaded] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { hydrateAuth() }, [])
  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100)
    setTimeout(() => setHeroVisible(true), 300)
  }, [])

  // Load Google script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '812748564517-t5nfapg2benii4kagouvagnac41ef55j.apps.googleusercontent.com',
          callback: handleGoogleLogin,
        })
      }
    }
    document.head.appendChild(script)
    return () => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existing) existing.remove()
    }
  }, [])

  useEffect(() => {
    const el = howRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHowVisible(true); obs.unobserve(el) } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!howVisible) return
    const demoText = 'cheapest milk'
    let i = 0
    setDemoStep(1)
    const typeInterval = setInterval(() => {
      i++
      setDemoTyped(demoText.slice(0, i))
      if (i >= demoText.length) {
        clearInterval(typeInterval)
        setTimeout(() => setDemoStep(2), 600)
        setTimeout(() => setDemoStep(3), 2200)
        setTimeout(() => setDemoStep(4), 4000)
        setTimeout(() => { setDemoStep(0); setDemoTyped(''); }, 6500)
      }
    }, 80)
    const loopTimer = setInterval(() => {
      i = 0; setDemoStep(1); setDemoTyped('')
      const t2 = setInterval(() => {
        i++; setDemoTyped(demoText.slice(0, i))
        if (i >= demoText.length) {
          clearInterval(t2)
          setTimeout(() => setDemoStep(2), 600)
          setTimeout(() => setDemoStep(3), 2200)
          setTimeout(() => setDemoStep(4), 4000)
          setTimeout(() => { setDemoStep(0); setDemoTyped('') }, 6500)
        }
      }, 80)
    }, 8000)
    return () => { clearInterval(typeInterval); clearInterval(loopTimer) }
  }, [howVisible])

  const slogans = [
    'Stop overpaying. Start comparing.',
    'Your AI shopping agent.',
    'Compare prices across 3 stores instantly.',
    'Yukti finds the cheapest — you save.',
    'Groceries. Electronics. Meals. All compared.',
    'Pramā never handles your money.',
  ]

  const deals = [
    '🥛 Amul Milk ₹54 on OpenFF vs ₹62 on DummyJSON — Save ₹8',
    '🍕 Margherita Pizza cheapest at ₹175 on DummyJSON',
    '🎧 boAt Earphones 50% off — ₹399 vs ₹799 MRP',
    '🧈 Amul Butter best at ₹230 — ₹25 cheaper than FakeStore',
    '🍔 Classic Burger ₹129 on DummyJSON vs ₹149 on OpenFF',
    '👟 Running Shoes ₹1499 — 50% off across all stores',
    '🍚 Chicken Biryani ₹248 on DummyJSON — Save ₹32 vs OpenFF',
    '📱 Mi Power Bank ₹899 — cheapest on Open Food Facts',
    '🥤 Tropicana Juice ₹99 — ₹11 cheaper than competitors',
    '🧀 Fresh Paneer best at ₹89 on Open Food Facts',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganFade(false)
      setTimeout(() => { setSloganIndex(prev => (prev + 1) % slogans.length); setSloganFade(true) }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const sections = [
    { id: 'quick-commerce', title: 'Quick Commerce', subtitle: 'Fastest delivery, best price', description: 'Compare prices across instant delivery platforms. Find the best unit value before you order.', providers: ['Open Food Facts', 'DummyJSON', 'FakeStore'] },
    { id: 'ecommerce', title: 'E-Commerce', subtitle: 'Smart online shopping', description: 'Compare packaged goods and everyday products across multiple ecommerce data sources.', providers: ['DummyJSON', 'FakeStore', 'Open Food Facts'] },
    { id: 'food', title: 'Food & Meals', subtitle: 'Order smarter, eat better', description: 'Compare meal prices across Zomato, Swiggy and more. Biryani, pizza, burgers — find the cheapest platform every time.', providers: ['Zomato', 'Swiggy', 'EatSure'] },
  ]

  // ✅ Handles email/password auth
  const handleAuth = async () => {
    const ok = authMode === 'login'
      ? await login(authEmail, authPassword)
      : await signup(authName, authEmail, authPassword)
    if (ok) {
      setShowAuth(false)
      setAuthName(''); setAuthEmail(''); setAuthPassword('')
    }
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') await handleAuth()
  }

  // ✅ Handles Google OAuth — sends Google token to our backend
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch('https://prama-backend-j1ol.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('prama_token', JSON.stringify(data.access_token))
        localStorage.setItem('prama_user', JSON.stringify(data.user))
        setShowAuth(false)
        window.location.reload()
      }
    } catch (e) {
      console.error('Google login failed', e)
    }
  }

  const openGooglePopup = () => {
    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      alert('Google sign-in is loading, please try again in a moment.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0806', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', opacity: pageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}>

      {/* Animated grid background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(46,125,50,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,50,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', animation: 'gridPulse 4s ease-in-out infinite' }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#4CAF50', opacity: 0.3, left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%`, animation: `particleFloat ${3 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: '1px solid #1E1C10', backgroundColor: 'rgba(10,8,6,0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: '#FFD700', boxShadow: '0 2px 12px rgba(46,125,50,0.4)', border: '1px solid rgba(76,175,80,0.3)' }}>₹</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, paddingLeft: '7px' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#F0EDE8', letterSpacing: '-0.5px' }}>pram<span style={{ color: '#4CAF50' }}>ā</span></span>
              <span style={{ fontSize: '8px', color: '#5A4A2A', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase' }}>price intel</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isLoggedIn ? (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', boxShadow: '0 0 0 2px #4CAF5040' }}>{user?.name?.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: '14px', color: '#E8DDB8', fontWeight: '500' }}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button onClick={logout} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#8A7A5A', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#F44336'; e.currentTarget.style.color = '#F44336' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#8A7A5A' }}>Log out</button>
          </>) : (<>
            <button onClick={() => { setAuthMode('login'); setShowAuth(true); clearError() }} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#F0EDE8', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#4CAF50'} onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2810'}>Log in</button>
            <button onClick={() => { setAuthMode('signup'); setShowAuth(true); clearError() }} style={{ background: 'linear-gradient(135deg, #2E7D32, #388E3C)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(46,125,50,0.3)' }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}>Sign up</button>
          </>)}
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', padding: '80px 20px 48px' }}>
          {/* Netflix-style logo entrance */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '12px', animation: heroVisible ? 'logoEntrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none', opacity: heroVisible ? 1 : 0 }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', color: '#fff', boxShadow: '0 12px 48px rgba(46,125,50,0.5), 0 0 0 1px rgba(76,175,80,0.3)', animation: 'logoGlow 3s ease-in-out infinite' }}>₹</div>
            <h1 style={{ fontSize: '80px', fontWeight: '800', color: '#F0EDE8', letterSpacing: '-4px', lineHeight: '1', textShadow: '0 0 80px rgba(46,125,50,0.2)' }}>Pram<span style={{ color: '#4CAF50', textShadow: '0 0 40px rgba(76,175,80,0.4)' }}>ā</span></h1>
          </div>
          <div style={{ fontSize: '13px', color: '#C8B88A', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '36px', animation: heroVisible ? 'fadeUp 0.6s ease forwards' : 'none', opacity: heroVisible ? 1 : 0, animationDelay: '0.4s' }}>Price Intelligence • Powered by Yukti AI</div>

          {/* Rotating slogans */}
          <div style={{ maxWidth: '580px', margin: '0 auto 56px', padding: '28px 36px 22px', backgroundColor: '#111008', border: '1px solid #E8DDB820', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: heroVisible ? 'fadeUp 0.6s ease forwards' : 'none', opacity: heroVisible ? 1 : 0, animationDelay: '0.6s' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1B5E20, #FFD700, #4CAF50, #FFD700, #1B5E20)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }} />
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#F0EDE8', letterSpacing: '-0.5px', opacity: sloganFade ? 1 : 0, transform: sloganFade ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center' }}>{slogans[sloganIndex]}</p>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
              {slogans.map((_, i) => (<div key={i} style={{ width: i === sloganIndex ? '20px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: i === sloganIndex ? '#4CAF50' : '#2A2810', transition: 'all 0.3s ease' }} />))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '14px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: '800', color: '#fff' }}>₹</div>
              <span style={{ fontSize: '10px', color: '#5A4A2A', fontWeight: '600', letterSpacing: '0.5px' }}>Powered by Yukti AI</span>
            </div>
          </div>
        </div>

        {/* SECTION CARDS */}
        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 48px 70px', maxWidth: '1100px', margin: '0 auto' }}>
          {sections.map((section, idx) => (
            <div key={section.id} onClick={() => router.push(`/${section.id}`)} style={{ backgroundColor: '#D4C9B0', border: '1px solid #BFB49A', borderRadius: '24px', padding: '40px 32px', width: '300px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden', animation: heroVisible ? 'cardEntrance 0.6s ease forwards' : 'none', opacity: heroVisible ? 1 : 0, animationDelay: `${0.7 + idx * 0.15}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E7D32'; e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(46,125,50,0.2), 0 0 0 1px rgba(46,125,50,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#BFB49A'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1B5E20, #4CAF50, #FFD700, #4CAF50, #1B5E20)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', borderRadius: '24px 24px 0 0' }} />
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,125,50,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px', letterSpacing: '-0.3px' }}>{section.title}</h2>
              <p style={{ fontSize: '13px', color: '#2E7D32', fontWeight: '600', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{section.subtitle}</p>
              <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.7', marginBottom: '24px' }}>{section.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                {section.providers.map((p, i) => (<span key={i} style={{ fontSize: '11px', fontWeight: '600', padding: '5px 12px', borderRadius: '20px', backgroundColor: '#1A2E1A', color: '#66BB6A', border: '1px solid #2E7D3260' }}>{p}</span>))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>Explore →</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2E7D32, #388E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', boxShadow: '0 4px 12px rgba(46,125,50,0.4)' }}>→</div>
              </div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div ref={howRef} style={{ padding: '56px 48px 64px', maxWidth: '960px', margin: '0 auto', width: '100%', opacity: howVisible ? 1 : 0, transform: howVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#0A1F0A', border: '1px solid #2E7D3240', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#4CAF50', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px' }}>SEE IT IN ACTION</div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#F0EDE8', letterSpacing: '-0.5px', marginBottom: '6px' }}>How Pramā works</h2>
            <p style={{ fontSize: '14px', color: '#8A7A5A' }}>Watch Yukti find the cheapest milk in 3 seconds</p>
          </div>
          <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Live demo mockup */}
            <div style={{ width: '300px', flexShrink: 0, backgroundColor: '#0C0A06', border: '1px solid #E8DDB818', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #1E1C10', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#080806' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: '#fff' }}>P</div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#F0EDE8' }}>Pram<span style={{ color: '#4CAF50' }}>ā</span></span>
                <span style={{ fontSize: '9px', color: '#FFD700', marginLeft: 'auto' }}>Quick Commerce</span>
              </div>
              <div style={{ padding: '12px', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#0C0A06' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>₹</div>
                  <div style={{ backgroundColor: '#1E1C10', border: '1px solid #E8DDB815', borderRadius: '10px 10px 10px 2px', padding: '7px 10px', fontSize: '10px', color: '#E8DDB8', lineHeight: '1.5', maxWidth: '210px' }}>
                    <div style={{ fontSize: '7px', color: '#4CAF50', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>YUKTI</div>
                    Hi! Tell me what you need and I'll find the cheapest price.
                  </div>
                </div>
                {demoStep >= 1 && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ backgroundColor: '#1A3A1A', border: '1px solid #2E7D32', borderRadius: '10px 10px 2px 10px', padding: '7px 10px', fontSize: '10px', color: '#C8E6C9', maxWidth: '180px' }}>{demoTyped}<span style={{ opacity: demoStep === 1 ? 1 : 0, animation: 'blink 0.8s ease infinite' }}>|</span></div></div>}
                {demoStep >= 2 && <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', animation: 'fadeSlideUp 0.3s ease' }}><div style={{ width: '18px', height: '18px', borderRadius: '5px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>₹</div><div style={{ backgroundColor: '#1E1C10', border: '1px solid #E8DDB815', borderRadius: '10px 10px 10px 2px', padding: '7px 10px', fontSize: '10px', color: '#E8DDB8', lineHeight: '1.5', maxWidth: '210px' }}><div style={{ fontSize: '7px', color: '#4CAF50', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>YUKTI</div>🥛 Found it! Amul Taaza Milk — comparing 3 stores...</div></div>}
                {demoStep >= 3 && <div style={{ animation: 'fadeSlideUp 0.4s ease' }}><div style={{ backgroundColor: '#111008', border: '1px solid #2A2810', borderRadius: '8px', overflow: 'hidden' }}>{[{ store: 'Open Food Facts', price: 54, best: true }, { store: 'FakeStore', price: 60, best: false }, { store: 'DummyJSON', price: 62, best: false }].map((s, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: i < 2 ? '1px solid #1E1C10' : 'none', backgroundColor: s.best ? '#0A1F0A' : 'transparent' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: s.best ? '#4CAF50' : '#5A4A2A' }} /><span style={{ fontSize: '9px', color: s.best ? '#66BB6A' : '#8A7A5A' }}>{s.store}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '11px', fontWeight: '700', color: s.best ? '#4CAF50' : '#C8B88A' }}>₹{s.price}</span>{s.best && <span style={{ fontSize: '7px', backgroundColor: '#4CAF50', color: '#fff', padding: '1px 4px', borderRadius: '3px', fontWeight: '700' }}>BEST</span>}</div></div>))}</div></div>}
                {demoStep >= 4 && <div style={{ animation: 'fadeSlideUp 0.3s ease' }}><div style={{ backgroundColor: '#1A3A1A', border: '1px solid #2E7D32', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '12px' }}>🛒</span><span style={{ fontSize: '9px', color: '#C8E6C9', fontWeight: '600' }}>Added! Saving ₹8 vs worst price</span></div></div>}
              </div>
              <div style={{ padding: '8px 12px', borderTop: '1px solid #1E1C10', display: 'flex', gap: '6px', backgroundColor: '#080806' }}>
                <div style={{ flex: 1, backgroundColor: '#1A1610', border: '1px solid #2A2810', borderRadius: '8px', padding: '6px 10px', fontSize: '9px', color: demoStep >= 1 ? '#E8DDB8' : '#5A4A2A' }}>{demoStep >= 1 ? demoTyped : 'Ask Yukti anything...'}</div>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff' }}>→</div>
              </div>
            </div>

            {/* Steps */}
            <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
              {[
                { step: '01', title: 'Ask Yukti anything', desc: 'Type "cheapest milk" or "milk and butter" — Yukti understands what you want. You can also scan a barcode with your camera.', icon: '💬', activeAt: 1 },
                { step: '02', title: 'Compare prices instantly', desc: 'See prices from 3 stores sorted cheapest first. Best value highlighted in green. Per-unit price calculated automatically.', icon: '⚡', activeAt: 3 },
                { step: '03', title: 'Yukti orders for you', desc: 'Add to cart, checkout, and Yukti places the order directly on the store. You pay the store — Pramā is free.', icon: '🤖', activeAt: 4 },
              ].map((s, i) => {
                const isActive = demoStep >= s.activeAt
                return (
                  <div key={i} style={{ backgroundColor: isActive ? '#0A1F0A' : '#111008', border: `1px solid ${isActive ? '#4CAF5040' : '#E8DDB810'}`, borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', transition: 'all 0.4s ease', transform: isActive ? 'translateX(4px)' : 'translateX(0)', opacity: howVisible ? 1 : 0, transitionDelay: `${i * 0.15}s` }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, backgroundColor: isActive ? '#1B5E20' : '#1A1608', border: `1px solid ${isActive ? '#4CAF50' : '#2A2810'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.4s ease' }}>{s.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: isActive ? '#4CAF50' : '#5A4A2A', fontWeight: '700', letterSpacing: '0.5px' }}>STEP {s.step}</span>
                        {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50', animation: 'tickerPulse 1s ease infinite' }} />}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: isActive ? '#E8DDB8' : '#8A7A5A', marginBottom: '4px', transition: 'color 0.4s ease' }}>{s.title}</div>
                      <div style={{ fontSize: '12px', color: isActive ? '#8A7A5A' : '#5A4A2A', lineHeight: '1.6', transition: 'color 0.4s ease' }}>{s.desc}</div>
                    </div>
                  </div>
                )
              })}
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button onClick={() => router.push('/quick-commerce')} style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047)', border: 'none', color: '#fff', padding: '18px 48px', borderRadius: '14px', fontSize: '17px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', letterSpacing: '0.3px', boxShadow: '0 8px 32px rgba(46,125,50,0.4), 0 0 0 1px rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(46,125,50,0.5), 0 0 0 1px rgba(76,175,80,0.4)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,125,50,0.4), 0 0 0 1px rgba(76,175,80,0.3)' }}>🚀 Try it free — it's on us <span style={{ fontSize: '20px' }}>→</span></button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '48px' }} />
      </div>

      {/* DEALS TICKER */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '36px', backgroundColor: '#0E0C08', borderTop: '1px solid #1E1C10', display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, padding: '0 12px', borderRight: '1px solid #1E1C10', height: '100%', backgroundColor: '#111008' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50', animation: 'tickerPulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#4CAF50', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>LIVE DEALS</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px', whiteSpace: 'nowrap', animation: 'tickerScroll 40s linear infinite', paddingLeft: '20px' }}>
            {[...deals, ...deals].map((deal, i) => (<span key={i} style={{ fontSize: '12px', color: '#C8B88A', fontWeight: '500' }}>{deal}</span>))}
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      {showAuth && (
        <div onClick={() => { setShowAuth(false); clearError() }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0A0806', border: '1px solid #2A2810', borderRadius: '20px', width: '420px', position: 'relative', animation: 'modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            {/* Top accent bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #1B5E20, #4CAF50, #FFD700, #4CAF50, #1B5E20)' }} />
            <button onClick={() => { setShowAuth(false); clearError() }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2A2810', color: '#9E9E9E', width: '28px', height: '28px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244,67,54,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>×</button>

            {/* Header */}
            <div style={{ padding: '28px 32px 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: '#FFD700', boxShadow: '0 4px 16px rgba(46,125,50,0.35)' }}>₹</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#F0EDE8', letterSpacing: '-0.5px' }}>pram<span style={{ color: '#4CAF50' }}>ā</span></div>
                  <div style={{ fontSize: '9px', color: '#5A4A2A', letterSpacing: '1.5px', textTransform: 'uppercase' }}>price intelligence</div>
                </div>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#F0EDE8', marginBottom: '6px' }}>{authMode === 'login' ? 'Welcome back 👋' : 'Join Pramā today'}</h2>
              <p style={{ fontSize: '13px', color: '#6A5A3A' }}>{authMode === 'login' ? 'Log in to compare prices and save more' : 'Start saving ₹400+ every month'}</p>
            </div>

            <div style={{ padding: '0 32px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Google button */}
              <button onClick={openGooglePopup} style={{ width: '100%', backgroundColor: '#fff', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#1A1A1A', transition: 'all 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1E1C10' }} />
                <span style={{ fontSize: '11px', color: '#4A3A2A', fontWeight: '500' }}>or with email</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1E1C10' }} />
              </div>

              {/* Inputs */}
              {authMode === 'signup' && (
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>👤</span>
                  <input type="text" placeholder="Full name" value={authName} onChange={e => { setAuthName(e.target.value); clearError() }}
                    style={{ backgroundColor: '#111008', border: '1px solid #262210', borderRadius: '12px', padding: '13px 16px 13px 40px', color: '#E8DDB8', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#4CAF50'} onBlur={e => e.target.style.borderColor = '#262210'} />
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>✉️</span>
                <input type="email" placeholder="Email address" value={authEmail} onChange={e => { setAuthEmail(e.target.value); clearError() }}
                  style={{ backgroundColor: '#111008', border: '1px solid #262210', borderRadius: '12px', padding: '13px 16px 13px 40px', color: '#E8DDB8', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#4CAF50'} onBlur={e => e.target.style.borderColor = '#262210'} />
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔒</span>
                <input type="password" placeholder="Password" value={authPassword} onChange={e => { setAuthPassword(e.target.value); clearError() }} onKeyDown={handleKeyDown}
                  style={{ backgroundColor: '#111008', border: '1px solid #262210', borderRadius: '12px', padding: '13px 16px 13px 40px', color: '#E8DDB8', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#4CAF50'} onBlur={e => e.target.style.borderColor = '#262210'} />
              </div>

              {authError && <div style={{ fontSize: '12px', color: '#F44336', backgroundColor: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>{authError}</div>}

              <button onClick={handleAuth} disabled={authLoading} style={{ background: authLoading ? '#1A2A1A' : 'linear-gradient(135deg, #2E7D32, #43A047)', border: 'none', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: authLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: authLoading ? 0.8 : 1, boxShadow: authLoading ? 'none' : '0 4px 16px rgba(46,125,50,0.35)', transition: 'all 0.2s' }} onMouseEnter={e => { if (!authLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,125,50,0.45)' } }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = authLoading ? 'none' : '0 4px 16px rgba(46,125,50,0.35)' }}>
                {authLoading && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                {authLoading ? (authMode === 'login' ? 'Logging in...' : 'Creating account...') : (authMode === 'login' ? '→ Log in to Pramā' : '→ Create free account')}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6A5A3A', margin: 0 }}>
                {authMode === 'login' ? "New here? " : 'Already have an account? '}
                <span onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); clearError() }} style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{authMode === 'login' ? 'Create an account' : 'Log in'}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes logoGlow { 0%, 100% { box-shadow: 0 8px 32px rgba(46,125,50,0.3), 0 0 0 1px rgba(76,175,80,0.2); } 50% { box-shadow: 0 8px 48px rgba(46,125,50,0.6), 0 0 0 1px rgba(76,175,80,0.5), 0 0 80px rgba(46,125,50,0.15); } }
        @keyframes logoEntrance { 0% { transform: scale(0.3) translateY(30px); opacity: 0; filter: blur(10px); } 60% { transform: scale(1.08) translateY(-4px); opacity: 1; filter: blur(0); } 100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes titleEntrance { 0% { transform: translateY(40px); opacity: 0; filter: blur(6px); } 100% { transform: translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes fadeUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes tickerPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes modalPop { from { transform: scale(0.92) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes cardEntrance { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes particleFloat { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; } 33% { transform: translateY(-20px) translateX(10px); opacity: 0.6; } 66% { transform: translateY(-10px) translateX(-8px); opacity: 0.4; } }
        @keyframes gridPulse { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.07; } }
        @keyframes borderGlow { 0%, 100% { border-color: #BFB49A; } 50% { border-color: #4CAF5060; } }
      `}</style>
    </div>
  )
}