
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VocalForgeLogo } from "@/components/vocal-forge-logo";
import { GenerateVoiceForm, Voice } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";

const initialVoices: Voice[] = [
  { value: "algenib", label: "Male Voice 1" },
  { value: "achernar", label: "Female Voice 1" },
  { value: "gacrux", label: "Male Voice 2" },
  { value: "schedar", label: "Female Voice 2" },
  { value: "zubenelgenubi", label: "Male Voice 3" },
  { value: "vindemiatrix", label: "Female Voice 3" },
];

export default function Home() {
  const [voices, setVoices] = useState<Voice[]>(initialVoices);
  const [activeTab, setActiveTab] = useState("generate");

  const addClonedVoice = (newVoice: Voice) => {
    setVoices((prevVoices) => [...prevVoices, newVoice]);
    setActiveTab("generate");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background">
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-center gap-4 text-center">
          <VocalForgeLogo className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            VocalForge
          </h1>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-background px-2 text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <path d="M3 21h18" />
                        <path d="M7 12v2" />
                        <path d="M12 10v4" />
                        <path d="M17 14v-2" />
                        <path d="M3 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3" />
                    </svg>
                </span>
            </div>
        </div>
      </header>
      <main className="container mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Voice</TabsTrigger>
            <TabsTrigger value="clone">Clone Voice</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="mt-6">
            <GenerateVoiceForm voices={voices} />
          </TabsContent>
          <TabsContent value="clone" className="mt-6">
            <CloneVoiceForm onVoiceCloned={addClonedVoice} />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="w-full mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>VocalForge | Your Premier AI Voice Solution</p>
      </footer>
    </div>
  );
}
