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

            // Handle new response format: { reply, shouldSkip }
            if (result.shouldSkip && conversationRound >= MIN_CONVERSATION_ROUNDS) {
                return NextResponse.json({ question: 'SKIP' });
            }

            return NextResponse.json({
                question: result.reply || result.question,
                needsGuidance: result.needsGuidance || false
            });

        } catch (callError) {
            console.error("AI Call Failed:", callError);
            console.error("Request details:", {
                missingSlot: missingSlot?.key,
                context: context?.substring(0, 100),
                conversationRound
            });

            // Better fallback questions - use description, not question_intent
            const topic = missingSlot.description || missingSlot.question_intent;
            const fallbacks = [
                `说起来，${topic.includes('行业') ? '您是做什么行业的呀？互联网还是传统行业？' : topic.includes('领导') ? '您跟领导相处得怎么样？' : '能跟我聊聊具体情况吗？'}`,
                `对了，${topic.includes('状态') ? '您现在工作状态怎么样？顺心吗？' : topic.includes('目标') ? '您接下来有什么打算吗？' : '能再说说具体的情况吗？'}`,
                `我想更好地了解您。${topic.includes('变动') ? '最近有想过换工作吗？' : '能分享一下您的情况吗？'}`
            ];
            return NextResponse.json({
                question: fallbacks[conversationRound % fallbacks.length]
            });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
