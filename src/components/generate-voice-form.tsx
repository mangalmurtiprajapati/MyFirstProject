
"use client";

import { useState, useEffect } from 'react';
import { generateSyntheticVoice } from "@/ai/flows/generate-synthetic-voice";
import { generateTitle } from '@/ai/flows/generate-title';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, LogIn, Mic, User, SparklesIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext, HistoryItem } from './app-provider';
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
    onGenerationComplete: (item: HistoryItem) => void;
}

export function GenerateVoiceForm({ voices, voiceCategories, preselectedVoice, onGenerationComplete }: GenerateVoiceFormProps) {
  const { addHistoryItem, creditState, isAuthenticated } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [dialogue, setDialogue] = useState("");
  const [voice, setVoice] = useState(preselectedVoice || (voices.length > 0 ? voiceCategories.male[0].value : ""));
  
  const { toast } = useToast();

  useEffect(() => {
    if (preselectedVoice) {
      setVoice(preselectedVoice);
    }
  }, [preselectedVoice]);

  useEffect(() => {
    const allVoiceValues = voices.map(v => v.value);
    if (voices.length > 0 && !allVoiceValues.includes(voice)) {
        const clonedVoices = voices.filter(v => !voiceCategories.male.some(male => male.value === v.value) && !voiceCategories.female.some(female => female.value === v.value) && !voiceCategories.unique.some(unique => unique.value === v.value));
        if (clonedVoices.length > 0) {
            setVoice(clonedVoices[clonedVoices.length - 1].value);
        } else if (voiceCategories.male.length > 0) {
            setVoice(voiceCategories.male[0].value);
        }
    }
  }, [voices, voice, voiceCategories]);

  const getAudioDuration = (url: string): Promise<number> => {
      return new Promise((resolve) => {
          const audio = new Audio(url);
          audio.onloadedmetadata = () => {
              resolve(Math.round(audio.duration));
          };
          audio.onerror = () => {
              resolve(0); // If there's an error, return 0
          }
          audio.src = url;
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
    
    try {
      const { title } = await generateTitle({ dialogue });
      const result = await generateSyntheticVoice({ dialogue, voice });
      const duration = await getAudioDuration(result.audioDataUri);

      const newItemData = {
        title,
        dialogue,
        voice: voices.find(v => v.value === voice)?.label || voice,
        audioUrl: result.audioDataUri,
        duration: duration,
      };
      
      const newHistoryItem = addHistoryItem(newItemData);
      onGenerationComplete(newHistoryItem);

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
                {voices.filter(v => !voiceCategories.male.some(male => male.value === v.value) && !voiceCategories.female.some(female => female.value === v.value) && !voiceCategories.unique.some(unique => unique.value === v.value)).map((v) => (
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
    </CardFooter>
    </Card>
  );
}
