import { GetServerSideProps } from 'next'
import { getProviders, signIn, getSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'
import Navbar from '../../components/Navbar'

interface SignInProps {
  providers: any
}

export default function SignIn({ providers }: SignInProps) {
  const [email, setEmail] = useState('')

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    signIn('email', { email, callbackUrl: '/dashboard' })
  }

  const providerButtons = Object.values(providers).filter((p: any) => p.id !== 'email') as any[]

  const facebookProvider = providerButtons.find(p => p.id === 'facebook')
  const googleProvider = providerButtons.find(p => p.id === 'google')

  return (
    <>
      <Head>
        <title>Sign In - TeeGenie</title>
        <meta name="description" content="Sign in to TeeGenie" />
      </Head>
      <Navbar />
      <div className="min-h-screen flex flex-col pb-10 px-4" style={{paddingTop:'170px'}}>
        <main className="w-full flex flex-col flex-1 items-center">
          <h1 className="font-nexaGlow tracking-tight text-gray-900 select-none" style={{fontSize:'52px', lineHeight:1.05}}>Welcome back</h1>

          {/* Email Form (centered, 1/3 viewport width) */}
          <form onSubmit={handleEmailSignIn} style={{width:'calc(min(560px,33vw)*0.75)', marginTop:'56px'}} className="flex flex-col gap-6 items-center">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full border border-gray-300 bg-white px-8 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              style={{height:64, width:'100%', marginBottom: 16, paddingLeft: 20, fontSize: '16px'}}
            />
            <button
              type="submit"
              className="rounded-full text-white font-medium active:scale-[.985] transition focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height:64,
                width:'100%',
                backgroundColor:'#5b21b6', /* brand purple */
                boxShadow:'0 2px 4px rgba(0,0,0,0.08)',
                border:'1px solid #5b21b6',
                color: 'white',
                fontSize: '16px',
              }}
              onMouseEnter={(e)=>{(e.currentTarget as HTMLButtonElement).style.backgroundColor='#4c1d95'}}
              onMouseLeave={(e)=>{(e.currentTarget as HTMLButtonElement).style.backgroundColor='#5b21b6'}}
            >
              Continue
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center w-full" style={{width:'min(560px,33vw)', marginTop:48}}>
            <span className="h-px bg-gray-200 flex-1" />
            <span className="px-4 text-xs font-medium tracking-wide text-gray-500">OR</span>
            <span className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="flex flex-col items-center" style={{width:'calc(min(560px,33vw)*0.5)'}}>
            {/* Google Button */}
            {googleProvider && (
              <button
                key={googleProvider.id}
                type="button"
                onClick={() => signIn(googleProvider.id, { callbackUrl: '/dashboard' })}
                className="rounded-xl border border-gray-300 text-gray-800 font-medium text-base flex items-center gap-3 active:scale-[.985] transition shadow-sm"
                style={{height:60, width:'100%', marginTop:40, padding:'0 20px', borderRadius:30, paddingLeft:20, background:'#ffffff', cursor:'pointer', fontSize: '16px'}}
                onMouseEnter={(e)=>{e.currentTarget.style.background='#f3f4f6'}}
                onMouseLeave={(e)=>{e.currentTarget.style.background='#ffffff'}}
              >
                {/* Google G logo */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google G"
                  style={{width:35, height:35, flexShrink:0, paddingRight:8, marginRight:8}}
                />
                <span className="flex-1 text-left" style={{lineHeight:1}}>Continue with Google</span>
              </button>
            )}

            {/* Facebook Button */}
            {facebookProvider && (
              <button
                key={facebookProvider.id}
                type="button"
                onClick={() => signIn(facebookProvider.id, { callbackUrl: '/dashboard' })}
                className="rounded-xl border border-gray-300 text-gray-800 font-medium text-base flex items-center gap-3 active:scale-[.985] transition shadow-sm"
                style={{
                  height:60,
                  width:'100%',
                  marginTop:20,
                  padding:'0 20px',
                  borderRadius:30,
                  paddingLeft:20,
                  background:'#ffffff',
                  cursor:'pointer',
                  fontSize: '16px',
                  // color:'white',
                  // border:'1px solid #1877F2'
                }}
                onMouseEnter={(e)=>{e.currentTarget.style.background='#f3f4f6'}}
                onMouseLeave={(e)=>{e.currentTarget.style.background='#ffffff'}}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
                  alt="Facebook"
                  style={{width:34, height:34, flexShrink:0, marginRight:12, paddingRight: 8, objectFit:'contain'}}
                />
                <span className="flex-1 text-left" style={{lineHeight:1}}>Continue with Facebook</span>
              </button>
            )}
          </div>

          {/* Footer Links */}
          {/* <div className="mt-auto pt-24 flex flex-col items-center gap-2 text-xs text-gray-500" style={{width:'min(560px,33vw)'}}>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-700">Terms of Use</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            </div>
          </div> */}
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  // If user is already logged in, redirect to main app
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()

  return {
    props: {
      providers: providers ?? {},
    },
  }
}
