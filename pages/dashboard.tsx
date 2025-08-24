import Head from 'next/head';
import { useState, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('De-age');
  const [dragOver, setDragOver] = useState(false);

  const accept = 'image/png,image/jpeg,image/webp';

  const subtitle = useMemo(() => (
    "Upload a photo, pick a style, generate artwork with AI, then publish to Printify when you're ready."
  ), []);

  const onFile = (f: File) => {
    if (!f) return;
    if (!accept.includes(f.type)) {
      setError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }
    setError(null);
    setFile(f);
    setLocalPreview(URL.createObjectURL(f));
    setGeneratedUrl(null);
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

  const handleGenerate = async () => {
    if (!file) return;
    setGenerating(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('style', style);

      const res = await fetch('/api/create-shirt', { method: 'POST', body: form });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to generate image');
      }
      const json = await res.json();
      if (json.imageUrl) {
        setGeneratedUrl(json.imageUrl);
      } else {
        throw new Error('No imageUrl returned');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedUrl) return;
    setPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/create-printify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: generatedUrl }),
      });
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
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Head>
        <title>Dashboard - AI Tee Studio</title>
        <meta name="description" content="AI Tee Studio: Upload, stylize, generate, then publish to Printify." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
          {/* Left: controls */}
          <div>
            <h1 className="text-3xl font-bold">Make an AI T-Shirt</h1>
            <p className="mt-2 text-gray-600">{subtitle}</p>

            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2">1. Upload your photo</h2>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                htmlFor="file"
                className={`relative mt-2 flex h-44 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-white transition ${dragOver ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <div className="text-center">
                  <p className="text-sm"><span className="font-medium text-indigo-700">Click to upload</span> or drag & drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or WEBP up to 10MB</p>
                </div>
                <input id="file" type="file" accept={accept} onChange={handleInput} className="sr-only" />
              </label>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">2. Pick a style</h3>
              <div className="flex flex-wrap gap-2">
                {['De-age', 'Cartoonify', 'Halloween'].map((s) => {
                  const selected = style === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setStyle(s)}
                      className={`relative rounded-full px-4 py-2 text-sm font-medium transition
                        ${selected
                          ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-600 ring-offset-2 ring-offset-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'}`}
                    >
                      {s}
                      {selected && (
                        <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-indigo-600 ring-2 ring-indigo-600">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!file || generating}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Generating…' : 'Generate Artwork'}
              </button>

              <button
                onClick={handlePublish}
                disabled={!generatedUrl || publishing}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
              >
                {publishing ? 'Publishing…' : 'Create Printify Product'}
              </button>
            </div>
          </div>

          {/* Right: preview */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-semibold mb-2">Preview</h2>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Selected style</span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{style}</span>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative mx-auto w-[320px] h-[360px]">
                <div className="absolute inset-0 rounded-xl bg-gray-100" />
                <div className="absolute left-1/2 top-1/2 h-[200px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white ring-1 ring-gray-200 shadow-inner overflow-hidden">
                  { (generatedUrl || localPreview) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={generatedUrl || localPreview!} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-gray-400">Your image will appear here</div>
                  )}
                </div>
              </div>

              {productId && (
                <a
                  href={`https://printify.com/products/${productId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-indigo-700 hover:bg-indigo-100"
                >
                  View & Order your Shirt ↗
                </a>
              )}
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AI Tee Studio. Built with Next.js, Tailwind, and Printify.</p>
        </footer>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
