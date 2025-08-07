
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VocalForgeLogo } from "@/components/vocal-forge-logo";
import { GenerateVoiceForm, Voice } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";
import { motion } from "framer-motion";

const maleVoices: Voice[] = [
  { value: "algenib", label: "Deep Male" },
  { value: "gacrux", label: "Standard Male" },
  { value: "zubenelgenubi", label: "Narrator Male" },
  { value: "rasalgethi", label: "Raspy Male" },
  { value: "sadachbia", label: "Smooth Male" },
  { value: "sadaltager", label: "Authoritative Male" },
  { value: "alnilam", label: "Friendly Male" },
  { value: "orus", label: "Energetic Male" },
];

const femaleVoices: Voice[] = [
  { value: "achernar", label: "Standard Female" },
  { value: "schedar", label: "Warm Female" },
  { value: "vindemiatrix", label: "Crisp Female" },
  { value: "achird", label: "Gentle Female" },
  { value: "laomedeia", label: "Elegant Female" },
  { value: "leda", label: "Soft Female" },
  { value: "sulafat", label: "Clear Female" },
  { value: "umbriel", label: "Poetic Female" },
];

const uniqueVoices: Voice[] = [
  { value: "aoede", label: "Mythic Bard" },
  { value: "autonoe", label: "Robotic Assistant" },
  { value: "callirrhoe", label: "Galactic Herald" },
  { value: "charon", label: "Underworld Guide" },
  { value: "despina", label: "Oceanic Spirit" },
  { value: "enceladus", label: "Ice Giant" },
  { value: "erinome", label: "Cosmic Wanderer" },
  { value: "fenrir", label: "Beastly Howl" },
  { value: "iapetus", label: "Ancient Titan" },
  { value: "kore", label: "Whispering Nymph" },
  { value: "puck", label: "Mischievous Sprite" },
  { value: "pulcherrima", label: "Celestial Singer" },
];

const allVoices = [...maleVoices, ...femaleVoices, ...uniqueVoices];

export default function Home() {
  const [voices, setVoices] = useState<Voice[]>(allVoices);
  const [activeTab, setActiveTab] = useState("generate");

  const addClonedVoice = (newVoice: Voice) => {
    setVoices((prevVoices) => [...prevVoices, newVoice]);
    setActiveTab("generate");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background bg-grid-white/[0.05] relative">
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-center gap-4 text-center">
          <VocalForgeLogo className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            VocalForge
          </h1>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/50" />
            </div>
        </div>
      </header>
      <main className="container mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8 pt-6 z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border-2 border-border/60 h-12 rounded-xl">
            <TabsTrigger value="generate" className="text-base rounded-lg">Generate Voice</TabsTrigger>
            <TabsTrigger value="clone" className="text-base rounded-lg">Clone Voice</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="mt-6">
            <GenerateVoiceForm voices={voices} voiceCategories={{male: maleVoices, female: femaleVoices, unique: uniqueVoices}} />
          </TabsContent>
          <TabsContent value="clone" className="mt-6">
            <CloneVoiceForm onVoiceCloned={addClonedVoice} allVoices={allVoices} />
          </TabsContent>
        </Tabs>
        </motion.div>
      </main>
      <footer className="w-full mt-auto py-6 text-center text-sm text-muted-foreground z-10">
        <p>VocalForge | Your Premier AI Voice Solution</p>
      </footer>
    </div>
  );
}
