// Webhook utility for sending data to external systems
// Used for BI integration and external notifications

export async function sendWebhook(data: any) {
  // Check if webhook is configured
  const webhookUrl = process.env.DATA_HUB_URL;
  const signingSecret = process.env.DATA_HUB_SIGNING_SECRET;
  
  if (!webhookUrl) {
    console.log('Webhook not configured - skipping');
    return;
  }

  try {
    // Create HMAC signature if secret is provided
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (signingSecret) {
      const crypto = require('crypto');
      const payload = JSON.stringify(data);
      const signature = crypto
        .createHmac('sha256', signingSecret)
        .update(payload)
        .digest('hex');
      headers['X-Hub-Signature-256'] = `sha256=${signature}`;
    }

    // Send webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Webhook failed:', response.status, response.statusText);
    } else {
      console.log('Webhook sent successfully');
    }
  } catch (error) {
    console.error('Webhook error:', error);
  }
}
