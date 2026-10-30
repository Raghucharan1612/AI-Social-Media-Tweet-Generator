import json
import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI, APIError
from pydantic import BaseModel, Field

load_dotenv()

# Read environment configuration
MODEL = os.getenv("OPENAI_MODEL", "llama-3.3-70b-versatile")
BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1")
API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize client with custom base_url (Groq, OpenAI, or Gemini)
client = AsyncOpenAI(
    api_key=API_KEY if API_KEY else "dummy_key_for_startup",
    base_url=BASE_URL
)

SYSTEM_PROMPT = """You are an expert Social Media Strategist and Brand Voice Analyst. Analyze the brand input provided by the user and produce:
1. Brand Voice Summary (Tone, Target Audience, 3 Content Pillars).
2. Exactly 10 tweets formatted into specific categories:
   - 2x Engaging / Conversational
   - 3x Promotional / Product-focused
   - 3x Witty / Meme-Style / Observational
   - 2x Informative / Value-Driven

STRICT RULES:
- Return ONLY valid JSON matching this schema: {"brand_voice":{"tone":"string","target_audience":"string","content_pillars":["string","string","string"]},"tweets":[{"category":"Engaging|Promotional|Witty|Informative","text":"string"}]}.
- No corporate jargon (for example, game-changer or revolutionize).
- Each tweet must be under 280 characters.
- Return exactly 10 tweets with category totals exactly 2 Engaging, 3 Promotional, 3 Witty, and 2 Informative."""


class BrandRequest(BaseModel):
    brand_name: str = Field(min_length=1, max_length=120)
    industry: str = Field(min_length=1, max_length=120)
    campaign_objective: str = Field(min_length=1, max_length=300)
    product_details: str = Field(min_length=1, max_length=1500)


class Tweet(BaseModel):
    category: Literal["Engaging", "Promotional", "Witty", "Informative"]
    text: str


class BrandVoice(BaseModel):
    tone: str
    target_audience: str
    content_pillars: list[str]


class GenerateResponse(BaseModel):
    brand_voice: BrandVoice
    tweets: list[Tweet]


app = FastAPI(title="Brand Tweet Generator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def validate_result(data: dict) -> GenerateResponse:
    result = GenerateResponse.model_validate(data)
    expected = {"Engaging": 2, "Promotional": 3, "Witty": 3, "Informative": 2}
    actual = {category: sum(t.category == category for t in result.tweets) for category in expected}
    if len(result.tweets) != 10 or actual != expected:
        raise ValueError("The model did not return the required tweet distribution.")
    if len(result.brand_voice.content_pillars) != 3:
        raise ValueError("The model did not return three content pillars.")
    if any(len(tweet.text) > 280 for tweet in result.tweets):
        raise ValueError("The model returned a tweet over 280 characters.")
    return result


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "model": MODEL, "base_url": BASE_URL}


# In backend/app/main.py

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_tweets(brand: BrandRequest) -> GenerateResponse:
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured on the server.")

    user_prompt = f"""Brand Name: {brand.brand_name}
Industry: {brand.industry}
Objective: {brand.campaign_objective}
Product Details: {brand.product_details}"""

    try:
        completion = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_tokens=2000,  # <-- INCREASED TO PREVENT JSON TRUNCATION
            temperature=0.7,
        )
        content = completion.choices[0].message.content
        if not content:
            raise ValueError("The model returned an empty response.")
        return validate_result(json.loads(content))
    except (APIError, ValueError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail=f"Generation failed: {error}") from error