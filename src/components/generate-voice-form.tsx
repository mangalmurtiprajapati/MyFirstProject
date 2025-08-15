
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSyntheticVoice } from "@/ai/flows/generate-synthetic-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Download, Mic, User, SparklesIcon, Music4, Star, LogIn } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext, HistoryItem } from './app-provider';
import { cn } from '@/lib/utils';
import { AudioPlayer } from './audio-player';
import Link from 'next/link';

export interface Voice {
    value: string;
    label: string;
}

interface GenerateVoiceFormProps {
    voices: Voice[];
    voiceCategories: {
        male: Voice[];
        female: Voice[];
        unique: Voice[];
    };
    preselectedVoice?: string | null;
}

export function GenerateVoiceForm({ voices, voiceCategories, preselectedVoice }: GenerateVoiceFormProps) {
  const { history, addHistoryItem, toggleFavorite, creditState, isAuthenticated, profile } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<HistoryItem | null>(null);
  const [dialogue, setDialogue] = useState("");
  const [voice, setVoice] = useState(preselectedVoice || (voices.length > 0 ? voiceCategories.male[0].value : ""));
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (preselectedVoice) {
      setVoice(preselectedVoice);
    }
  }, [preselectedVoice]);

  useEffect(() => {
    const allVoiceValues = voices.map(v => v.value);
    if (voices.length > 0 && !allVoiceValues.includes(voice)) {
      setVoice(voices[voices.length - 1].value);
    }
  }, [voices, voice]);

  useEffect(() => {
    if (generatedItem) {
        const updatedItem = history.find(h => h.id === generatedItem.id);
        if (updatedItem) {
            setGeneratedItem(updatedItem);
        } else {
            setGeneratedItem(null);
        }
    }
  }, [history, generatedItem]);

  const getAudioDuration = (url: string): Promise<number> => {
      return new Promise((resolve) => {
          const audio = new Audio(url);
          audio.onloadedmetadata = () => {
              resolve(Math.round(audio.duration));
          };
          audio.onerror = () => {
              resolve(0); // If there's an error, return 0
          }
      });
  }
  
  const handleGenerate = async () => {
    if (!dialogue) {
      toast({
        variant: "destructive",
        title: "Please enter some dialogue.",
      });
      return;
    }
    setLoading(true);
    setGeneratedItem(null);
    
    try {
      const result = await generateSyntheticVoice({ dialogue, voice });
      const duration = await getAudioDuration(result.audioDataUri);

      const newItemData = {
        dialogue,
        voice: voices.find(v => v.value === voice)?.label || voice,
        audioUrl: result.audioDataUri,
        duration: duration,
      };
      
      addHistoryItem(newItemData);

      toast({
        title: "Voice Generated!",
        description: "Listen to your new synthetic voice below. It's been saved to your history.",
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      if (errorMessage.includes("429 Too Many Requests")) {
        toast({
            variant: "destructive",
            title: "Daily Limit Reached",
            description: "You've exceeded the free daily quota for voice generation. Please try again tomorrow.",
            duration: 9000,
        });
      } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem generating the voice. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && history.length > 0) {
      const latestItem = history[0];
      if (latestItem.dialogue === dialogue) {
        setGeneratedItem(latestItem);
      }
    }
  }, [history, loading, dialogue]);
  
  return (
    <Card className="w-full shadow-xl border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Generate a Synthetic Voice</CardTitle>
        <CardDescription>Select a voice and enter some dialogue to convert it into speech.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="voice" className="text-lg">Voice</Label>
            <Select onValueChange={setVoice} value={voice}>
              <SelectTrigger id="voice" className="h-12 text-base">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2"><User className="h-4 w-4" />Male Voices</SelectLabel>
                  {voiceCategories.male.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2"><User className="h-4 w-4" />Female Voices</SelectLabel>
                  {voiceCategories.female.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                 <SelectGroup>
                  <SelectLabel className="flex items-center gap-2"><SparklesIcon className="h-4 w-4" />Unique Voices</SelectLabel>
                  {voiceCategories.unique.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2"><Mic className="h-4 w-4" />Cloned Voices</SelectLabel>
                  {voices.filter(v => !voiceCategories.male.includes(v) && !voiceCategories.female.includes(v) && !voiceCategories.unique.includes(v)).map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        <div className="space-y-2">
          <Label htmlFor="dialogue" className="text-lg">Dialogue</Label>
          <Textarea
            id="dialogue"
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            placeholder="Enter your dialogue here..."
            className="min-h-[120px] text-base"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4 p-6">
        {!isAuthenticated ? (
            <Card className="text-center p-6 bg-muted/50">
                <CardHeader>
                    <CardTitle>Login to Generate</CardTitle>
                    <CardDescription>You need to be logged in to generate voices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/auth/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login to Continue
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <Button onClick={handleGenerate} disabled={loading || !dialogue || !voice || creditState.limitReached} size="lg" className="h-14 text-lg font-bold">
            {loading ? (
                <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
                </>
            ) : (
                <>
                <Bot className="mr-2 h-5 w-5" />
                Generate Voice
                </>
            )}
            </Button>
        )}
        {generatedItem && (
          <div className="mt-4 animate-in fade-in-50">
             <div className="rounded-xl border-2 border-primary/50 bg-gradient-to-br from-background to-secondary/30 p-4 space-y-4 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-full border border-primary/20 flex-shrink-0">
                            <Music4 className="text-primary h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg md:text-xl text-foreground truncate">Voice Generated</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(generatedItem.id)} title={generatedItem.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                        <Star className={cn("h-6 w-6 transition-all", generatedItem.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-400")} />
                    </Button>
                </div>
                <AudioPlayer audioUrl={generatedItem.audioUrl} audioId={generatedItem.id} />
                <Button asChild variant="outline" className="w-full h-11 text-base font-semibold">
                    <a href={generatedItem.audioUrl} download="vocalforge_voice.wav">
                        <Download className="mr-2 h-5 w-5" />
                        Download Now
                    </a>
                </Button>
             </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
