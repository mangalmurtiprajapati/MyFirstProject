"use client";

import { useState, useEffect } from 'react';
import { generateSyntheticVoice } from "@/ai/flows/generate-synthetic-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Download, Play } from "lucide-react";

export function GenerateVoiceForm() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const [tone, setTone] = useState("Professional");
  const [pitch, setPitch] = useState([50]);
  const [speed, setSpeed] = useState([50]);
  
  const { toast } = useToast();

  useEffect(() => {
    const pitchValue = pitch[0];
    let pitchText = "medium";
    if (pitchValue < 20) pitchText = "very low";
    else if (pitchValue < 40) pitchText = "low";
    else if (pitchValue > 80) pitchText = "very high";
    else if (pitchValue > 60) pitchText = "high";

    const speedValue = speed[0];
    let speedText = "normal";
    if (speedValue < 20) speedText = "very slow";
    else if (speedValue < 40) speedText = "slow";
    else if (speedValue > 80) speedText = "very fast";
    else if (speedValue > 60) speedText = "fast";
    
    const newDescription = `A ${tone.toLowerCase()} voice with a ${pitchText} pitch and a ${speedText} speaking speed. It should sound bold, energetic, and impactful, suitable for podcasts, YouTube videos, and ad narrations.`;
    setDescription(newDescription);
  }, [tone, pitch, speed]);

  const handleGenerate = async () => {
    setLoading(true);
    setAudioUrl(null);
    try {
      const result = await generateSyntheticVoice({ description });
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
        <CardDescription>Fine-tune the voice's characteristics to create a unique sound for your projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Energetic">Energetic</SelectItem>
                  <SelectItem value="Deep">Deep</SelectItem>
                  <SelectItem value="Calm">Calm</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="pitch">Pitch</Label>
            <Slider id="pitch" value={pitch} onValueChange={setPitch} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="speed">Speaking Speed</Label>
            <Slider id="speed" value={speed} onValueChange={setSpeed} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
            </div>
        </div>
        <div className="p-3 bg-secondary/50 rounded-md border border-border/50">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Voice Description:</span> {description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleGenerate} disabled={loading}>
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
             <p className="text-xs text-center text-muted-foreground">The AI generated a sample of the voice speaking the description you crafted.</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
