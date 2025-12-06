"use client";

import { useState, useMemo } from "react";
import { Terminal, Calculator, Trash2, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { calculateFragments, IP_HEADER } from "./components/frag-calc";
import { ResultsTable } from "./components/results";
import { StatusDisplay } from "./components/status-display";

export default function IPFragCalculatorMatrix() {
  // State
  const [ipPacketSize, setIpPacketSize] = useState<number | "">("");
  const [mtu, setMtu] = useState<number | "">("");

  // Logic
  const fragments = useMemo(() => {
    if (ipPacketSize === "" || mtu === "") return null;
    return calculateFragments(Number(ipPacketSize), Number(mtu));
  }, [ipPacketSize, mtu]);

  // Error Checking
  const hasErrors = useMemo(() => {
    if (ipPacketSize !== "" && (Number(ipPacketSize) < IP_HEADER || Number(ipPacketSize) > 65535)) return true;
    if (mtu !== "" && (Number(mtu) < IP_HEADER + 8 || Number(mtu) > 1500)) return true;
    return false;
  }, [ipPacketSize, mtu]);

  const handleReset = () => {
    setIpPacketSize("");
    setMtu("");
  };

  return (
    // HARDCODED COLORS: Μαύρο φόντο, Πράσινα γράμματα. Αγνοούμε το theme.
    <div className="min-h-screen w-full bg-black text-green-500 flex items-center justify-center p-4 md:p-8 font-mono selection:bg-green-900 selection:text-white">

      <Card className="w-full max-w-4xl border border-green-900/50 shadow-[0_0_40px_rgba(34,197,94,0.1)] bg-black/90 backdrop-blur-sm relative overflow-hidden">

        {/* Scanline Effect - Καρφωτό CSS μέσα στο style για να μην ψάχνεσαι */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.1) 51%)",
            backgroundSize: "100% 4px"
          }}
        />

        <CardHeader className="border-b border-green-900/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl tracking-tight flex items-center gap-2 text-green-500 shadow-green-500/20 drop-shadow-md">
                <Terminal className="w-6 h-6" />
                IPv4 Fragmentation Calculator
              </CardTitle>
              <CardDescription className="mt-1 italic text-green-800">
                {'"Σπάσε τα πακέτα σε κομμάτια, όπως η ζωή έσπασε τα όνειρά μας."'}
              </CardDescription>
            </div>
            <Calculator className="w-8 h-8 text-green-900" />
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {/* INPUTS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="packet-size" className="text-xs font-bold uppercase text-green-700 tracking-wider flex justify-between">
                <span>Total Packet Size (bytes)</span>
              </Label>
              <Input
                id="packet-size"
                type="number"
                placeholder={`Range: ${IP_HEADER} - 65535`}
                className={`font-mono bg-[#050505] placeholder:text-green-900/50 text-green-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-300
                  ${ipPacketSize !== "" && (Number(ipPacketSize) < IP_HEADER || Number(ipPacketSize) > 65535)
                    ? "border-red-600 focus-visible:ring-red-600 focus-visible:border-red-600" // Error: Red
                    : "border-green-900 focus-visible:ring-green-500 focus-visible:border-green-500" // Normal: Green
                  }`}
                value={ipPacketSize}
                onChange={(e) => setIpPacketSize(e.target.value === "" ? "" : Number(e.target.value))}
              />
              {ipPacketSize !== "" && (Number(ipPacketSize) < IP_HEADER || Number(ipPacketSize) > 65535) && (
                <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">Error: Invalid range.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mtu" className="text-xs font-bold uppercase text-green-700 tracking-wider flex justify-between">
                <span>MTU Size (bytes)</span>
              </Label>
              <Input
                id="mtu"
                type="number"
                placeholder={`Range: ${IP_HEADER + 8} - 1500`}
                // Καρφωτά χρώματα και εδώ
                className={`font-mono bg-[#050505] placeholder:text-green-900/50 text-green-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-300
                  ${mtu !== "" && (Number(mtu) < IP_HEADER + 8 || Number(mtu) > 1500)
                    ? "border-red-600 focus-visible:ring-red-600 focus-visible:border-red-600"
                    : "border-green-900 focus-visible:ring-green-500 focus-visible:border-green-500"
                  }`}
                value={mtu}
                onChange={(e) => setMtu(e.target.value === "" ? "" : Number(e.target.value))}
              />
              {mtu !== "" && (Number(mtu) < IP_HEADER + 8 || Number(mtu) > 1500) && (
                <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">Error: MTU too small or too large.</p>
              )}
            </div>
          </div>

          {/* OUTPUT SECTION */}
          <div className="rounded-md border border-green-900/30 overflow-hidden bg-black/40 relative min-h-[200px] flex flex-col justify-center">
            {hasErrors ? (
              <Alert variant="destructive" className="m-4 border-red-900 bg-red-950/20 text-red-500">
                <AlertTitle>Input Error</AlertTitle>
                <AlertDescription>
                  Correct the highlighted fields to proceed with fragmentation analysis.
                </AlertDescription>
              </Alert>
            ) : fragments ? (
              <ResultsTable fragments={fragments} />
            ) : (
              <StatusDisplay />
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-green-900/30 flex justify-between items-center py-4 bg-green-950/5">
          {/* Left Side: Info Stack */}
          <div className="flex flex-col gap-1.5">

            {/* Protocol Info */}
            <div className="text-xs text-green-800">
              <span className="text-green-600/50">PROTOCOL:</span> IPv4 (RFC 791)
            </div>

            {/* Credits Section*/}
            <div className="text-[10px] text-green-900 flex items-center gap-1.5 uppercase tracking-wider font-bold">
              <Code className="w-3 h-3 opacity-70" />
              <span>Ops:</span>

              <h3
                className="text-green-700 hover:text-green-400 hover:underline decoration-green-400/30 underline-offset-2 transition-all cursor-crosshair"
              >
                MasterTsif
              </h3>

              <span className="opacity-30">|</span>

              <h3
                className="text-green-700 hover:text-green-400 hover:underline decoration-green-400/30 underline-offset-2 transition-all cursor-crosshair"
              >
                RETSOS
              </h3>
            </div>
          </div>

          {/* Right Side: Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2 border-green-900/40 bg-transparent text-green-700 hover:bg-green-900/20 hover:text-green-400 hover:border-green-500 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Reset Fields
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}