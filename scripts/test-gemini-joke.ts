import { config } from 'dotenv';
config({ path: '.env.local' });

const AI_BUILDER_API_URL = process.env.AI_BUILDER_API_URL || 'https://space.ai-builders.com/backend';
const AI_BUILDER_TOKEN = process.env.AI_BUILDER_TOKEN;

async function tellJoke() {
  console.log('=== Gemini Joke Test ===');
  console.log(`URL: ${AI_BUILDER_API_URL}`);
  
  const payload = {
    model: 'gemini-2.5-pro', // Using Gemini as requested
    messages: [
      { role: 'user', content: '请用中文讲一个程序员的笑话' }
    ],
    stream: false,
    temperature: 0.9,
  };

  console.log('\n发送请求中...');
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
    console.log(`响应时间: ${elapsed}ms`);
    console.log(`状态: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('错误:', errorText);
      return;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('\n=== Gemini 说 ===');
    console.log(content);
    console.log('\n=== 使用统计 ===');
    console.log(`Prompt Tokens: ${data.usage?.prompt_tokens}`);
    console.log(`Completion Tokens: ${data.usage?.completion_tokens}`);

  } catch (error) {
    console.error('请求失败:', error);
  }
}

tellJoke();
