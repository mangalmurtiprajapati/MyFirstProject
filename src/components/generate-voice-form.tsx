
"use client";

import { useState, useEffect } from 'react';
import { generateSyntheticVoice } from "@/ai/flows/generate-synthetic-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Download, Mic, User, SparklesIcon, Music4 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext, HistoryItem } from './app-provider';

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
    }
}

export function GenerateVoiceForm({ voices, voiceCategories }: GenerateVoiceFormProps) {
  const { setHistory } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState("");
  const [voice, setVoice] = useState(voices.length > 0 ? voiceCategories.male[0].value : "");
  
  const { toast } = useToast();

  useEffect(() => {
    // If a new voice is added (cloned), select it automatically.
    const allVoiceValues = voices.map(v => v.value);
    if (voices.length > 0 && !allVoiceValues.includes(voice)) {
      setVoice(voices[voices.length-1].value);
    }
  }, [voices, voice]);

  const handleGenerate = async () => {
    if (!dialogue) {
      toast({
        variant: "destructive",
        title: "Please enter some dialogue.",
      });
      return;
    }
    setLoading(true);
    setAudioUrl(null);
    try {
      const result = await generateSyntheticVoice({ dialogue, voice });
      setAudioUrl(result.audioDataUri);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        dialogue,
        voice: voices.find(v => v.value === voice)?.label || voice,
        audioUrl: result.audioDataUri,
        timestamp: new Date(),
        isFavorite: false,
      };

      setHistory(prev => [newHistoryItem, ...prev]);

      toast({
        title: "Voice Generated!",
        description: "Listen to your new synthetic voice below. It's been saved to your history.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the voice. Please try again.",
      });
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
        <Button onClick={handleGenerate} disabled={loading || !dialogue || !voice} size="lg" className="h-14 text-lg font-bold">
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
        {audioUrl && (
          <div className="mt-4 animate-in fade-in-50">
             <div className="rounded-xl border-2 border-primary/50 bg-gradient-to-br from-background to-secondary/30 p-4 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                     <Music4 className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">Voice Generated</h3>
                </div>
                <audio controls src={audioUrl} className="w-full rounded-lg">
                    Your browser does not support the audio element.
                </audio>
                <Button asChild variant="outline" className="w-full h-11 text-base font-semibold">
                    <a href={audioUrl} download="vocalforge_voice.wav">
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
