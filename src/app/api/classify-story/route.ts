import { NextRequest, NextResponse } from 'next/server';
import { KNOWLEDGE_BASE } from '@/lib/knowledge_base';
import { CLASSIFY_STORY_PROMPT } from '@/lib/prompts';
import { callAI } from '@/lib/ai_client';

export async function POST(req: NextRequest) {
    try {
        const { story } = await req.json();

        if (!story) {
            return NextResponse.json({ error: 'Story is required' }, { status: 400 });
        }

        // Prepare System Prompt
        const systemPrompt = CLASSIFY_STORY_PROMPT(story, KNOWLEDGE_BASE);

        // Call AI
        try {
            const result = await callAI([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: story }
            ], true); // Expect JSON

            return NextResponse.json(result);

        } catch (apiError) {
            // Fallback to Mock if API fails (e.g., Token not set) for robustness
            console.warn("API Call failed, falling back to mock logic", apiError);

            // Simple keyword matching for mock
            let mockDim = 'career';
            if (story.includes('钱') || story.includes('穷') || story.includes('投资')) mockDim = 'wealth';
            else if (story.includes('爱') || story.includes('婚') || story.includes('感情')) mockDim = 'relationships';
            else if (story.includes('病') || story.includes('健康') || story.includes('身体') || story.includes('失眠') || story.includes('累')) mockDim = 'health';

            return NextResponse.json({
                dimensionId: mockDim,
                extractedInfo: { current_status: story }
            });
        }

    } catch (error) {
        console.error('Classification error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
