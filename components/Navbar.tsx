import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        padding: '10px 16px',
        zIndex: 1000,
        background: 'transparent'
      }}
    >
      <div
        className="backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.55) 60%, rgba(255,255,255,0.42) 100%)',
          WebkitBackdropFilter: 'blur(22px)',
            backdropFilter: 'blur(22px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          borderRadius: 12,
          padding: '12px 30px',
          maxWidth: 1740,
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{position:'absolute', inset:0, borderRadius:12, padding:1, pointerEvents:'none'}}>
          <div style={{width:'100%', height:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.4)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.2)'}} />
        </div>
        <nav className="grid grid-cols-3 items-center relative">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo */}
            <Link href="/" className="font-nexaGlow tracking-tight select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
              style={{
                fontFamily: 'NexaRoundGlow, Inter, ui-sans-serif, system-ui',
                fontSize: '32px',
                lineHeight: 1,
                color: '#5b21b6',
                textDecoration: 'none'
              }}
            >
              TeeGenie
            </Link>
          </div>

          {/* Center: Navigation Links with animated underline */}
          <div className="nav-links flex justify-center items-center gap-12">
            <Link
              href="/dashboard"
              className="font-medium transition-colors relative"
              style={{
                color: '#111',
                textDecoration: 'none',
                paddingBottom: '1px', // space for underline below
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#5b21b6'
                const bar = e.currentTarget.querySelector('.underline-bar') as HTMLElement | null
                if (bar) bar.style.width = '100%'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#111'
                const bar = e.currentTarget.querySelector('.underline-bar') as HTMLElement | null
                if (bar) bar.style.width = '0%'
              }}
            >
              <span style={{position:'relative', display:'inline-block'}}>
                Shop
                <span
                  className="underline-bar"
                  aria-hidden="true"
                  style={{
                    position:'absolute',
                    left:0,
                    bottom:-4, // further below text
                    height:2,
                    width:'0%',
                    background:'#5b21b6',
                    borderRadius:2,
                    transition:'width .38s cubic-bezier(.65,.05,.36,1)',
                    // boxShadow:'0 0 0 1px rgba(91,33,182,0.15), 0 2px 6px -1px rgba(91,33,182,0.4)'
                  }}
                />
              </span>
            </Link>

            <span className="inline-block" style={{width:'100px'}} aria-hidden="true" />

            <a
              href="/#about"
              className="font-medium transition-colors relative"
              style={{
                color: '#111',
                textDecoration: 'none',
                paddingBottom: '1px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#5b21b6'
                const bar = e.currentTarget.querySelector('.underline-bar') as HTMLElement | null
                if (bar) bar.style.width = '100%'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#111'
                const bar = e.currentTarget.querySelector('.underline-bar') as HTMLElement | null
                if (bar) bar.style.width = '0%'
              }}
            >
              <span style={{position:'relative', display:'inline-block'}}>
                About
                <span
                  className="underline-bar"
                  aria-hidden="true"
                  style={{
                    position:'absolute',
                    left:0,
                    bottom:-4,
                    height:2,
                    width:'0%',
                    background:'#5b21b6',
                    borderRadius:2,
                    transition:'width .38s cubic-bezier(.65,.05,.36,1)',
                    // boxShadow:'0 0 0 1px rgba(91,33,182,0.15), 0 2px 6px -1px rgba(91,33,182,0.4)'
                  }}
                />
              </span>
            </a>
          </div>

          {/* Right: Login/User */}
          <div className="flex justify-end">
            {session ? (
              <div className="flex items-center gap-5">
                <span className="hidden sm:inline text-gray-700 text-sm">Welcome, {session.user?.name?.split(' ')[0]}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-600 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-indigo-700 active:scale-[.97] transition-all whitespace-nowrap shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-indigo-600 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-indigo-700 active:scale-[.97] transition-all whitespace-nowrap shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
