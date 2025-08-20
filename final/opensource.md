# 💡 Open-Source / Low-Cost Alternatives

## 1. Voice Orchestration (Currently: Vapi)

**Open-source / low-cost alternatives:**

- **Asterisk / FreeSWITCH** (open-source telephony PBX, can handle SIP/VoIP, record calls)
- **Twilio** (not open-source, but pay-as-you-go, cheaper for prototyping)
- **Jambonz** (open-source "Twilio alternative" for programmable voice)

> 👉 If you want a SaaS-like "voice AI orchestrator" but cheaper than Vapi → look at **Jambonz**.

## 2. Speech-to-Text (Currently: Deepgram)

**Open-source alternatives:**

- **OpenAI Whisper** (MIT licensed, runs locally)
- **whisper.cpp** → lightweight C++ port, runs on CPU
- **Faster Whisper** (CTranslate2) → optimized for speed

**Costs:** $0 if you run it locally on your own machine/server.

For cloud managed but cheaper: **AssemblyAI** or **Rev.ai** may be cheaper than Deepgram depending on volume.

> 👉 **Best option:** Whisper/Faster-Whisper (completely free if self-hosted).

## 3. Intent Understanding & Response (Currently: GPT-4o)

**Open-source / cheaper options:**

- **LLaMA 3.1, Mistral 7B/8x7B, Gemma** → all open models
- Can run locally (**Ollama, vLLM, LM Studio**) or on cheap GPU servers (**RunPod, Vast.ai**)
- For production SaaS with low cost: **OpenRouter** gives access to many models (cheaper than OpenAI GPT-4o)
- If you just need intent classification (not full chat): you can even fine-tune a small model like **DistilBERT** or **fastText** for free

> 👉 **Best option:** small open model (e.g., Mistral 7B) for intent classification + response.

## 4. Backend / Business Logic (Currently: Node.js/Express)

Node.js is already free and open-source 👍.

**Nothing to change here.**

## 5. Database (Currently: Airtable)

**Open-source / low-cost alternatives:**

- **Postgres** (with pgAdmin or Supabase for UI)
- **NocoDB** (open-source Airtable alternative)
- **Baserow** (also open-source Airtable replacement)

> 👉 **Best option:** NocoDB (free, Airtable-like UI on top of Postgres/MySQL).

## 6. Text-to-Speech (Currently: ElevenLabs)

**Open-source / low-cost alternatives:**

- **Coqui TTS** (open-source, good quality voices, can run locally)
- **Mimic 3** (MycroftAI) (open-source, lightweight)
- **Bark by Suno** (realistic voices, but heavier)
- **OpenAI TTS API** is much cheaper than ElevenLabs (but not open-source)

> 👉 **Best option:** Coqui TTS for balance between quality + cost.

---

## 🔗 Suggested Open-Source Stack

- **Voice orchestration** → Jambonz (open-source) or Asterisk
- **STT** → Whisper / Faster-Whisper (self-hosted)
- **Intent & Response** → Mistral or LLaMA model via Ollama
- **Backend** → Node.js (already good)
- **Database** → NocoDB or Baserow (instead of Airtable)
- **TTS** → Coqui TTS

## ⚡ Benefits

- **Fully open-source stack** → $0 infra cost (just server hosting)
- Replace high per-minute/character costs (Deepgram + ElevenLabs + Airtable + Vapi) with self-hosted
- You only pay for hosting (e.g., one mid-tier GPU instance on RunPod for STT + LLM + TTS)