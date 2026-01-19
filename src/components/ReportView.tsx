import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

import { KNOWLEDGE_BASE } from '@/lib/knowledge_base';

interface ReportViewProps {
    reportContent: string;
    activeDimensionId?: string;
    onRestart: (dimensionId?: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ reportContent, activeDimensionId, onRestart }) => {
    // Track if report is still being streamed (content changing)
    const [prevLength, setPrevLength] = useState(0);
    const [isStreaming, setIsStreaming] = useState(true);

    useEffect(() => {
        if (reportContent.length === prevLength && reportContent.length > 100) {
            // Content stopped changing, streaming complete
            const timer = setTimeout(() => setIsStreaming(false), 500);
            return () => clearTimeout(timer);
        }
        setPrevLength(reportContent.length);
        setIsStreaming(true);
    }, [reportContent, prevLength]);

    const isComplete = !isStreaming && reportContent.length > 0;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
            {/* Ambient glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* The Scroll Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="scroll-container relative rounded-lg overflow-visible"
                style={{
                    padding: '60px 50px',
                    minHeight: '70vh'
                }}
            >
                {/* Corner decorations */}
                <div className="scroll-corner scroll-corner-tl" />
                <div className="scroll-corner scroll-corner-tr" />
                <div className="scroll-corner scroll-corner-bl" />
                <div className="scroll-corner scroll-corner-br" />

                {/* Header with decorative elements */}
                <div className="relative text-center mb-10 pt-4">
                    {/* Top decorative line */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                        <div className="text-amber-500/60 text-xl">☯</div>
                        <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
                    </div>

                    {/* Main Title */}
                    <h1
                        className="text-4xl md:text-5xl font-serif tracking-[0.3em] animate-rune-glow"
                        style={{
                            background: 'linear-gradient(180deg, #fde68a 0%, #d4af37 50%, #b8860b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        天 机 乾 坤
                    </h1>

                    {/* Subtitle */}
                    <p className="text-amber-500/50 text-xs tracking-[0.5em] uppercase mt-3">
                        · Destiny Revelation ·
                    </p>

                    {/* Bottom decorative line */}
                    <div className="mt-6 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                </div>

                {/* Content Area */}
                <div
                    className="prose prose-lg prose-mystic max-w-none font-serif text-amber-100/90 leading-relaxed tracking-wide"
                    style={{
                        lineHeight: '2',
                        fontSize: '1.1rem'
                    }}
                >
                    <ReactMarkdown>{reportContent}</ReactMarkdown>

                    {/* Typing cursor */}
                    {!isComplete && (
                        <span className="inline-block w-2 h-5 bg-amber-500/70 ml-1 animate-pulse" />
                    )}
                </div>

                {/* Seal Stamp - appears when complete */}
                {isComplete && (
                    <motion.div
                        initial={{ scale: 3, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: -12 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                        className="flex justify-center mt-16 mb-4"
                    >
                        <div
                            className="relative w-28 h-28 flex items-center justify-center"
                            style={{
                                border: '3px solid #991b1b',
                                borderRadius: '8px',
                                background: 'rgba(127, 29, 29, 0.1)',
                                boxShadow: '0 0 30px rgba(185, 28, 28, 0.3), inset 0 0 20px rgba(185, 28, 28, 0.1)'
                            }}
                        >
                            <div
                                className="absolute inset-2 border-2 border-red-800/80 rounded flex flex-col items-center justify-center"
                            >
                                <span className="text-red-700 font-serif font-bold text-xl tracking-widest">天机</span>
                                <span className="text-red-700 font-serif font-bold text-xl tracking-widest">已定</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Bottom decoration and Share Button */}
                <div className="mt-8 flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center gap-4 opacity-60">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500/30" />
                        <span className="text-amber-500/40 text-sm font-serif">道法自然</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-500/30" />
                    </div>

                    {/* Share Button */}
                    {isComplete && (
                        <div className="flex flex-col items-center gap-2">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-amber-900/40 border border-amber-500/30 text-amber-200 hover:bg-amber-800/60 hover:border-amber-500/60 transition-all font-serif tracking-widest text-sm shadow-lg hover:shadow-amber-500/20"
                                onClick={() => {
                                    const shareData = {
                                        title: '天机乾坤 - 命理推演报告',
                                        text: reportContent,
                                        url: window.location.href
                                    };

                                    if (navigator.share) {
                                        navigator.share(shareData).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(`【天机乾坤】\n\n${reportContent}\n\n${window.location.href}`)
                                            .then(() => alert('报告已复制到剪贴板'))
                                            .catch(() => alert('复制失败，请手动复制'));
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                                分享天机
                            </motion.button>
                            <p className="text-xs text-amber-500/30">让有缘人共赏</p>
                        </div>
                    )}
                </div>
            </motion.div>


            {/* Guidance for other dimensions */}
            {isComplete && (
                <div className="mt-20">
                    <div className="text-center mb-10">
                        <p className="text-amber-500/40 text-sm tracking-[0.3em] mb-4">· 接续推演 ·</p>
                        <h3 className="text-2xl font-serif text-amber-100/80 tracking-widest">探寻其他命理方位</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {Object.values(KNOWLEDGE_BASE)
                            .filter(d => d.id !== activeDimensionId)
                            .map(dim => (
                                <motion.div
                                    key={dim.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group cursor-pointer relative overflow-hidden rounded-lg border border-amber-900/30 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:border-amber-500/30 hover:bg-amber-900/10"
                                    onClick={() => onRestart(dim.id)}
                                >
                                    <div className="text-amber-500/40 text-sm mb-2 font-serif tracking-widest uppercase">
                                        {dim.id === 'career' ? '事业' :
                                            dim.id === 'wealth' ? '财运' :
                                                dim.id === 'relationships' ? '情感' : '健康'}
                                    </div>
                                    <h4 className="text-xl font-serif text-amber-100 mb-2">{dim.label}</h4>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                                        {dim.description}
                                    </p>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                    </div>
                </div>
            )}

            {/* Restart Button (General) */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center border-t border-white/5 pt-12"
                >
                    <button
                        className="group relative px-8 py-3 font-serif text-sm tracking-[0.2em] text-amber-500/60 hover:text-amber-500 transition-colors"
                        onClick={() => onRestart()}
                    >
                        <span className="relative z-10">重新开始全盘推演</span>
                    </button>
                </motion.div>
            )}
        </div>
    );
};
