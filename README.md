# Draftly — Brand Tweet Generator

An AI-powered tool that analyzes brand inputs (name, industry, objective, and product details) to infer brand voice and generate 10 categorized tweets.

---

## Features
- **Brand Voice Card**: Inferred tone, target audience, and 3 content pillars.
- **10 Categorized Tweets**: Split across Conversational (2), Promotional (3), Witty (3), and Informative (2).
- **Fast & Low-Cost**: Optimized single-pass JSON output using Groq or OpenAI API.
- **Interactive UI**: Character counts, category filters, and one-click copy buttons.

---

## Tech Stack
- **Backend**: Python 3.10+, FastAPI, AsyncOpenAI, Pydantic
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **LLM Endpoint**: Groq Cloud (`openai/gpt-oss-20b`) 

---

## Getting Started

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- Groq API Key (Free) or OpenAI API Key

---

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt