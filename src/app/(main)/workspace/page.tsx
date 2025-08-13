
"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateVoiceForm, Voice } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";
import { motion } from "framer-motion";
import { CreditUsageCard } from "@/components/credit-usage-card";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, LayoutGrid } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
  { value: "puck", label: "Mad Scientist (Gold)" },
  { value: "pulcherrima", label: "Celestial Singer" },
];

const allVoices = [...maleVoices, ...femaleVoices, ...uniqueVoices];

function WorkspaceComponent() {
  const searchParams = useSearchParams();
  const selectedVoice = searchParams.get('voice');
  
  const [voices, setVoices] = useState<Voice[]>(allVoices);
  const [activeTab, setActiveTab] = useState("generate");
  const { history } = useAppContext();

  useEffect(() => {
    if (selectedVoice) {
      setActiveTab("generate");
    }
  }, [selectedVoice]);

  const addClonedVoice = (newVoice: Voice) => {
    setVoices((prevVoices) => [...prevVoices, newVoice]);
    setActiveTab("generate");
  };
  
  const recentHistory = history.slice(0, 3);

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
            <GenerateVoiceForm 
              voices={voices} 
              voiceCategories={{male: maleVoices, female: femaleVoices, unique: uniqueVoices}}
              preselectedVoice={selectedVoice}
            />
          </TabsContent>
          <TabsContent value="clone" className="mt-6">
            <CloneVoiceForm onVoiceCloned={addClonedVoice} allVoices={allVoices} />
          </TabsContent>
        </Tabs>
        </motion.div>
        
        {recentHistory.length > 0 && (
            <div className="w-full max-w-4xl mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><History className="h-6 w-6"/>Recent History</h2>
                    <Button variant="link" asChild>
                        <Link href="/history">
                            View All <LayoutGrid className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentHistory.map((item) => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkspaceComponent />
    </Suspense>
  );
}
