"use client";

import { useState } from 'react';
import { generateSyntheticVoice } from "@/ai/flows/generate-synthetic-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Download, Play } from "lucide-react";

export function GenerateVoiceForm() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState("");
  
  const { toast } = useToast();

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
      const result = await generateSyntheticVoice({ dialogue });
      setAudioUrl(result.audioDataUri);
      toast({
        title: "Voice Generated!",
        description: "Listen to your new synthetic voice below.",
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
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader>
        <CardTitle>Generate a Synthetic Voice</CardTitle>
        <CardDescription>Enter some dialogue in Hindi to convert it into speech.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dialogue">Dialogue</Label>
          <Textarea
            id="dialogue"
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            placeholder="Enter your dialogue in Hindi here..."
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleGenerate} disabled={loading || !dialogue}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bot />
              Generate Voice
            </>
          )}
        </Button>
        {audioUrl && (
          <div className="mt-4 flex flex-col gap-4 animate-in fade-in-50">
             <div className="rounded-lg border bg-background p-4 space-y-4">
                <h3 className="font-semibold text-lg">Your Generated Voice</h3>
                <audio controls src={audioUrl} className="w-full">
                    Your browser does not support the audio element.
                </audio>
                <Button asChild variant="outline">
                    <a href={audioUrl} download="vocalforge_voice.wav">
                        <Download />
                        Download .wav
                    </a>
                </Button>
             </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
