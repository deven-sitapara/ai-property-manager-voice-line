# AI Property Manager Voice Line - Third Party Services Pricing Comparison

| Service Category | Recommended Service | Free Tier Available | Pricing Structure | Credit Card Required | Notes |
|------------------|---------------------|---------------------|-------------------|----------------------|-------|
| **Voice AI Platform** | Vapi | ❌ No | $0.05-0.15/minute + platform fees | ✅ Yes | Pay-per-use, additional charges for LLM/STT/TTS |
| | Retell AI | ❌ No | $0.015/minute | ✅ Yes | Simple per-minute pricing |
| | Synthflow | ❌ No | $39-299/month | ✅ Yes | Subscription-based plans |
| **Speech-to-Text** | Deepgram | ✅ Yes | $200 free credit, then $0.0043-0.0077/min | ❌ No (for free tier) | $200 free credit, Nova-3: $0.0043/min pre-recorded, $0.0077/min real-time |
| | OpenAI Whisper | ✅ Yes | $0.006/minute | ❌ No (for free tier) | Part of OpenAI API |
| | AssemblyAI | ✅ Yes | $100 free credit, then $0.37/hour | ❌ No (for free tier) | Good for batch processing |
| **Text-to-Speech** | ElevenLabs | ✅ Yes | 10K chars free/month, then $5-99/month | ❌ No (for free tier) | High-quality voices, generous free tier |
| | OpenAI TTS | ✅ Yes | $15/1M characters | ❌ No (for free tier) | Part of OpenAI API |
| | Cartesia | ❌ No | $0.00625/1K characters | ✅ Yes | Real-time optimized |
| **Large Language Model** | OpenAI GPT-4o | ✅ Yes | $5 free credit, then $2.50/1M input tokens, $10/1M output tokens | ❌ No (for free tier) | Best for understanding context |
| | Claude (Anthropic) | ✅ Yes | $3/1M input tokens, $15/1M output tokens | ❌ No (for free tier) | Good reasoning capabilities |
| | Gemini (Google) | ✅ Yes | 15 requests/min free, then $0.35-7/1M tokens | ❌ No (for free tier) | Competitive pricing |
| **Property Management** | AppFolio API | ❌ No | Custom pricing | ✅ Yes | Enterprise-level integration |
| | Buildium API | ❌ No | Contact for pricing | ✅ Yes | Mid-market focused |
| | Custom Webhook | ✅ Yes | Free (self-hosted) | ❌ No | For demo purposes |
| **SMS/Telephony** | Twilio | ✅ Yes | $15 trial credit, then $1/month phone + $0.0075/SMS | ✅ Yes (after trial) | Industry standard |
| | Vonage API | ✅ Yes | €2 credit, then €0.0072/SMS | ✅ Yes (after trial) | Global reach |
| | Plivo | ✅ Yes | $20 trial credit | ✅ Yes (after trial) | Cost-effective alternative |
| **Database/Knowledge Base** | Airtable | ✅ Yes | Free up to 1K records/base, then $20/month | ❌ No (for free tier) | User-friendly interface |
| | Google Sheets API | ✅ Yes | 100 requests/100sec free | ❌ No | Simple and free |
| | Supabase | ✅ Yes | 2 projects free, then $25/month | ❌ No (for free tier) | PostgreSQL-based |

## Estimated Monthly Costs for Demo (100 calls/month, 5 min avg)

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| Vapi | 500 minutes | $25-75 |
| Deepgram (free tier) | 500 minutes | $0 (using free credit) |
| ElevenLabs (free tier) | ~25K characters | $0 |
| OpenAI GPT-4o | ~50K tokens | $1-5 |
| Twilio | 1 phone number + 100 SMS | $2 |
| Airtable (free tier) | <1K records | $0 |
| **Total Estimated** | | **$28-82/month** |

## Best Free Demo Stack

✅ **Completely Free Option (for testing):**

- Deepgram (free $200 credit)
- ElevenLabs (10K chars/month free)
- OpenAI GPT-4o (free $5 credit)
- Twilio ($15 trial credit)
- Airtable (free tier)
- Google Sheets (free API)

**Note:** Most services require a credit card only after exceeding free tiers or trial periods.