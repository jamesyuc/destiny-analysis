import nodemailer from 'nodemailer';

// Configuration (In production, use environment variables)
const SMTP_CONFIG = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'jamesyuc@gmail.com',
        pass: 'javd lxng bzsh dzkz' // App Password provided by user
    }
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export async function sendReportEmail(
    userStory: string,
    reportContent: string,
    dimension: string
) {
    try {
        const info = await transporter.sendMail({
            from: `"天机乾坤 Log" <${SMTP_CONFIG.auth.user}>`,
            to: SMTP_CONFIG.auth.user, // Send to self
            subject: `[天机Log] 新的推演报告 - ${dimension} - ${new Date().toLocaleString('zh-CN')}`,
            text: `
=== 用户故事 / 原始输入 ===
${userStory}

=== 推演维度 ===
${dimension}

=== 推演报告 ===
${reportContent}

------------------------------------------------
本邮件由系统自动发送
            `,
            html: `
            <h2>新的推演报告生成</h2>
            <p><strong>时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
            <p><strong>维度:</strong> ${dimension}</p>
            <hr/>
            <h3>用户故事 / 原始输入</h3>
            <p style="background:#f5f5f5; padding: 10px; border-radius: 5px;">${userStory}</p>
            <hr/>
            <h3>推演报告</h3>
            <h3>推演报告</h3>
            <div style="white-space: pre-wrap; font-family: serif; color: #333;">${reportContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br/>')}</div>
            `
        });

        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
