import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in the environment variables.');
    }
    const { messages } = await req.json();

    // Manual conversion to CoreMessage structure (role and content)
    // to avoid schema mismatch issues with convertToModelMessages in v6
    const coreMessages = messages.map((m) => ({
      role: m.role,
      content: m.parts
        ? m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
        : m.content || '',
    }));

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      messages: coreMessages,
      system: "You are AdStack AI, a helpful assistant for digital advertisers and app developers. You help them analyze revenue, optimize campaigns, compare networks (like AdMob, AppLovin, Unity), and generate dashboards. Be concise, professional, and data-driven. In your responses, you can use markdown formatting.",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
