# 📟 IPv4 Fragmentation Calculator // LEGACY PROTOCOL EDITION

> "Breaking packets into pieces, just like life broke our dreams."

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-OPERATIONAL-green.svg)
![Style](https://img.shields.io/badge/style-STEALTH_MATRIX-050505.svg)

## 💀 Overview

This isn't your average subnet calculator found on 2005-era websites. This is a precision tool designed to simulate **IPv4 Packet Fragmentation** (RFC 791) with a visual style that screams "I'm in the mainframe."

Built to visualize exactly how routers slice data when the MTU is too small for your payload. It handles the **8-byte alignment rule** correctly, preventing the common mistakes students make during exams.

## ⚡ Features

-   **RFC 791 Compliant:** Calculates fragments based on strictly aligned 8-byte blocks (`div 8` rule).
-   **Validation Logic:** Prevents invalid inputs with strict constraints (Header 20 bytes, Max IP 65535).
-   **Stealth UI:** Custom-built "Dark/Matrix" interface with muted greens, scanlines, and terminal aesthetics.
-   **Reactive Animations:** Powered by `framer-motion` for a breathing, living system feel.
-   **Step-by-Step Decryption:** Includes a hidden **Educational Explainer** that breaks down the solution in Greek, exactly as required in university exams (handwritten note style).

## 🧠 The Logic

The core fragmentation logic was ported from low-level C to TypeScript, preserving the "old school" memory management mindset in a modern web environment.

**Key Formula (The "Div 8" Rule):**
```typescript
const dataSize = packetSize - 20;
const maxPayload = mtu - 20;
const offsetStep = Math.floor(maxPayload / 8); // Integer Division
const effectivePayload = offsetStep * 8;       // Re-align to 8 bytes

Tech Stack
Framework: Next.js 14 (App Router)

Language: TypeScript (Strict Mode)

Styling: Tailwind CSS (Custom Stealth Theme)

Animations: Framer Motion

Icons: Lucide React

🚀 Getting Started
Clone the repo:

Bash

git clone https://github.com/Retsos/Fragmentation-Solver.git
cd my-app

Install dependencies:

Bash

npm install
# or
yarn install

Run the dev server:

Bash

npm run dev
Run the dev server:

Bash

npm run dev

Open the portal: Navigate to http://localhost:3000.

👥 Ops / Credits
This tool is a collaboration between low-level logic and high-level visuals.

[Retsos]: Logic Core & C Implementation. The one who talks to the metal.

[MasterTsif]: Frontend Architecture, UI/UX & Visuals. The one who makes the Matrix look good.

📄 License
Distributed under the MIT License. Use it to pass your networks exam, debug your router, or impress your friends who think HTML is programming.

<p align="center"> <span style="color: #15803d; font-family: monospace;">SYSTEM READY // END OF LINE_</span> </p>
