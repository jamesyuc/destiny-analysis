import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { KNOWLEDGE_BASE } from '@/lib/knowledge_base';

interface DimensionTransitionProps {
    dimensionId: string;
    onComplete: () => void;
}

export const DimensionTransition: React.FC<DimensionTransitionProps> = ({ dimensionId, onComplete }) => {
    const dimension = KNOWLEDGE_BASE[dimensionId];

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // 3.5s duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!dimension) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
            <div className="relative text-center">
                {/* Background Orb */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.3 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/30 rounded-full blur-[100px]"
                />

                {/* Top Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-8"
                />

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 font-bold tracking-[0.2em] mb-4"
                >
                    {dimension.label}
                </motion.h2>

                {/* Subtitle / Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-amber-100/60 font-serif text-xl tracking-widest mt-6"
                >
                    {dimension.description}
                </motion.p>

                {/* Status text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.8 }}
                    className="text-amber-500/40 text-sm tracking-[0.4em] uppercase mt-12 animate-pulse"
                >
                    正在开启命盘空间...
                </motion.p>

                {/* Bottom Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-8"
                />
            </div>
        </motion.div>
    );
};
