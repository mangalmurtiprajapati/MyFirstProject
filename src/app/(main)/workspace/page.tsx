
"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateVoiceForm, Voice } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";
import { motion } from "framer-motion";
import { CreditUsageCard } from "@/components/credit-usage-card";
import { useAppContext, HistoryItem } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, LayoutGrid } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { cn } from "@/lib/utils";
import { Download, Music4, Star } from "lucide-react";

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

function GeneratedResultCard({ item, onToggleFavorite }: { item: HistoryItem, onToggleFavorite: (id: string) => void }) {
    return (
        <div className="mt-4 w-full animate-in fade-in-50">
            <div className="rounded-xl border-2 border-primary/50 bg-gradient-to-br from-background to-secondary/30 p-4 space-y-4 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-full border border-primary/20 flex-shrink-0">
                            <Music4 className="text-primary h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg md:text-xl text-foreground truncate">{item.title}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(item.id)} title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                        <Star className={cn("h-6 w-6 transition-all", item.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-400")} />
                    </Button>
                </div>
                <AudioPlayer audioUrl={item.audioUrl} audioId={item.id} />
                <Button asChild variant="outline" className="w-full h-11 text-base font-semibold">
                    <a href={item.audioUrl} download={`${item.voice.replace(/\\s+/g, '_')}_${item.id}.wav`}>
                        <Download className="mr-2 h-5 w-5" />
                        Download Now
                    </a>
                </Button>
            </div>
        </div>
    )
}

function WorkspaceComponent() {
  const searchParams = useSearchParams();
  const selectedVoice = searchParams.get('voice');
  
  const [voices, setVoices] = useState<Voice[]>(allVoices);
  const [activeTab, setActiveTab] = useState("generate");
  const { history, toggleFavorite } = useAppContext();
  const [generatedItem, setGeneratedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (selectedVoice) {
      setActiveTab("generate");
    }
  }, [selectedVoice]);

  // When history updates (e.g. favorite toggled), find the matching item and update our local state
  useEffect(() => {
    if (generatedItem) {
        const updatedItemInHistory = history.find(h => h.id === generatedItem.id);
        if (updatedItemInHistory) {
            setGeneratedItem(updatedItemInHistory);
        } else {
            // It was deleted from history, so remove it from the workspace view.
            setGeneratedItem(null);
        }
    }
  }, [history, generatedItem]);

  const addClonedVoice = (newVoice: Voice) => {
    // Add to the main list if it's not already there
    if (!voices.some(v => v.value === newVoice.value)) {
        setVoices(prevVoices => [...prevVoices, newVoice]);
    }
    setActiveTab("generate");
  };
  
  const recentHistory = history.slice(0, 3);

  return (
    <div className="space-y-8">
        <div className="w-full max-w-4xl mx-auto">
            <CreditUsageCard />
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
             >
                <Tabs value={activeTab} onValueChange={(value) => {setActiveTab(value); setGeneratedItem(null);}} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 border-2 border-border/60 h-12 rounded-xl">
                    <TabsTrigger value="generate" className="text-base rounded-lg">Generate Voice</TabsTrigger>
                    <TabsTrigger value="clone" className="text-base rounded-lg">Clone Voice</TabsTrigger>
                </TabsList>
                <div className="w-full mt-6">
                    <TabsContent value="generate">
                    <GenerateVoiceForm 
                        voices={voices} 
                        voiceCategories={{male: maleVoices, female: femaleVoices, unique: uniqueVoices}}
                        preselectedVoice={selectedVoice}
                        onGenerationComplete={setGeneratedItem}
                    />
                    </TabsContent>
                    <TabsContent value="clone">
                    <CloneVoiceForm onVoiceCloned={addClonedVoice} allVoices={allVoices} />
                    </TabsContent>
                </div>
                </Tabs>
            </motion.div>
            
            {activeTab === 'generate' && generatedItem && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <GeneratedResultCard item={generatedItem} onToggleFavorite={toggleFavorite} />
                 </motion.div>
            )}

            {recentHistory.length > 0 && (
                <div className="w-full max-w-4xl mt-8 mx-auto">
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
