"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

interface ExplainerProps {
    packetSize: number;
    mtu: number;
}

export const Explainer = ({ packetSize, mtu }: ExplainerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const IP_HEADER = 20;

    if (!packetSize || !mtu) return null;

    // --- Υπολογισμοί ---
    const totalData = packetSize - IP_HEADER;
    const maxPayloadPerFrag = mtu - IP_HEADER;
    const offsetStep = Math.floor(maxPayloadPerFrag / 8);
    const alignedDataPerFrag = offsetStep * 8;
    const fullFragLength = alignedDataPerFrag + IP_HEADER;
    const numFullFrags = Math.floor(totalData / alignedDataPerFrag);
    const dataSentInFullFrags = numFullFrags * alignedDataPerFrag;
    const remainingData = totalData - dataSentInFullFrags;
    const lastFragLength = remainingData + IP_HEADER;
    // -------------------

    return (
        <div className="w-full mt-6 pt-4 font-mono">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                animate={{
                    borderColor: isOpen ? "rgba(21, 128, 61, 0.4)" : ["rgba(20, 83, 45, 0.1)", "rgba(21, 128, 61, 0.3)", "rgba(20, 83, 45, 0.1)"],
                    boxShadow: isOpen ? "none" : ["0 0 0px rgba(0,0,0,0)", "0 0 8px rgba(21, 128, 61, 0.1)", "0 0 0px rgba(0,0,0,0)"]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`flex items-center gap-3 text-xs uppercase tracking-widest cursor-pointer transition-all w-full group py-3 px-4 border rounded-sm
            ${isOpen
                        ? "bg-green-950/30 text-green-600 border-green-800/30"
                        : "bg-black/40 text-green-800 hover:text-green-600 hover:bg-green-950/20 border-green-900/20"
                    }`}
            >
                <BookOpen className={`w-6 h-6 opacity-70 ${!isOpen && "animate-pulse"}`} />

                <span>
                    Βημα-Βημα Επεξηγηση
                    {!isOpen && <span className="ml-2 text-[12px] opacity-50 normal-case tracking-normal animate-pulse text-green-700">_click to decrypt logic_</span>}
                </span>

                <ChevronDown
                    className={`w-6 h-6 ml-auto transition-transform duration-300 opacity-60 ${isOpen ? "rotate-180 text-green-600" : "text-green-900 group-hover:text-green-600"
                        }`}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="w-full overflow-x-auto bg-[#0a0a0a] border-x border-b border-green-900/20 rounded-b-sm shadow-inner">

                            {/* Inner Container with Min-Width to force scroll on mobile */}
                            <div className="min-w-[500px] pt-6 pb-6 px-6 text-sm text-green-700 space-y-6 relative">

                                {/* Scanline decoration */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(20,83,45,0.05)_51%)] bg-[length:100%_3px]" />

                                {/* ΒΗΜΑ 1 */}
                                <div className="space-y-2 relative z-10">
                                    <h4 className="font-bold text-green-600 border-b border-green-900/30 inline-block">
                                        Βήμα 1: Ανάλυση IP Πακέτου
                                    </h4>
                                    <p className="opacity-80">
                                        Έστω IP πακέτο μεγέθους <span className="text-green-600 font-bold">{packetSize} bytes</span>.
                                    </p>
                                    <div className="pl-4 border-l-2 border-green-900/30 text-green-800">
                                        <p>Αφαιρούμε την επικεφαλίδα (Header):</p>
                                        <p>{packetSize} - 20 = <span className="text-green-600 font-bold">{totalData} bytes Δεδομένων (Data)</span></p>
                                    </div>
                                </div>

                                {/* ΒΗΜΑ 2 */}
                                <div className="space-y-2 relative z-10">
                                    <h4 className="font-bold text-green-600 border-b border-green-900/30 inline-block">
                                        Βήμα 2: Ανάλυση MTU Ζεύξης
                                    </h4>
                                    <p className="opacity-80">
                                        MTU Ζεύξης = <span className="text-green-600 font-bold">{mtu} bytes</span>.
                                    </p>
                                    <div className="pl-4 border-l-2 border-green-900/30 text-green-800">
                                        <p>IP Fragment (header + data) = {mtu} bytes max.</p>
                                        <p>Άρα μέγιστα δεδομένα ανά fragment:</p>
                                        <p>{mtu} - 20 = <span className="text-green-600 font-bold">{maxPayloadPerFrag} bytes</span> (Θεωρητικό max)</p>
                                    </div>
                                </div>

                                {/* ΒΗΜΑ 3 */}
                                <div className="space-y-2 bg-green-950/10 p-3 rounded border border-green-900/20 relative z-10">
                                    <h4 className="font-bold text-yellow-600/80 border-b border-yellow-900/10 inline-block">
                                        Βήμα 3: Υπολογισμός Offset (Μονάδες των 8 bytes)
                                    </h4>
                                    <p className="opacity-80 text-green-800">
                                        Το πεδίο offset μετριέται σε μονάδες των 8 bytes, γι' αυτό κάνουμε ακέραια διαίρεση (div):
                                    </p>
                                    <div className="text-lg font-bold text-center py-2 text-green-700">
                                        {maxPayloadPerFrag} div 8 = <span className="text-yellow-700">{offsetStep}</span>
                                    </div>
                                    <p className="opacity-80 text-green-800">
                                        Συνεπώς, κάθε <strong>Full Fragment</strong> θα έχει δεδομένα:
                                    </p>
                                    <div className="text-center font-bold text-green-700">
                                        8 * {offsetStep} = <span className="text-green-600">{alignedDataPerFrag} bytes</span>
                                    </div>
                                    <p className="text-xs text-green-800/60 mt-2 italic">
                                        *Αυτό είναι το νούμερο που χρησιμοποιούμε για τα δεδομένα, όχι το {maxPayloadPerFrag}.
                                    </p>
                                </div>

                                {/* ΒΗΜΑ 4 */}
                                <div className="space-y-2 relative z-10">
                                    <h4 className="font-bold text-green-600 border-b border-green-900/30 inline-block">
                                        Βήμα 4: Τελικό Μέγεθος Full Fragment
                                    </h4>
                                    <p className="opacity-80">
                                        Κάθε πλήρες fragment που βρήκαμε θα έχει:
                                    </p>
                                    <div className="pl-4 border-l-2 border-green-900/30 text-green-800">
                                        <p>{alignedDataPerFrag} (Data) + 20 (Header) = <span className="text-green-600 font-bold">{fullFragLength} bytes</span> (Length)</p>
                                    </div>
                                </div>

                                {/* ΒΗΜΑ 5 */}
                                <div className="space-y-2 relative z-10">
                                    <h4 className="font-bold text-green-600 border-b border-green-900/30 inline-block">
                                        Βήμα 5: Τι μένει για το τέλος;
                                    </h4>
                                    <p className="opacity-80">
                                        Μετά από <strong>{numFullFrags}</strong> full fragments έχουμε στείλει:
                                    </p>
                                    <div className="pl-4 border-l-2 border-green-900/30 text-green-800">
                                        <p>{numFullFrags} * {alignedDataPerFrag} = <span className="text-green-600 font-bold">{dataSentInFullFrags} bytes</span></p>
                                    </div>
                                    <p className="opacity-80 mt-2">
                                        Απομένουν για το τελευταίο fragment:
                                    </p>
                                    <div className="pl-4 border-l-2 border-green-900/30 text-green-800">
                                        <p>{totalData} - {dataSentInFullFrags} = <span className="text-green-600 font-bold">{remainingData} bytes</span></p>
                                        <p>Μέγεθος τελευταίου (Length): {remainingData} + 20 = <strong>{lastFragLength} bytes</strong></p>
                                    </div>
                                </div>

                                {/* ΣΥΝΟΨΗ */}
                                <div className="space-y-2 bg-black/40 p-3 rounded relative z-10 border border-green-900/10">
                                    <h4 className="font-bold text-green-600 border-b border-green-900/30 inline-block">
                                        Σύνοψη για τον Πίνακα
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 opacity-80 text-xs sm:text-sm text-green-700">
                                        <li>
                                            <strong>Offset:</strong> Για n = αριθμός fragment, έχω <code className="text-yellow-700">Offset = (n-1) * {offsetStep}</code>
                                        </li>
                                        <li>
                                            <strong>MF:</strong> MF=1 παντού, εκτός του τελευταίου που είναι MF=0.
                                        </li>
                                        <li>
                                            <strong>ID:</strong> Παντού ίδιο (π.χ. 'X').
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};