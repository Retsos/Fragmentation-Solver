export type Fragment = {
    n: number;
    length: number;
    id: string;
    mf: number;
    offset: number;
};

export const IP_HEADER = 20;

export function calculateFragments(packetSize: number, mtu: number): Fragment[] | null {
    // 1. Validation Logic 
    if (packetSize < IP_HEADER || packetSize > 65535) return null;
    if (mtu < IP_HEADER + 8 || mtu > 1500) return null;

    // 2. Case: No fragmentation needed
    if (packetSize <= mtu) {
        return [{ n: 1, length: packetSize, id: "X", mf: 0, offset: 0 }];
    }

    // 3. Core Calculations
    const dataSize = packetSize - IP_HEADER;
    const maxFragmentSize = mtu - IP_HEADER;

    // 8-byte alignment rule (RFC 791). 
    // Πάντα στρογγυλοποιούμε προς τα κάτω στο πλησιέστερο 8άρι.
    const offsetStep = Math.floor(maxFragmentSize / 8);
    const effectivePayloadPerFragment = offsetStep * 8;

    // Υπολογισμός πόσα "γεμάτα" και πόσο "ρέστα" έχουμε
    const numberOfFullFragments = Math.floor(dataSize / effectivePayloadPerFragment);
    const remainderData = dataSize % effectivePayloadPerFragment;

    // Σύνολο γραμμών (πακέτων)
    // Αν έχουμε υπόλοιπο, θέλουμε +1 πακέτο. Αν διαιρείται τέλεια, όχι.
    const totalFragments = numberOfFullFragments + (remainderData > 0 ? 1 : 0);

    const fragments: Fragment[] = [];

    for (let n = 1; n <= totalFragments; n++) {
        // Είναι το τελευταίο πακέτο;
        const isLast = n === totalFragments;

        // Υπολογισμός Μήκους: 
        // Αν είναι το τελευταίο ΚΑΙ έχουμε υπόλοιπο -> remainderData + Header
        // Αλλιώς (αν είναι ενδιάμεσο ή αν διαιρείται τέλεια και είναι το τελευταίο full) -> effective + Header
        let currentLength;
        if (isLast && remainderData > 0) {
            currentLength = remainderData + IP_HEADER;
        } else {
            currentLength = effectivePayloadPerFragment + IP_HEADER;
        }

        fragments.push({
            n: n,
            length: currentLength,
            id: "X",
            mf: isLast ? 0 : 1, //  Το τελευταίο παίρνει πάντα 0.
            offset: (n - 1) * offsetStep,
        });
    }

    return fragments;
}