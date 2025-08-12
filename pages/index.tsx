import Head from 'next/head';
import { useState, useMemo } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('Pop Art');
  const [dragOver, setDragOver] = useState(false);

  const accept = 'image/png,image/jpeg,image/webp';

  const subtitle = useMemo(() => (
    'Upload a photo, pick a style, and we\'ll generate a print‑ready T‑shirt mockup you can order in one click.'
  ), []);

  const onFile = (f: File) => {
    if (!f) return;
    if (!accept.includes(f.type)) {
      setError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setProductId(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('style', style);

      const res = await fetch('/api/create-shirt', { method: 'POST', body: form });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create product');
      }
      const json = await res.json();
      if (json.productId) {
        setProductId(json.productId);
      } else {
        throw new Error('No productId returned');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Tee Studio — Turn any photo into a custom T‑shirt</title>
        <meta name="description" content="AI Tee Studio: Upload, stylize, and order a custom T‑shirt in minutes." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Decorative gradient background */}
      <div className="relative min-h-screen bg-slate-900 text-slate-100">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur bg-slate-900/60">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 grid place-items-center text-white font-black shadow-md shadow-indigo-900/30">AI</div>
              <span className="font-semibold tracking-tight">AI Tee Studio</span>
            </div>
            <nav className="hidden sm:flex gap-6 text-sm text-slate-300">
              <span className="opacity-75">Upload</span>
              <span className="opacity-75">Styles</span>
              <span className="opacity-75">Checkout</span>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-cyan-200">Make a stunning tee from any photo</h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
        </section>

        {/* Main card */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-indigo-900/20 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left column: uploader & controls */}
              <div className="p-6 md:p-10">
                <h2 className="text-lg font-semibold">1. Upload your photo</h2>
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  htmlFor="file"
                  className={`relative mt-3 flex h-48 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition ${dragOver ? 'border-cyan-400/80 bg-cyan-400/10' : 'border-white/20 hover:border-white/30'}`}
                >
                  <div className="text-center px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-9 w-9 text-slate-300"><path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/><path fillRule="evenodd" d="M1.5 6A2.5 2.5 0 0 1 4 3.5h16A2.5 2.5 0 0 1 22.5 6v12A2.5 2.5 0 0 1 20 20.5H4A2.5 2.5 0 0 1 1.5 18V6Zm3 0a.5.5 0 0 0-.5.5v7.879l2.44-2.44a1.5 1.5 0 0 1 2.12 0l1.061 1.06 4.94-4.94a1.5 1.5 0 0 1 2.122 0L20.5 11.94V6.5a.5.5 0 0 0-.5-.5H4.5Z" clipRule="evenodd"/></svg>
                    <p className="mt-3 text-sm text-slate-200"><span className="font-medium text-white">Click to upload</span> or drag & drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG, or WEBP up to 10MB</p>
                  </div>
                  <input id="file" type="file" accept={accept} onChange={handleInput} className="sr-only" />
                </label>

                <div className="mt-7">
                  <h3 className="text-sm font-medium text-slate-200 mb-3">2. Pick a style</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Pop Art', 'Cartoon', 'Watercolor', 'Cyberpunk', 'Line Art', 'Vintage'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStyle(s)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${style === s ? 'border-cyan-400 text-white bg-cyan-400/10 ring-cyan-400' : 'border-white/20 text-slate-200 hover:border-white/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!file || loading}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-5 py-2.5 text-white font-medium shadow-lg shadow-indigo-900/30 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {loading && (
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" opacity="0.3"/><path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" fill="none"/></svg>
                    )}
                    {loading ? 'Generating…' : 'Generate & Create Product'}
                  </button>
                  <p className="text-xs text-slate-400">We\'ll generate your art and create a Printify product.</p>
                </div>
              </div>

              {/* Right column: tee mockup */}
              <div className="p-6 md:p-10 border-t border-white/10 md:border-l md:border-t-0 bg-slate-950/40">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                <div className="relative mx-auto w-full max-w-sm">
                  {/* T‑shirt silhouette */}
                  <div className="relative mx-auto w-[320px] h-[360px]">
                    <svg viewBox="0 0 300 340" className="absolute inset-0 h-full w-full text-slate-800">
                      <path d="M75 30l35 20h80l35-20 45 35-30 40-25-15v210a20 20 0 0 1-20 20H105a20 20 0 0 1-20-20V90L60 105 30 65 75 30z" fill="currentColor" />
                    </svg>
                    {/* Print area frame */}
                    <div className="absolute left-1/2 top-1/2 h-[200px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/5 ring-1 ring-white/15 shadow-inner overflow-hidden">
                      {preview ? (
                        <img src={preview} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-slate-400">Your image will appear here</div>
                      )}
                    </div>
                  </div>
                </div>

                {productId && (
                  <a
                    href={`https://printify.com/products/${productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center text-slate-100 hover:bg-white/20"
                  >
                    View & Order your Shirt ↗
                  </a>
                )}

                <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-300 md:grid-cols-3">
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">1. Upload photo</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">2. Choose style</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">3. Generate & order</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AI Tee Studio. Built with Next.js, Tailwind, and Printify.</p>
        </footer>
      </div>
    </>
  );
}