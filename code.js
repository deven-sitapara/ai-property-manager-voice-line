const express = require('express');
const Airtable = require('airtable');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize services
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
  .base(process.env.AIRTABLE_BASE_ID);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store call data temporarily
const callData = new Map();

// Webhook endpoint for Vapi
app.post('/webhook', async (req, res) => {
  console.log('Received webhook:', req.body);
  const { type, call, message, functionCall } = req.body;
  
  try {
    let result = null;
    
    switch (type) {
      case 'function-call':
        result = await handleFunctionCall(functionCall, call);
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
      case 'status-update':
        console.log('Call status update:', call.status);
        break;
    }
    
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function call handler
async function handleFunctionCall(functionCall, call) {
  console.log('Function call:', functionCall.name, functionCall.parameters);
  
  switch (functionCall.name) {
    case 'createTicket':
      return await createMaintenanceTicket(functionCall.parameters, call);
    case 'getTroubleshootingSteps':
      return await getTroubleshootingSteps(functionCall.parameters.issueType);
    default:
      return { result: "I'm not sure how to help with that. Let me create a ticket for you." };
  }
}

// Create maintenance ticket in Airtable
async function createMaintenanceTicket(params, call) {
  try {
    console.log('Creating ticket with params:', params);
    
    // Create ticket record
    const ticket = await base('Tickets').create([{
      fields: {
        'Property Address': params.propertyAddress || 'Not provided',
        'Tenant Name': params.tenantName || 'Not provided',
        'Issue Type': capitalizeFirst(params.issueType || 'other'),
        'Priority': capitalizeFirst(params.priority || 'medium'),
        'Description': params.description || 'No description provided',
        'Status': 'Open',
        'Created Date': new Date().toISOString().split('T')[0]
      }
    }]);

    const ticketId = ticket[0].id;
    console.log('Created ticket:', ticketId);

    // Update call log if it exists
    const callInfo = callData.get(call.id);
    if (callInfo && callInfo.airtableId) {
      await base('Call Logs').update([{
        id: callInfo.airtableId,
        fields: {
          'Ticket Created': true,
          'Intent Classification': capitalizeFirst(params.priority || 'standard')
        }
      }]);
    }

    // Generate response based on priority
    let response = `Perfect! I've created your maintenance ticket #${ticketId.slice(-6)}. `;
    
    switch (params.priority?.toLowerCase()) {
      case 'emergency':
        response += "Since this is an emergency, someone will contact you within 1 hour. If this is a life-threatening situation, please hang up and call 911 immediately.";
        break;
      case 'high':
        response += "This is marked as high priority. You can expect a call from our maintenance team within 4 hours.";
        break;
      default:
        response += "You can expect an update within 24 hours. We'll call you to schedule the repair at your convenience.";
    }

    return { result: response };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { 
      result: "I apologize, I'm having trouble creating your ticket right now. Please try calling back in a few minutes, or you can reach our office directly during business hours." 
    };
  }
}

// Get troubleshooting steps
async function getTroubleshootingSteps(issueType) {
  try {
    console.log('Getting troubleshooting steps for:', issueType);
    
    const records = await base('Knowledge Base')
      .select({ 
        filterByFormula: `LOWER({Issue Type}) = '${issueType.toLowerCase()}'`
      })
      .firstPage();
    
    if (records.length > 0) {
      const steps = records[0].get('Troubleshooting Steps');
      const autoResponse = records[0].get('Auto Response');
      
      return {
        result: `${autoResponse || ''}\n\n${steps || 'Let me create a ticket for you instead.'}`
      };
    } else {
      return {
        result: "I don't have specific troubleshooting steps for this issue, but I can definitely create a ticket to get you the help you need."
      };
    }
  } catch (error) {
    console.error('Error getting troubleshooting steps:', error);
    return { 
      result: "Let me create a maintenance ticket for you to ensure this gets proper attention from our team." 
    };
  }
}

// Log call start
async function logCallStart(call) {
  try {
    console.log('Logging call start for:', call.id);
    
    const record = await base('Call Logs').create([{
      fields: {
        'Phone Number': call.customer?.number || call.phoneNumber || 'Unknown',
        'Call Start Time': new Date().toISOString(),
        'Transcript': 'Call started...',
        'Sentiment': 'Neutral',
        'Intent Classification': 'Unknown',
        'Ticket Created': false
      }
    }]);
    
    // Store call info
    callData.set(call.id, {
      airtableId: record[0].id,
      startTime: new Date(),
      transcript: 'Call started...'
    });
    
    console.log('Call logged with ID:', record[0].id);
  } catch (error) {
    console.error('Error logging call start:', error);
  }
}

// Log call end with analysis
async function logCallEnd(call) {
  try {
    console.log('Logging call end for:', call.id);
    
    const callInfo = callData.get(call.id);
    if (!callInfo) {
      console.log('No call info found for:', call.id);
      return;
    }

    // Calculate duration
    const duration = Math.round((new Date() - callInfo.startTime) / 1000);
    
    // Analyze the call transcript
    let analysis = {
      sentiment: 'neutral',
      intent: 'standard', 
      summary: 'Call completed successfully'
    };

    if (callInfo.transcript && callInfo.transcript.length > 50) {
      try {
        analysis = await analyzeCall(callInfo.transcript);
      } catch (error) {
        console.error('Error analyzing call:', error);
      }
    }
    
    await base('Call Logs').update([{
      id: callInfo.airtableId,
      fields: {
        'Call Duration': duration,
        'Sentiment': capitalizeFirst(analysis.sentiment),
        'Call Summary': analysis.summary,
        'Intent Classification': capitalizeFirst(analysis.intent),
        'Transcript': callInfo.transcript
      }
    }]);
    
    // Clean up
    callData.delete(call.id);
    console.log('Call end logged successfully');
    
  } catch (error) {
    console.error('Error logging call end:', error);
  }
}

// Analyze call using OpenAI
async function analyzeCall(transcript) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for cost efficiency
      messages: [{
        role: "system",
        content: `Analyze this property management call transcript. Return JSON with:
                  - sentiment: "positive", "neutral", or "negative" 
                  - intent: "emergency", "urgent", "standard", or "info"
                  - summary: Brief 1-2 sentence summary of what the tenant needed

                  Example: {"sentiment": "neutral", "intent": "standard", "summary": "Tenant reported a leaky faucet in kitchen and received troubleshooting steps."}`
      }, {
        role: "user", 
        content: `Transcript: ${transcript.substring(0, 2000)}` // Limit length
      }],
      temperature: 0.3,
      max_tokens: 150
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log('Call analysis result:', result);
    return result;
    
  } catch (error) {
    console.error('Error analyzing call:', error);
    return {
      sentiment: 'neutral',
      intent: 'standard', 
      summary: 'Call analysis unavailable'
    };
  }
}

// Update transcript in real-time
async function updateTranscript(callId, message) {
  try {
    const callInfo = callData.get(callId);
    if (callInfo) {
      if (message.type === 'transcript' && message.transcript) {
        callInfo.transcript += `\n${message.role}: ${message.transcript}`;
        callData.set(callId, callInfo);
      }
    }
  } catch (error) {
    console.error('Error updating transcript:', error);
  }
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'Property Manager Voice AI Server',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📞 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🌐 Make sure to expose this with ngrok for Vapi integration`);
});