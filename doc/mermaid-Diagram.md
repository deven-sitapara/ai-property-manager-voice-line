sequenceDiagram
  participant Tenant as Dylan (Tenant)
  participant Vapi as Vapi Platform (Riley + GPT-4o)
  participant Server as Your Backend Server
  participant Airtable as Airtable Database
  participant BMS as Building Management System

  Tenant ->>+ Vapi: Dials AVHL Property Management
  Vapi ->> Vapi: Built-in GPT-4o loads Riley persona
  Vapi ->>+ Server: Webhook: 'call-start' event
  Server ->>+ Airtable: Create Call Log record
  Airtable -->>- Server: Return Call Log ID
  Server -->>- Vapi: 200 OK
  Vapi -->>- Tenant: "Thank you for calling AVHL Property Management.<br/>This is Riley, your building management support assistant.<br/>How may I help you today?"
  Tenant ->>+ Vapi: "Hey, Charlie. My AC is not working."
  Vapi ->> Vapi: Speech-to-Text + GPT-4o analysis
  Note over Vapi: Detects: HVAC issue<br/>Needs: Building details
  Vapi -->>- Tenant: "Thank you for letting me know. Just to clarify,<br/>are you referring to HVAC system, specifically<br/>the cooling or air conditioning? I'll be happy to assist<br/>in creating a support ticket for you."
  Tenant ->>+ Vapi: "Yeah. My site name is, uh, Radhakrishna."
  Vapi ->> Vapi: GPT-4o stores: site = "Radhakrishna"
  Vapi -->>- Tenant: "Thank you. Let me confirm. You're calling about<br/>the site Radhakrishna? Correct? Next, could you provide<br/>the building name or number as well as the floor<br/>and tenant name where the AC issue is occurring?"
  Tenant ->>+ Vapi: "Yeah. It's in ABC."
  Vapi ->> Vapi: GPT-4o stores: building = "ABC"
  Vapi -->>- Tenant: "Thank you. So the building name is Secret.<br/>Which floor and tenant space is experiencing<br/>the issue with the AC?"
  Tenant ->>+ Vapi: "First floor."
  Vapi ->> Vapi: GPT-4o stores: floor = "1"
  Note over Vapi: Needs tenant name
  Vapi -->>- Tenant: "Got it. You're reporting an AC issue on the first floor<br/>of the building named Secret at the Radhakrishna site.<br/>May I have the name of the tenant or company<br/>occupying the space?"
  Tenant ->>+ Vapi: "Dylan"
  Vapi ->> Vapi: GPT-4o stores: tenant = "Deven"
  Note over Vapi: All info collected:<br>Site: Radhakrishna<br>Building: ABC<br>Floor: 1<br>Tenant: Deven<br>Issue: AC not working
  Vapi -->>- Tenant: "Thank you. To confirm, the tenant name is Dylan.<br/>Is that correct? Now can you please describe<br/>the AC issue you're experiencing in detail?<br/>Is it completely nonfunctional, or are there<br/>intermittent problems?"
  Tenant ->>+ Vapi: "I want appointment for my AC repair."
  Vapi ->> Vapi: GPT-4o decides: Ready to create ticket
  Vapi ->>+ Server: Function Call: createTicket({
  Note over Server: site: "Radhakrishna",<br>building: "ABC",<br>floor: 1,<br>tenant: "Deven",<br>issue: "AC not working - repair needed",<br>priority: "routine",<br>access: "coordinate with building mgmt"
  Server ->>+ Airtable: CREATE Ticket record
  Airtable -->>- Server: Return Ticket ID: "TICKET-12345"
  Server ->>+ BMS: Log maintenance request
  BMS -->>- Server: Scheduled in system
  Server -->>- Vapi: Success: {"ticketId": "TICKET-12345", "status": "created"}
  Vapi ->> Vapi: GPT-4o formats response with ticket details
  Vapi -->>- Tenant: "Certainly, I'll create a support ticket for you<br/>and arrange an appointment for the AC repair.<br/>Just clarifying the details. This is for the<br/>Radhakrishna site, in Building Secret, first floor,<br/>tenant Dylan. Correct?"
  Tenant ->>+ Vapi: "Yeah. Coordinate with building management."
  Vapi ->> Vapi: GPT-4o updates ticket preferences
  Vapi ->>+ Server: Function Call: updateTicket({
  Note over Server: ticketId: "TICKET-12345",<br/>access: "coordinate_with_building_mgmt"
  Server ->>+ Airtable: UPDATE Ticket with access info
  Airtable -->>- Server: Updated successfully
  Server -->>- Vapi: Success: {"updated": true}
  Vapi -->>- Tenant: "Understood. We'll coordinate access with building management.<br/>I'll now create the support ticket for you.<br/>Just a moment while I access the BMS system.<br/>Your support ticket number is TICKET-12345.<br/>We'll arrange for the AC repair. Our maintenance team<br/>will be in touch within 24 hours to schedule the repair."
  Tenant ->>+ Vapi: "No. Thank you."
  Vapi ->>+ Server: Webhook: 'call-end' with full transcript
  Server ->>+ Airtable: Update Call Log with:
  Note over Airtable: - Complete conversation transcript<br/>- Ticket TICKET-12345 created<br/>- Call duration: 3.5 minutes<br/>- Resolution: Successful ticket creation<br/>- Access method: Building management
  Airtable -->>- Server: Call log updated
  Server -->>- Vapi: 200 OK
  Vapi -->>- Tenant: "You're welcome. Thank you for contacting<br/>AVHL Property Management. Your ticket has been logged<br/>and our team will be in touch soon. Have a great day."
  Server ->>+ BMS: Trigger maintenance workflow
  Server ->>+ Airtable: Create follow-up tasks
  Note over BMS: - Assign technician<br/>- Schedule within 24hrs<br/>- Coordinate building access<br/>- Send confirmation email


