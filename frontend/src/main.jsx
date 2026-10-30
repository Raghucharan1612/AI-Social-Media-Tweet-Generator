import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Copy, Check, LoaderCircle } from 'lucide-react'
import './styles.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const DEMO_PRESETS = {
  duolingo: {
    brand_name: 'Duolingo',
    industry: 'EdTech / Language Learning',
    campaign_objective: 'Boost daily app opens and streak retention',
    product_details: 'Bite-sized free language lessons with streak tracking, gamified rewards, and a famously persistent owl mascot Duo.',
  },
  apple: {
    brand_name: 'Apple',
    industry: 'Consumer Tech / Laptops',
    campaign_objective: 'Highlight power, 18+ hr battery life, and sleek design for MacBook Air M3',
    product_details: 'MacBook Air powered by the M3 chip, featuring an ultra-thin aluminum unibody, fanless silent design, and up to 18 hours of battery life.',
  },
}

const categoryStyle = {
  Engaging: 'bg-blue-100 text-blue-900 ring-blue-300',
  Promotional: 'bg-slate-900 text-white ring-slate-800',
  Witty: 'bg-sky-100 text-sky-950 ring-sky-300',
  Informative: 'bg-slate-100 text-slate-900 ring-slate-300',
}

function App() {
  const [form, setForm] = useState({
    brand_name: '',
    industry: '',
    campaign_objective: '',
    product_details: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(null)

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to generate tweets.')
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyTweet = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-blue-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Header / Navbar (Logo Removed) */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-blue-900/60 bg-blue-950/80 px-6 py-5 backdrop-blur-md">
        <span className="text-xl font-black tracking-tight text-white">
          Draftly
        </span>
        <span className="hidden rounded-full border border-blue-800 bg-blue-900/50 px-4 py-1.5 text-xs font-semibold text-blue-200 sm:block">
          Built for sharper social
        </span>
      </nav>

      {/* Main Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[0.88fr_1.12fr] lg:pt-16">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Your social sidekick
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Tweets that sound like <span className="text-blue-400">you.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-blue-100/80">
            Turn a few brand details into a ready-to-post week of social content. Clear voice, fresh angles, zero blank-page energy.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-blue-200">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/40">
              <Check size={15} />
            </span>
            One brief. Ten original drafts.
          </div>
        </div>

        {/* Brief Input Form */}
        <form
          onSubmit={generate}
          className="rounded-[2rem] border border-blue-800/80 bg-white p-6 text-slate-950 shadow-2xl shadow-blue-950/80 sm:p-8"
        >
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Tell us about your brand
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                We’ll find the voice and write the drafts.
              </p>
            </div>

            {/* Quick Demo Preset Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm(DEMO_PRESETS.duolingo)}
                className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:text-white transition"
              >
                ⚡ Demo: Duolingo
              </button>
              <button
                type="button"
                onClick={() => setForm(DEMO_PRESETS.apple)}
                className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:text-white transition"
              >
                ⚡ Demo: Apple
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Brand name"
              value={form.brand_name}
              onChange={(v) => update('brand_name', v)}
              placeholder="e.g. Morrow Coffee"
            />
            <Field
              label="Industry"
              value={form.industry}
              onChange={(v) => update('industry', v)}
              placeholder="e.g. Specialty coffee"
            />
          </div>

          <div className="mt-5">
            <Field
              label="Campaign objective"
              value={form.campaign_objective}
              onChange={(v) => update('campaign_objective', v)}
              placeholder="What should these tweets help achieve?"
            />
          </div>

          <div className="mt-5">
            <Field
              label="Product details"
              value={form.product_details}
              onChange={(v) => update('product_details', v)}
              placeholder="Share the product, benefits, personality, or any must-knows…"
              multiline
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-blue-600 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                Writing your tweets…
              </>
            ) : (
              <>
                Generate 10 tweets <ArrowUpRight size={18} />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs font-medium text-slate-400">
            Fast, focused, and under 280 characters each.
          </p>
        </form>
      </section>

      {/* Results Section */}
      {result && <Results result={result} copied={copied} onCopy={copyTweet} />}
    </main>
  )
}

function Field({ label, value, onChange, placeholder, multiline }) {
  const Component = multiline ? 'textarea' : 'input'
  return (
    <label className="block text-sm font-bold text-slate-900">
      {label}
      <Component
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </label>
  )
}

function Results({ result, copied, onCopy }) {
  return (
    <section className="border-t border-blue-900/60 bg-blue-900/40 px-6 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Your brand voice
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Ready-to-post ideas
            </h2>
          </div>
          <div className="rounded-2xl border border-blue-800 bg-blue-950 px-5 py-3.5 text-sm">
            <span className="font-bold text-blue-300">{result.brand_voice.tone}</span>
            <span className="mx-2 text-blue-700">•</span>
            <span className="font-medium text-blue-100/80">For {result.brand_voice.target_audience}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {result.brand_voice.content_pillars.map((pillar) => (
            <span
              key={pillar}
              className="rounded-full border border-blue-800 bg-blue-950 px-4 py-1.5 text-xs font-bold text-blue-200 shadow-sm"
            >
              {pillar}
            </span>
          ))}
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {result.tweets.map((tweet, index) => (
            <article
              key={`${tweet.text}-${index}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl transition hover:border-blue-500 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${
                    categoryStyle[tweet.category] || 'bg-slate-100 text-slate-900 ring-slate-200'
                  }`}
                >
                  {tweet.category}
                </span>
                <span className="text-xs font-bold tabular-nums text-slate-400">
                  {tweet.text.length}/280
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-900">
                {tweet.text}
              </p>
              <button
                onClick={() => onCopy(tweet.text, index)}
                className="mt-5 flex items-center gap-1.5 text-sm font-bold text-slate-600 transition hover:text-blue-600"
              >
                {copied === index ? (
                  <>
                    <Check size={15} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy tweet
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)