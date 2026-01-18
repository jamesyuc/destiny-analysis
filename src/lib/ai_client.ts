const AI_BUILDER_API_URL = process.env.AI_BUILDER_API_URL || 'https://space.ai-builders.com/backend';
const AI_BUILDER_TOKEN = process.env.AI_BUILDER_TOKEN;

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function callAI(messages: ChatMessage[], jsonMode: boolean = true) {
    if (!AI_BUILDER_TOKEN) {
        console.warn("AI_BUILDER_TOKEN is missing. Using Mock response is not supported in this client version.");
        throw new Error("Missing AI_BUILDER_TOKEN");
    }

    const payload: any = {
        model: 'gemini-2.5-flash',
        messages,
        stream: false,
        temperature: 0.7,
    };

    // For Gemini/OpenAI, use response_format for reliable JSON output
    if (jsonMode) {
        payload.response_format = { type: 'json_object' };
    }

    console.log(`[AI Client] Calling ${AI_BUILDER_API_URL} with model ${payload.model}`);
    console.log(`[AI Client] Token starts with: ${AI_BUILDER_TOKEN?.substring(0, 5)}...`);

    try {
        const res = await fetch(`${AI_BUILDER_API_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_BUILDER_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("AI API Error:", res.status, errorText);
            throw new Error(`AI API Error: ${res.statusText}`);
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;

        if (jsonMode) {
            // Clean markdown code blocks if present (common issue with some models)
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '');
            return JSON.parse(cleanContent);
        }

        return content;

    } catch (error) {
        console.error("CallAI Failed:", error);
        throw error;
    }
}

/**
 * Streaming version of callAI - returns a ReadableStream of text chunks
 * Best for long-form content like reports where real-time display improves UX
 */
export async function callAIStream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    if (!AI_BUILDER_TOKEN) {
        throw new Error("Missing AI_BUILDER_TOKEN");
    }

    const payload = {
        model: 'gemini-2.5-flash',
        messages,
        stream: true,
        temperature: 0.7,
    };

    console.log(`[AI Client Stream] Calling ${AI_BUILDER_API_URL} with model ${payload.model}`);

    const res = await fetch(`${AI_BUILDER_API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_BUILDER_TOKEN}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("AI API Stream Error:", res.status, errorText);
        throw new Error(`AI API Error: ${res.statusText}`);
    }

    if (!res.body) {
        throw new Error("No response body");
    }

    // Transform the SSE stream into plain text chunks
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith('data: ')) continue;

                        const data = trimmed.slice(6);
                        if (data === '[DONE]') {
                            controller.close();
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                controller.enqueue(new TextEncoder().encode(content));
                            }
                        } catch (e) {
                            console.warn("Stream parse error for chunk:", data, e);
                        }
                    }
                }
                controller.close();
            } catch (error) {
                controller.error(error);
            }
        }
    });
}
