# Steps

## 1. Vapi Call Setup ✅
- **Status**: CONFIRMED - GPT-4o is built into Vapi
- **No separate ChatGPT needed**
- Vapi handles: Speech-to-Text + GPT-4o + Text-to-Speech

## 2. Real-Time API Integration During Call ✅
- **Status**: VALIDATED via actual chat conversation
- **How it works**: Vapi makes function calls to your backend WHILE tenant is still talking
- **Process**: 
  1. Tenant speaks → Vapi processes with GPT-4o
  2. When ready → Vapi calls `createTicket()` function to your server
  3. Your server → Creates record in Airtable immediately
  4. Response sent back to Vapi → Tenant gets instant confirmation

## 3. Backend Server Functions
- **Required Functions**:
  - `createTicket()` - Creates maintenance tickets in real-time
  - `updateTicket()` - Updates ticket details during conversation
  - `getTicketStatus()` - Retrieves ticket information
  - `getTenantInfo()` - Looks up tenant details
  - `createEmergencyTicket()` - Handles urgent issues

## 4. Airtable Integration
- **Tables Needed**:
  - Call Logs (conversation records)
  - Tickets (maintenance requests)
  - Tenants (tenant information)
  - Buildings (property details)

## 5. Webhook Events
- **call-start** - Initialize call logging
- **call-end** - Save full transcript and analytics
- **function-calls** - Real-time ticket creation during conversation

## Next Immediate Actions:
1. Set up Vapi account & configure voice agent
2. Create webhook server to handle function calls
3. Set up Airtable database schema
4. Test real-time ticket creation flow

 