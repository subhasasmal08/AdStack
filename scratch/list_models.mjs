import fs from 'fs';
import path from 'path';

async function listModels() {
  let apiKey = '';
  try {
    const envPath = path.resolve('.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
  } catch (e) {
    console.error('Could not read .env.local');
    return;
  }

  if (!apiKey) {
    console.error('No API Key found in .env.local');
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log('Available models:', data.models.map(m => m.name.replace('models/', '')).join(', '));
    } else {
      console.log('Error response:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error fetching models:', err);
  }
}

listModels();
