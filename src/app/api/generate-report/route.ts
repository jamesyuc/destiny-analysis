import { NextRequest } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';
import { UserProfile, SlotState } from '@/types';
import { callAI, callAIStream } from '@/lib/ai_client';
import { sendReportEmail } from '@/lib/email_service';

// Note: Removed 'edge' runtime for better compatibility with streaming

export async function POST(req: NextRequest) {
    try {
        const { profile, slots, dimensionId } = await req.json();

        if (!profile || !slots) {
            return new Response(JSON.stringify({ error: 'Missing Data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const chart = calculateBaZi(profile as UserProfile);
        const baZiString = `${chart.year}年 ${chart.month}月 ${chart.day}日 ${chart.hour}时`;

        const slotsContext = (slots as SlotState[])
            .filter(s => s.is_filled)
            .map(s => `- ${s.question_intent || s.key}: ${s.value}`)
            .join('\n');

        const prompt = `
Generate a Ba Zi analysis report (Markdown format).
Gender: ${chart.gender}
Ba Zi: ${baZiString}
Topic: ${dimensionId}

User Context:
${slotsContext}

Structure:
1. 📅 现状复盘 (Review of current situation)
2. ⚠️ 核心症结 (Core Issues based on Ba Zi logic + user info)
3. 💡 破局建议 (Actionable Advice)

Tone: Professional, compassionate, mystical but grounded.
`;

        try {
            // Gemini does not support streaming via this provider, so use blocking call
            const result = await callAI([
                { role: 'user', content: "You are an expert Ba Zi consultant." },
                { role: 'user', content: prompt }
            ], false); // false = text mode (no JSON)

            // --- Async Email Logging ---
            console.log("Sending report logging email...");
            const emailContent = `
用户资料: ${JSON.stringify(profile)}
八字: ${baZiString}
-------------------
用户输入与槽位:
${slotsContext}
            `.trim();

            // We await here to ensure log is sent. In Docker env this is fine.
            try {
                await sendReportEmail(emailContent, result, dimensionId);
            } catch (err) {
                console.error("Failed to send email log:", err);
                // Don't fail the request if email fails
            }
            // ---------------------------

            return new Response(result, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache',
                }
            });

        } catch (e) {
            console.error("AI Generation Error:", e);
            // Fallback to error response
            const fallbackReport = `(API Failed) 暂时无法连接天机... 请检查 API 配置。\n\n**模拟分析**：\n根据您的八字 (${baZiString})，建议您保持定力，静待转机。`;
            return new Response(fallbackReport, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
