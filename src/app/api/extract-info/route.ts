import { NextRequest, NextResponse } from 'next/server';
import { EXTRACT_INFO_PROMPT } from '@/lib/prompts';
import { callAI } from '@/lib/ai_client';

export async function POST(req: NextRequest) {
    try {
        const { slotKey, userReply, questionIntent } = await req.json();

        if (!slotKey || !userReply) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 });
        }

        const systemPrompt = EXTRACT_INFO_PROMPT(slotKey, userReply, questionIntent || slotKey);

        try {
            const result = await callAI([
                { role: 'user', content: systemPrompt }  // Gemini requires user role
            ], true);

            return NextResponse.json({
                extractedValue: result.extractedValue,
                isOffTopic: result.isOffTopic || false,
                needsGuidance: result.needsGuidance || false
            });
        } catch (e) {
            // Fallback: assume user answered if it's substantial
            const isSubstantial = userReply.length > 10;
            return NextResponse.json({
                extractedValue: isSubstantial ? userReply : null,
                isOffTopic: !isSubstantial,
                needsGuidance: !isSubstantial
            });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
