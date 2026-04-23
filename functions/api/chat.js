import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GOOGLE_GENERATIVE_AI_API_KEY is not set in Cloudflare' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await request.json();

    // Manual conversion to CoreMessage structure (role and content)
    const coreMessages = messages.map((m) => ({
      role: m.role,
      content: m.parts
        ? m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
        : m.content || '',
    }));

    const result = await streamText({
      model: google('gemini-2.5-flash', {
        apiKey: apiKey // Explicitly pass the key from Cloudflare env
      }),
      messages: coreMessages,
      system: "You are AdStack AI, a helpful assistant for digital advertisers and app developers. You help them analyze revenue, optimize campaigns, compare networks (like AdMob, AppLovin, Unity), and generate dashboards. Be concise, professional, and data-driven. In your responses, you can use markdown formatting.",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Cloudflare Function Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
