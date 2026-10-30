# Brand Tweet Generator — Approach Document

## 1. Executive Summary
The Brand Tweet Generator is an AI-powered system designed to infer a brand's unique social media voice and generate 10 on-brand tweets tailored across distinct engagement categories.

---

## 2. Brand Voice Analysis Strategy

### Hybrid Inference Model
Instead of relying on multi-turn prompt chains, the system uses a **Single-Pass System Prompting Strategy**. It maps user inputs across key stylistic axes:
- **Tone Spectrum**: Formal vs. Casual, Serious vs. Playful, Direct vs. Storytelling.
- **Audience Targeting**: Inferred based on market category and campaign goals.
- **Content Pillars**: Extracts 3 primary messaging themes from the product details.

---

## 3. Prompt Design & Token Optimization

### Token Efficiency
- **Combined Inference & Generation**: Performed in a single API request to save prompt overhead.
- **Structured JSON Schema**: Enforces schema validation directly at the API layer.
- **Max Tokens Cap**: Set to `2000` to prevent truncation errors on JSON outputs.

### Category Breakdown (10 Tweets Total)
- **2x Engaging / Conversational**: Community questions and relatable scenarios.
- **3x Promotional**: Benefit-first product copy with call-to-action details.
- **3x Witty / Meme-Style**: Internet-native humor and light observational jokes.
- **2x Informative / Value-Driven**: Quick tips, facts, and actionable value.

---

## 4. Technical Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons.
- **Backend**: Python (FastAPI) + Pydantic validation + AsyncOpenAI client.
- **LLM Engine**: Groq Cloud API (`openai/gpt-oss-20b`).