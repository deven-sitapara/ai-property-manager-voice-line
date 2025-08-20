# Knowledge


## QnA

- Can we use ElevenLabs?
A: Yes, we can use ElevenLabs to generate a custom voice for the AI assistant.










## Vapi

### Features 
- Voice AI
- Can download chat audio and text too 
- No need to use deepgram to send audio to text
- Vapi acts as an orchestration layer for voice AI agents, and it integrates with various Speech-to-Text (STT) providers, including Deepgram. 

## Real-Time API Integration Flow:

1. Tenant calls → Vapi answers
2. "My sink is leaking badly!" 
3. Vapi (GPT-4o): Recognizes emergency plumbing
4. Calls createTicket() function → Your webhook
5. Your server → Airtable API → Ticket created instantly
6. Response: "Emergency ticket #A1B2C created!"
7. Vapi speaks: "I've created emergency ticket A1B2C. A plumber will call you within 1 hour."
8. All while tenant is still on the phone!

## Function Calling Architecture

Vapi can call your backend functions in real-time during conversations:

### Required Backend Functions:
- `createTicket(site, building, floor, tenant, issue, priority)`
- `updateTicket(ticketId, updates)`
- `getTicketStatus(ticketId)`
- `getTenantInfo(building, floor)`
- `createEmergencyTicket(priority, details)`

### Webhook Events:
- **call-start**: Initialize call logging
- **call-end**: Save transcript + analytics
- **function-call**: Execute real-time functions

## Send Data to ChatGPT






https://www.google.com/search?q=is+vapi+gives+communication+in+text+%2C+so+no+need+to+use+deepgram+to+send+audio+to+text+%2C+is+it+true%3F&sca_esv=6d7eaf65f03906bd&sxsrf=AE3TifMD6ta1PnMoxYmBLyDOg6-lfqV7DA%3A1755670195872&udm=50&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ59Aj-dkSgmXWKpa2HWaBZDtyvvIn4PVHl081BMOU6hqePjkUQDxmNMZlAa2JorCvAOGwUaUqdk3KRaXOI5--grKVtAolAl1k3I3P9NYfbsHK295hK__RrNkwQ1GO7qTwG0kcrrJ4svDn9jJ0yYpOQjrt1zQoyfhadFi6sjhhGVDFWWHiKfIQgyZwqjGvcMwSAMqDAw&aep=1&ntc=1&sa=X&ved=2ahUKEwiCpfiS3ZiPAxX81TgGHTgqPK8Q2J8OegQIDRAD&biw=1904&bih=958&dpr=1&mtid=t2alaJ6QHd-c4-EPs4uLmAw&mstk=AUtExfCtIbuFh4gGWW2Q75bAbi3XDNcPsZHVHgkLZQ5l4gnzR9WnOq_ecmXzERiduxpc0KGfgVnO_OFgqikPPw6bZKSRMI1w63CD2KVe56rhKNsZFaB0MXbldeQz6expHP77XDzf2E7QqGXHp0-r0RnrWd45g0BPXR9JYMESjZVvedZPq-Pg9bPYq_P7F8MU-mytQKtt9bG-3rFVcdQ2Z-4pON1TA94BWOT0SOaOhKqsKiZKw8IsDmvLJJF6c7gTFRM1WRWI3-4gYGnGZPJ-v_CFHov_XnVMnKt-EggBKCfdvSuPEfUPYH3VWICJwM6TFK74FXHZB0lB0mRFmQ&csuir=1