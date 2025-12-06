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
import { Explainer } from "./components/explainer";

export default function IPFragCalculatorMatrix() {
  const [ipPacketSize, setIpPacketSize] = useState<number | "">("");
  const [mtu, setMtu] = useState<number | "">("");

  const fragments = useMemo(() => {
    if (ipPacketSize === "" || mtu === "") return null;
    return calculateFragments(Number(ipPacketSize), Number(mtu));
  }, [ipPacketSize, mtu]);

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
    // Χρησιμοποιούμε πιο "θαμπό" πράσινο (green-600/700) αντί για neon (400/500)
    <div className="min-h-screen w-full bg-[#050505] text-green-700 flex items-center justify-center p-4 md:p-8 font-mono selection:bg-green-900/30 selection:text-green-400">

      <Card className="w-full max-w-4xl border border-green-900/30 shadow-2xl bg-black relative overflow-hidden">

        {/* Scanlines: Πολύ πιο διακριτικά (opacity-5) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 50%, rgba(20, 83, 45, 0.3) 51%)",
            backgroundSize: "100% 4px"
          }}
        />

        <CardHeader className="border-b border-green-900/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              {/* Τίτλος: Πιο σκούρος */}
              <CardTitle className="text-2xl tracking-tight flex items-center gap-2 text-green-600">
                <Terminal className="w-6 h-6 opacity-80" />
                IPv4 Fragmentation Calculator
              </CardTitle>
              <CardDescription className="mt-1 italic text-green-900">
                Analyzing packets byte by byte.
              </CardDescription>
            </div>
            <Calculator className="w-8 h-8 text-green-900/40" />
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8 overflow-x">
          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="packet-size" className="text-xs font-bold uppercase text-green-800 tracking-wider flex justify-between">
                <span>Total Packet Size</span>
                <span className="opacity-50 normal-case font-normal">bytes</span>
              </Label>
              <Input
                id="packet-size"
                type="number"
                placeholder={`Range: ${IP_HEADER} - 65535`}
                // Inputs: Dark background, dim text
                className={`font-mono bg-[#0a0a0a] placeholder:text-green-900/30 text-green-500 border-green-900/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-300
                  ${ipPacketSize !== "" && (Number(ipPacketSize) < IP_HEADER || Number(ipPacketSize) > 65535)
                    ? "border-red-900/50 focus-visible:ring-red-900/50 text-red-700"
                    : "focus-visible:ring-green-900/50 focus-visible:border-green-800"
                  }`}
                value={ipPacketSize}
                onChange={(e) => setIpPacketSize(e.target.value === "" ? "" : Number(e.target.value))}
              />
              {ipPacketSize !== "" && (Number(ipPacketSize) < IP_HEADER || Number(ipPacketSize) > 65535) && (
                <p className="text-xs text-red-800 mt-1 font-bold">Error: Invalid range.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mtu" className="text-xs font-bold uppercase text-green-800 tracking-wider flex justify-between">
                <span>MTU Size</span>
                <span className="opacity-50 normal-case font-normal">bytes</span>
              </Label>
              <Input
                id="mtu"
                type="number"
                placeholder={`Range: ${IP_HEADER + 8} - 1500`}
                className={`font-mono bg-[#0a0a0a] placeholder:text-green-900/30 text-green-500 border-green-900/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-300
                  ${mtu !== "" && (Number(mtu) < IP_HEADER + 8 || Number(mtu) > 1500)
                    ? "border-red-900/50 focus-visible:ring-red-900/50 text-red-700"
                    : "focus-visible:ring-green-900/50 focus-visible:border-green-800"
                  }`}
                value={mtu}
                onChange={(e) => setMtu(e.target.value === "" ? "" : Number(e.target.value))}
              />
              {mtu !== "" && (Number(mtu) < IP_HEADER + 8 || Number(mtu) > 1500) && (
                <p className="text-xs text-red-800 mt-1 font-bold">Error: MTU too small or too large.</p>
              )}
            </div>
          </div>

          {/* OUTPUT SECTION */}
          <div className="rounded border border-green-900/20 overflow-hidden bg-[#080808] relative min-h-[200px] flex flex-col justify-center p-4">
            {hasErrors ? (
              <Alert variant="destructive" className="m-4 border-red-900/30 bg-red-950/10 text-red-800">
                <AlertTitle>Input Error</AlertTitle>
                <AlertDescription>Correct fields.</AlertDescription>
              </Alert>
            ) : fragments ? (
              <div className="w-full flex flex-col gap-4">
                <ResultsTable fragments={fragments} />
                <Explainer packetSize={Number(ipPacketSize)} mtu={Number(mtu)}/>
              </div>
            ) : (
              <StatusDisplay />
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-green-900/20 flex justify-between items-center py-4 bg-green-950/5">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs text-green-900">
              <span className="opacity-80">PROTOCOL:</span> IPv4 (RFC 791)
            </div>
            <div className="text-[10px] text-green-900 flex items-center gap-1.5 uppercase tracking-wider font-bold opacity-80">
              <Code className="w-3 h-3" />
              <span>Ops:</span>
              <span className="hover:text-green-700 cursor-crosshair transition-colors">MasterTsif</span>
              <span className="opacity-100">|</span>
              <span className="hover:text-green-700 cursor-crosshair transition-colors">RETSOS</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2 border-green-900/20 cursor-pointer bg-transparent text-green-800 hover:bg-green-900/10 hover:text-green-600 hover:border-green-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}