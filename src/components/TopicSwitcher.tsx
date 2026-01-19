import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KNOWLEDGE_BASE } from '@/lib/knowledge_base';

interface TopicSwitcherProps {
    activeDimensionId: string | null;
    onSwitch: (dimensionId: string) => void;
}

export const TopicSwitcher: React.FC<TopicSwitcherProps> = ({ activeDimensionId, onSwitch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dimensions = Object.values(KNOWLEDGE_BASE);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 border border-amber-500/40 text-amber-400 bg-amber-900/20 hover:bg-amber-900/40"
            >
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    🔄
                </motion.span>
                <span className="font-serif tracking-tight">换话题</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-black/90 border border-amber-500/30 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
                    >
                        <div className="py-1">
                            {dimensions.map((dim) => {
                                const isActive = dim.id === activeDimensionId;
                                return (
                                    <button
                                        key={dim.id}
                                        onClick={() => {
                                            if (!isActive) {
                                                onSwitch(dim.id);
                                                setIsOpen(false);
                                            }
                                        }}
                                        disabled={isActive}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-serif transition-colors flex items-center justify-between
                                            ${isActive
                                                ? 'bg-amber-900/30 text-amber-500/50 cursor-default'
                                                : 'text-amber-100 hover:bg-amber-800/40 hover:text-amber-400'
                                            }
                                        `}
                                    >
                                        <span>{dim.label}</span>
                                        {isActive && <span className="text-xs">●</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
