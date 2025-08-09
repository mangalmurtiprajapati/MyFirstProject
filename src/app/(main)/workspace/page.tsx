
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateVoiceForm, Voice } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";
import { motion } from "framer-motion";
import { CreditUsageCard } from "@/components/credit-usage-card";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History } from "lucide-react";

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

export default function WorkspacePage() {
  const [voices, setVoices] = useState<Voice[]>(allVoices);
  const [activeTab, setActiveTab] = useState("generate");
  const { history } = useAppContext();

  const addClonedVoice = (newVoice: Voice) => {
    setVoices((prevVoices) => [...prevVoices, newVoice]);
    setActiveTab("generate");
  };
  
  const recentHistory = history.slice(0, 5);

  return (
    <div className="flex w-full flex-col items-center gap-8">
        <CreditUsageCard />
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
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
        
        {recentHistory.length > 0 && (
            <div className="w-full max-w-4xl mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent History</h2>
                    <Button variant="link" asChild>
                        <Link href="/history">
                            View All <History className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-4">
                    {recentHistory.map((item) => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
