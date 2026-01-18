// Test script to verify AI API connectivity
// Run with: npx tsx scripts/test-ai.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

const AI_BUILDER_API_URL = process.env.AI_BUILDER_API_URL || 'https://api.deepseek.com';
const AI_BUILDER_TOKEN = process.env.AI_BUILDER_TOKEN;

async function testAICall() {
    console.log('=== AI API Test ===');
    console.log(`URL: ${AI_BUILDER_API_URL}`);
    console.log(`Token: ${AI_BUILDER_TOKEN?.substring(0, 10)}...`);

    if (!AI_BUILDER_TOKEN) {
        console.error('ERROR: AI_BUILDER_TOKEN is not set!');
        return;
    }

    const payload = {
        model: 'deepseek',
        messages: [
            { role: 'system', content: 'You are a helpful assistant. Reply in JSON format: {"reply": "your message"}' },
            { role: 'user', content: 'Say hello in Chinese' }
        ],
        stream: false,
        temperature: 0.7,
        response_format: { type: 'json_object' }
    };

    console.log('\nSending request...');
    const startTime = Date.now();

    try {
        const res = await fetch(`${AI_BUILDER_API_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_BUILDER_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const elapsed = Date.now() - startTime;
        console.log(`Response received in ${elapsed}ms`);
        console.log(`Status: ${res.status} ${res.statusText}`);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('ERROR Response Body:', errorText);
            return;
        }

        const data = await res.json();
        console.log('\n=== SUCCESS ===');
        console.log('Full Response:', JSON.stringify(data, null, 2));

        const content = data.choices?.[0]?.message?.content;
        console.log('\nAI Content:', content);

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`\nERROR after ${elapsed}ms:`, error);
    }
}

testAICall();
