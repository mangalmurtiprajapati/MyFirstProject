
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
        <div className="container mx-auto flex flex-col items-center gap-4 p-4 text-center sm:p-6 lg:p-8">
          <VocalForgeLogo className="h-20 w-20 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
            VocalForge
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Craft the perfect voice. Clone an existing one or generate a unique synthetic voice with AI.
          </p>
        </div>
      </header>
      <main className="container mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8 pt-0">
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
