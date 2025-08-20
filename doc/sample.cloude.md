I'll help you build a sample AI Property Manager Voice Line demo. Here's the complete tech stack and implementation plan:
Recommended Tech Stack for Demo
Core Components

Vapi - Voice AI orchestration
Airtable - Database for calls, tickets, and logs
OpenAI GPT-4o - Intent classification and response generation
Node.js/Express - Backend webhook server
Deepgram (via Vapi) - Speech-to-Text
ElevenLabs (via Vapi) - Text-to-Speech

Optional for Full Demo

Twilio - SMS notifications (can simulate for demo)
Ngrok - Local development tunneling

Implementation Plan




AI Property Manager Voice Line Demo - Complete Setup Guide
1. Airtable Database Setup
Base Structure: "Property Manager Voice AI"
Table 1: "Call Logs"

Call ID (Auto Number)
Phone Number (Phone Number)
Call Start Time (Date/Time)
Call Duration (Duration)
Transcript (Long Text)
Intent Classification (Single Select: Emergency, Urgent, Standard, Info)
Sentiment (Single Select: Positive, Neutral, Negative)
Ticket Created (Checkbox)
Call Summary (Long Text)

Table 2: "Tickets"

Ticket ID (Auto Number)
Call ID (Link to Call Logs)
Property Address (Single Line Text)
Tenant Name (Single Line Text)
Issue Type (Single Select: Plumbing, Electrical, HVAC, Appliance, Other)
Priority (Single Select: Emergency, High, Medium, Low)
Description (Long Text)
Status (Single Select: Open, In Progress, Resolved, Closed)
Vendor Assigned (Single Line Text)
Created Date (Date)
Resolution Notes (Long Text)

Table 3: "Knowledge Base"

Issue Type (Single Select: Plumbing, Electrical, HVAC, etc.)
Keywords (Multiple Select)
Troubleshooting Steps (Long Text)
Auto Response (Long Text)
Escalation Required (Checkbox)

2. Vapi Assistant Configuration
Assistant Settings

```
{
  "name": "PropertyManagerAI",
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM", // Professional female voice
    "model": "eleven_turbo_v2"
  },
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.3,
    "systemMessage": "You are a professional property management assistant. Your role is to help tenants report maintenance issues, gather necessary information, and provide helpful guidance. Be empathetic, efficient, and professional. Always confirm details like property address, contact information, and issue description."
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-3",
    "language": "en-US"
  },
  "serverUrl": "https://your-domain.ngrok.io/webhook",
  "firstMessage": "Hello! This is your property management assistant. I'm here to help with any maintenance issues or questions you have about your rental property. May I start by getting your name and property address?"
}
```

Function Definitions for Vapi
```
{
  "functions": [
    {
      "name": "createTicket",
      "description": "Create a maintenance ticket when tenant reports an issue",
      "parameters": {
        "type": "object",
        "properties": {
          "tenantName": {"type": "string"},
          "propertyAddress": {"type": "string"},
          "issueType": {"type": "string", "enum": ["plumbing", "electrical", "hvac", "appliance", "other"]},
          "description": {"type": "string"},
          "priority": {"type": "string", "enum": ["emergency", "high", "medium", "low"]},
          "phoneNumber": {"type": "string"}
        },
        "required": ["tenantName", "propertyAddress", "issueType", "description", "priority"]
      }
    },
    {
      "name": "getTroubleshootingSteps",
      "description": "Get troubleshooting steps for common issues",
      "parameters": {
        "type": "object",
        "properties": {
          "issueType": {"type": "string"}
        },
        "required": ["issueType"]
      }
    }
  ]
}
```

3. Node.js Backend Server
Package Dependencies

```
{
  "name": "property-manager-voice-ai",
  "dependencies": {
    "express": "^4.18.2",
    "airtable": "^0.12.2",
    "openai": "^4.20.1",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5"
  }
}
```

Environment Variables (.env)
```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```



Main Server Code (server.js)

```
const express = require('express');
const Airtable = require('airtable');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize services
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
  .base(process.env.AIRTABLE_BASE_ID);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Webhook endpoint for Vapi
app.post('/webhook', async (req, res) => {
  const { type, call, message } = req.body;
  
  try {
    switch (type) {
      case 'function-call':
        await handleFunctionCall(req.body);
        break;
      case 'call-start':
        await logCallStart(call);
        break;
      case 'call-end':
        await logCallEnd(call);
        break;
      case 'transcript':
        await updateTranscript(call.id, message);
        break;
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function call handler
async function handleFunctionCall(data) {
  const { functionCall, call } = data;
  
  switch (functionCall.name) {
    case 'createTicket':
      return await createMaintenanceTicket(functionCall.parameters, call);
    case 'getTroubleshootingSteps':
      return await getTroubleshootingSteps(functionCall.parameters.issueType);
  }
}

// Create maintenance ticket in Airtable
async function createMaintenanceTicket(params, call) {
  try {
    // Create ticket record
    const ticket = await base('Tickets').create([{
      fields: {
        'Call ID': call.id,
        'Property Address': params.propertyAddress,
        'Tenant Name': params.tenantName,
        'Issue Type': params.issueType,
        'Priority': params.priority,
        'Description': params.description,
        'Status': 'Open',
        'Created Date': new Date().toISOString()
      }
    }]);

    // Update call log with ticket creation
    await base('Call Logs').update([{
      id: call.airtableId,
      fields: {
        'Ticket Created': true,
        'Intent Classification': params.priority
      }
    }]);

    return {
      result: `Ticket created successfully! Your ticket number is ${ticket[0].id}. 
               ${params.priority === 'emergency' ? 
                 'This is marked as emergency - someone will contact you within 1 hour.' : 
                 'We will contact you within 24 hours with an update.'}`
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { result: 'I apologize, there was an error creating your ticket. Please call back or contact our office directly.' };
  }
}

// Get troubleshooting steps
async function getTroubleshootingSteps(issueType) {
  try {
    const records = await base('Knowledge Base')
      .select({ filterByFormula: `{Issue Type} = '${issueType}'` })
      .firstPage();
    
    if (records.length > 0) {
      const steps = records[0].get('Troubleshooting Steps');
      const autoResponse = records[0].get('Auto Response');
      
      return {
        result: `${autoResponse}\n\nHere are some troubleshooting steps you can try:\n${steps}`
      };
    } else {
      return {
        result: "Let me create a ticket for you right away since I don't have specific troubleshooting steps for this issue."
      };
    }
  } catch (error) {
    console.error('Error getting troubleshooting steps:', error);
    return { result: "I'll create a ticket for you to ensure this gets proper attention." };
  }
}

// Log call start
async function logCallStart(call) {
  try {
    const record = await base('Call Logs').create([{
      fields: {
        'Call ID': call.id,
        'Phone Number': call.customer?.number || 'Unknown',
        'Call Start Time': new Date().toISOString(),
        'Transcript': '',
        'Sentiment': 'Neutral'
      }
    }]);
    
    // Store Airtable record ID for later updates
    call.airtableId = record[0].id;
  } catch (error) {
    console.error('Error logging call start:', error);
  }
}

// Log call end with analysis
async function logCallEnd(call) {
  try {
    // Analyze the call transcript
    const analysis = await analyzeCall(call.transcript);
    
    await base('Call Logs').update([{
      id: call.airtableId,
      fields: {
        'Call Duration': call.endedReason === 'customer-ended-call' ? 
          calculateDuration(call.startedAt, call.endedAt) : null,
        'Sentiment': analysis.sentiment,
        'Call Summary': analysis.summary,
        'Intent Classification': analysis.intent
      }
    }]);
  } catch (error) {
    console.error('Error logging call end:', error);
  }
}

// Analyze call using OpenAI
async function analyzeCall(transcript) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: `Analyze this property management call transcript and return JSON with:
                  - sentiment: "positive", "neutral", or "negative"
                  - intent: "emergency", "urgent", "standard", or "info"
                  - summary: Brief 2-3 sentence summary of the call`
      }, {
        role: "user",
        content: transcript
      }],
      temperature: 0.3
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing call:', error);
    return {
      sentiment: 'neutral',
      intent: 'standard',
      summary: 'Call analysis unavailable'
    };
  }
}

// Update transcript
async function updateTranscript(callId, message) {
  // Implementation for real-time transcript updates
}

// Calculate call duration
function calculateDuration(start, end) {
  return Math.round((new Date(end) - new Date(start)) / 1000);
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```



4. Setup Steps
Step 1: Airtable Setup

Create new Airtable base with tables above
Get API key from account settings
Get Base ID from API documentation

Step 2: Vapi Setup

Sign up at vapi.ai
Create new assistant with configuration above
Get phone number for testing

Step 3: Server Setup

Install dependencies: npm install
Set up environment variables
Run server: npm start
Use ngrok for webhook: ngrok http 3000

Step 4: Testing Flow

Call Vapi phone number
Report a maintenance issue
Check Airtable for logged data
Verify ticket creation

5. Sample Knowledge Base Data
Add these records to your Knowledge Base table:
Issue TypeKeywordsTroubleshooting StepsAuto Responseplumbingtoilet, sink, leak, water1. Check if water shut-off valve is accessible 2. Turn off water if actively leaking 3. Check for clogsI understand you're having a plumbing issue. Let me help you with some immediate steps.electricalpower, outlet, breaker, lights1. Check circuit breaker panel 2. Try other outlets in the room 3. Ensure GFCI outlets aren't trippedI see you're experiencing an electrical problem. Safety first - let me guide you through some checks.hvacheat, ac, temperature, air1. Check thermostat settings 2. Verify air filter isn't clogged 3. Check that vents aren't blockedI understand your HVAC system needs attention. Let's try a few troubleshooting steps.


This setup provides a complete voice AI system that can handle tenant calls, log everything to Airtable, create tickets, and provide intelligent responses based on your knowledge base.