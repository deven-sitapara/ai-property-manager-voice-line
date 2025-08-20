# 🧪 Manual End-to-End Testing (Without APIs)

This guide explains how to test each part of the **AI Property Management Voice Line** manually, without writing backend code.

---

## 1. Call into Vapi
- Place a test phone call (Vapi gives you a phone number or SIP/WebRTC line).
- Speak a sample sentence:  
  👉 *“I want to report a broken AC in apartment 204.”*
- Vapi records the **audio file** of your call.
- **Output:** Downloadable `.wav` or `.mp3` file from Vapi.

---

## 2. Send Audio → Deepgram (STT)
- Take the `.wav`/`.mp3` file from step 1.  
- Use `curl` or Deepgram’s CLI/SDK to upload it.  

Example:
```bash
curl \
  --request POST \
  --url https://api.deepgram.com/v1/listen \
  --header "Authorization: Token $DEEPGRAM_API_KEY" \
  --header "Content-Type: audio/wav" \
  --data-binary @call.wav

Output (JSON):

```json
{
  "results": {
    "channels": [
      {
        "alternatives": [
          {
            "transcript": "I want to report a broken AC in apartment 204."
          }
        ]
      }
    ]
  }
}
```

3. Send Transcript → OpenAI GPT-4o

Copy the "transcript" string manually.

Send it to GPT-4o via Playground or curl:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "You are a property management AI assistant."},
      {"role": "user", "content": "I want to report a broken AC in apartment 204."}
    ]
  }'
```

Output (example):

```
Got it, I’ll log a maintenance ticket for apartment 204. 
Do you want me to send someone today or tomorrow?

```


4. Log Manually → Airtable

Go to Airtable UI.

Create a record:

Transcript: “I want to report a broken AC…”

Intent: “Maintenance Request”

Status: “Open”

✅ This lets you test the Airtable schema before automating with Node.js.

5. Convert GPT Reply → ElevenLabs (TTS)

Take GPT’s text response manually.

Use curl to generate audio:

```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Got it, I’ll log a maintenance ticket for apartment 204. Do you want me to send someone today or tomorrow?",
    "voice_settings": {"stability": 0.75, "similarity_boost": 0.75}
  }' \
  -o reply.mp3
```

Output: reply.mp3 with natural AI voice.

6. Play Audio Back

Open the reply.mp3 file in your system audio player.

✅ This simulates what Vapi would play back to the caller.

🔗 Manual Chain Recap

Call → Record audio file via Vapi

STT → Upload audio file to Deepgram → JSON text

NLP → Paste text into GPT → AI response text

DB → Save transcript/intent manually into Airtable

TTS → Send GPT text to ElevenLabs → voice file

Listen → Play generated voice file locally

✅ This manual workflow validates each service individually before gluing them together with Node.js.

```

---

Do you also want me to prepare a **bash script** version of this workflow so you can semi-automate the test loop from terminal?

```

