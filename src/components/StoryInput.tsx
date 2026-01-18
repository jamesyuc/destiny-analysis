import React, { useState } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const styles = {
    container: "max-w-2xl mx-auto p-4 flex flex-col h-[60vh]",
    dialogueBox: "flex-1 bg-black/40 border border-white/10 rounded-lg p-6 mb-4 overflow-y-auto font-serif text-lg leading-relaxed text-gray-200 shadow-inner",
    inputArea: "relative mt-auto",
    input: "w-full bg-black/60 border border-white/20 rounded-lg pl-4 pr-12 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors shadow-2xl resize-none",
    sendBtn: "absolute right-2 bottom-3 p-2 bg-amber-700/80 hover:bg-amber-600 rounded text-white transition-colors"
};

interface StoryInputProps {
    onSubmit: (story: string) => void;
    isAnalyzing: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onSubmit, isAnalyzing }) => {
    const [content, setContent] = useState('');

    const handleSend = () => {
        if (!content.trim() || isAnalyzing) return;
        onSubmit(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
            {/* Avatar / Context Area (Placeholder) */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-900/30 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-2xl">🔮</span>
                </div>
            </div>

            {/* Main Dialogue / Prompt Area */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.dialogueBox}
            >
                <p className="mb-4 text-amber-400">
                    “命盘已开...”
                </p>
                <p>
                    不用拘泥于专业术语，请告诉我，**最近有什么事情让你感到困扰？** 是工作的变动、感情的迷茫，还是其他的什么？
                </p>
            </motion.div>

            {/* Input Area */}
            <div className={styles.inputArea}>
                <textarea
                    className={styles.input}
                    rows={3}
                    placeholder="在这里输入你的故事..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isAnalyzing}
                />
                <button
                    className={styles.sendBtn}
                    onClick={handleSend}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? (
                        <span className="animate-pulse">⏳</span>
                    ) : (
                        <span>➤</span>
                    )}
                </button>
            </div>
        </div>
    );
};
