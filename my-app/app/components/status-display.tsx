"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { LoadingDots } from "./loading-dots";

export const StatusDisplay = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center flex flex-col items-center gap-4 p-8"
            >
                {/* Animated Icon Container */}
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative"
                >
                    {/* Main Icon - Bright Green */}
                    <Terminal className="w-12 h-12 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />

                    {/* Glow Effect - Green Blob behind */}
                    <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full" />
                </motion.div>

                <div className="space-y-2">
                    {/* Main Text */}
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm tracking-[0.2em] uppercase font-bold text-green-400 text-shadow-sm"
                    >
                        Awaiting Packet Data<LoadingDots />
                    </motion.p>

                    {/* Subtext - Dimmed Green */}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-mono block text-green-900"
                    >
                        Input valid IPv4 size & MTU to initialize logic.
                    </motion.span>
                </div>
            </motion.div>
        </div>
    );
};