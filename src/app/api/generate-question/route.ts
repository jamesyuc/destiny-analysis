import { NextRequest, NextResponse } from 'next/server';
import { GENERATE_QUESTION_PROMPT, MIN_CONVERSATION_ROUNDS } from '@/lib/prompts';
import { callAI } from '@/lib/ai_client';
import { ChatMessage } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const {
            missingSlot,
            context,
            completedSlotsCount,
            conversationRound = 0,
            lastUserReply,
            filledSlots // New param
        } = await req.json();

        if (!missingSlot) {
            return NextResponse.json({ error: 'Missing slot required' }, { status: 400 });
        }

        const systemPrompt = GENERATE_QUESTION_PROMPT(
            missingSlot,
            context,
            completedSlotsCount || 0,
            conversationRound,
            lastUserReply,
            filledSlots
        );

        // Gemini requires at least one user message
        const messages: ChatMessage[] = [
            { role: 'user', content: systemPrompt }
        ];

        try {
            const result = await callAI(messages, true); // JSON mode

            // Handle skip
            if (result.shouldSkip && conversationRound >= MIN_CONVERSATION_ROUNDS) {
                return NextResponse.json({ question: 'SKIP' });
            }

            // Return response with possible dimension switch suggestion
            return NextResponse.json({
                question: result.reply || result.question,
                needsGuidance: result.needsGuidance || false,
                wantsToSwitch: result.wantsToSwitch || false,
                suggestedDimension: result.suggestedDimension || null
            });

        } catch (callError) {
            console.error("AI Call Failed:", callError);

            // Short fallback questions
            const fallbacks = [
                '什么行业？互联网还是传统？',
                '压力来自哪？领导还是工作量？',
                '具体说说？'
            ];
            return NextResponse.json({
                question: fallbacks[conversationRound % fallbacks.length]
            });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
