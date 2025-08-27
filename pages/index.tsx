import Head from 'next/head'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  // Intersection Observer for step animations
  const stepsRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!stepsRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } })
    }, { threshold: 0.25 })
    observer.observe(stepsRef.current)
    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      id: 1,
      title: 'Upload Your Photo',
      badgeFrom: 'from-indigo-500 to-purple-600',
      dot: 'bg-indigo-500',
      meta: 'Source Image',
      text: 'Pick any photo – a portrait, pet, landscape, or memory. High quality helps, but we can work with almost anything.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8c0-1.886 0-2.828.586-3.414C5.172 4 6.114 4 8 4h1.172a2 2 0 0 0 1.414-.586l.828-.828A2 2 0 0 1 12.828 2h2.344a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 18.828 4H20c1.886 0 2.828 0 3.414.586C24 5.172 24 6.114 24 8v8c0 1.886 0 2.828-.586 3.414C22.828 20 21.886 20 20 20H8c-1.886 0-2.828 0-3.414-.586C4 18.828 4 17.886 4 16V8Z" />
          <path d="M4 14.5 8.5 11a2 2 0 0 1 2.5.12l1.273 1.09a2 2 0 0 0 2.535.056L18 10" />
          <circle cx="16.5" cy="7.5" r="1.5" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'AI Magic Happens',
      badgeFrom: 'from-purple-500 to-pink-600',
      dot: 'bg-purple-500',
      meta: 'Style Variations',
      text: 'Our models reinterpret it into multiple curated styles (clean vector, comic ink, neon synth, painterly & more). You preview instantly.',
      icon: (
        <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M5.5 5.5l2.8 2.8M2 12h4M18.5 5.5l-2.8 2.8M22 12h-4M12 18v4M7.5 16.5l-2.8 2.8M16.5 16.5l2.8 2.8" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Get Your T-Shirt',
      badgeFrom: 'from-pink-500 to-rose-600',
      dot: 'bg-rose-500',
      meta: 'Printed & Shipped',
      text: 'Pick a favorite design, choose shirt size & color, then we print on premium fabric and ship fast. No minimums.',
      icon: (
        <svg className="w-6 h-6 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h-1a4 4 0 0 1-6 0H8a5 5 0 0 0-5 5v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7V8a5 5 0 0 0-5-5Z" />
          <path d="M10 13.5 12 15l4-4" />
        </svg>
      )
    }
  ]

  return (
    <>
      <Head>
        <title>Tee Genie - Turn Photos into T-Shirt Art</title>
        <meta name="description" content="Create stunning AI-generated artwork from your photos and get it printed on a custom t-shirt." />
      </Head>

      <div className="min-h-screen">
        <Navbar />
        
        {/* Hero Image Section */}
        <div className="h-screen relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/TShirt_hero.png" 
            alt="AI T-Shirt Design Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Section Below Hero */}
        <div className="bg-white py-16 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Photos Into 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Wearable Art
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Tee Genie uses cutting-edge AI technology to transform your ordinary photos into stunning artistic designs, 
              then prints them on high-quality t-shirts delivered right to your door.
            </p>

            <Link href="/dashboard" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-transform">
              Start Creating Now
            </Link>
          </div>
        </div>

        {/* About Section (Refined with icons + animation) */}
        <div id="about" className="relative py-28 px-6 lg:px-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How Tee Genie Works</h2>
            <p className="max-w-2xl mx-auto text-center text-gray-500 mb-16 text-lg">A frictionless, intentionally simple 3–step flow from your photo to a printed shirt.</p>

            <div ref={stepsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={[
                    'group relative rounded-2xl bg-white/70 backdrop-blur-sm ring-1 ring-gray-200 hover:ring-indigo-200 transition-all shadow-sm hover:shadow-md p-6 flex flex-col overflow-hidden',
                    visible ? 'animate-in-card' : 'pre-animate-card'
                  ].join(' ')}
                  style={{transitionDelay: visible ? `${i * 90}ms` : '0ms'}}
                >
                  {/* accent gradient aura */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.12), transparent 60%)'}} />
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${s.badgeFrom} text-white text-sm font-semibold shadow-sm group-hover:scale-105 transition-transform`}>{s.id}</span>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="icon-wrapper" aria-hidden>{s.icon}</span>
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 flex-1 relative z-10">{s.text}</p>
                  <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent relative z-10" />
                  <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 font-medium relative z-10">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.meta}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <p className="text-lg text-gray-600 mb-8">Ready to create something amazing?</p>
              <Link href="/dashboard" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-transform">
                Try Tee Genie Free
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .pre-animate-card { opacity:0; transform:translateY(28px) scale(.97); }
        .animate-in-card { opacity:1; transform:translateY(0) scale(1); transition:opacity .6s cubic-bezier(.4,0,.2,1), transform .6s cubic-bezier(.4,0,.2,1); }
        .icon-wrapper { position:relative; display:inline-flex; }
        .icon-wrapper:before { content:''; position:absolute; inset:-6px; border-radius:14px; background:radial-gradient(circle at 30% 30%, rgba(0,0,0,0.06), transparent 70%); opacity:0; transition:opacity .4s; }
        .group:hover .icon-wrapper:before { opacity:1; }
        .group:hover svg { transform:translateY(-2px) scale(1.05); }
        svg { transition:transform .5s cubic-bezier(.34,1.56,.64,1); }
      `}</style>
    </>
  )
}