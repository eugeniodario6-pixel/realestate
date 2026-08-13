// WhatsApp Business Cloud API helpers

const WA_PHONE_ID = process.env.WHATSAPP_PHONE_ID!
const WA_TOKEN = process.env.WHATSAPP_TOKEN!
const BASE_URL = `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`

function e164(phone: string) {
  // strip non-digits, ensure leading +
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `+27${digits.slice(1)}` : `+${digits}`
}

async function send(payload: object) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`WhatsApp API error: ${err}`)
  }
  return res.json()
}

export async function notifyAgentViewingRequest(
  agentPhone: string,
  buyerName: string,
  buyerPhone: string,
  listingAddress: string,
) {
  return send({
    messaging_product: 'whatsapp',
    to: e164(agentPhone),
    type: 'text',
    text: {
      body: `🏠 New viewing request!\n\nBuyer: ${buyerName} (${buyerPhone})\nListing: ${listingAddress}\n\nReply to confirm a viewing time.`,
    },
  })
}

export async function sendBuyerViewingConfirmation(
  buyerPhone: string,
  listingAddress: string,
  viewingTime: string,
) {
  return send({
    messaging_product: 'whatsapp',
    to: e164(buyerPhone),
    type: 'text',
    text: {
      body: `✅ Your viewing is confirmed!\n\n📍 ${listingAddress}\n🕐 ${viewingTime}\n\nSee you there!`,
    },
  })
}

export async function sendFeedbackSurvey(
  buyerPhone: string,
  listingAddress: string,
  feedbackUrl: string,
) {
  return send({
    messaging_product: 'whatsapp',
    to: e164(buyerPhone),
    type: 'text',
    text: {
      body: `Hi! How did your viewing go at ${listingAddress}?\n\nTap to leave quick feedback (takes 5 seconds):\n${feedbackUrl}`,
    },
  })
}
