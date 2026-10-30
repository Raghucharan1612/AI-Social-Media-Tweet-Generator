import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, Copy, LoaderCircle, Sparkles } from 'lucide-react'
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const initialForm = {
  brand_name: '', industry: '', campaign_objective: '', product_details: ''
}
const categoryStyle = {
  Engaging: 'bg-blue-50 text-blue-700 ring-blue-100',
  Promotional: 'bg-violet-50 text-violet-700 ring-violet-100',
  Witty: 'bg-amber-50 text-amber-700 ring-amber-100',
  Informative: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  async function generate(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.detail || 'Unable to create tweets right now.')
      setResult(body)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  async function copyTweet(text, index) {
    await navigator.clipboard.writeText(text)
    setCopied(index); setTimeout(() => setCopied(null), 1400)
  }

  return <main className="min-h-screen bg-[#f8fafc] text-slate-900">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white"><Sparkles size={18}/></span> Draftly</a>
      <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:block">Built for sharper social</span>
    </nav>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[0.88fr_1.12fr] lg:pt-16">
      <div className="max-w-xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Your social sidekick</p>
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl">Tweets that sound like <span className="text-indigo-600">you.</span></h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">Turn a few brand details into a ready-to-post week of social. Clear voice, fresh angles, zero blank-page energy.</p>
        <div className="mt-10 flex items-center gap-3 text-sm text-slate-500"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"><Check size={15}/></span> One brief. Ten original drafts.</div>
      </div>
      <form onSubmit={generate} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(30,41,59,.25)] sm:p-8">
        <div className="mb-7 flex items-center justify-between"><div><h2 className="text-xl font-semibold tracking-tight">Tell us about your brand</h2><p className="mt-1 text-sm text-slate-500">We’ll find the voice and write the drafts.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Brand name" value={form.brand_name} onChange={(v) => update('brand_name', v)} placeholder="e.g. Morrow Coffee" />
          <Field label="Industry" value={form.industry} onChange={(v) => update('industry', v)} placeholder="e.g. Specialty coffee" />
        </div>
        <div className="mt-5"><Field label="Campaign objective" value={form.campaign_objective} onChange={(v) => update('campaign_objective', v)} placeholder="What should these tweets help achieve?" /></div>
        <div className="mt-5"><Field label="Product details" value={form.product_details} onChange={(v) => update('product_details', v)} placeholder="Share the product, benefits, personality, or any must-knows…" multiline /></div>
        {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-70">{loading ? <><LoaderCircle className="animate-spin" size={18}/>Writing your tweets…</> : <>Generate 10 tweets <ArrowUpRight size={18}/></>}</button>
        <p className="mt-3 text-center text-xs text-slate-400">Fast, focused, and under 280 characters each.</p>
      </form>
    </section>
    {result && <Results result={result} copied={copied} onCopy={copyTweet} />}
  </main>
}

function Field({ label, value, onChange, placeholder, multiline }) {
  const Component = multiline ? 'textarea' : 'input'
  return <label className="block text-sm font-medium text-slate-700">{label}<Component required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={multiline ? 4 : undefined} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" /></label>
}

function Results({ result, copied, onCopy }) {
  return <section className="border-t border-slate-200 bg-white px-6 py-16"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Your brand voice</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Ready-to-post ideas</h2></div><div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm"><span className="font-semibold">{result.brand_voice.tone}</span><span className="mx-2 text-slate-300">•</span><span className="text-slate-500">For {result.brand_voice.target_audience}</span></div></div><div className="mt-6 flex flex-wrap gap-2">{result.brand_voice.content_pillars.map((pillar) => <span key={pillar} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">{pillar}</span>)}</div><div className="mt-9 grid gap-4 md:grid-cols-2">{result.tweets.map((tweet, index) => <article key={`${tweet.text}-${index}`} className="group rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"><div className="flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${categoryStyle[tweet.category]}`}>{tweet.category}</span><span className="text-xs tabular-nums text-slate-400">{tweet.text.length}/280</span></div><p className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-slate-700">{tweet.text}</p><button onClick={() => onCopy(tweet.text, index)} className="mt-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">{copied === index ? <><Check size={15} className="text-emerald-600"/>Copied</> : <><Copy size={15}/>Copy tweet</>}</button></article>)}</div></div></section>
}

createRoot(document.getElementById('root')).render(<App />)
