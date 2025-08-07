
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloneVoiceOutput, cloneVoice } from "@/ai/flows/clone-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Clipboard, Check, Sparkles } from "lucide-react";
import type { Voice } from "./generate-voice-form";

const formSchema = z.object({
  voiceName: z.string().min(1, "Please enter a name for your voice."),
  audioFile: (typeof window !== 'undefined' ? z.instanceof(File) : z.any())
    .refine((file) => file && file.size > 0, "Please upload an audio file.")
    .refine(
      (file) => file && /\.(mp3|wav|m4a)$/i.test(file.name),
      "Only .mp3, .wav, and .m4a files are accepted."
    ),
});

interface CloneVoiceFormProps {
    onVoiceCloned: (voice: Voice) => void;
}

export function CloneVoiceForm({ onVoiceCloned }: CloneVoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [clonedResult, setClonedResult] = useState<CloneVoiceOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceName: "",
      audioFile: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setClonedResult(null);
    setIsCopied(false);

    const reader = new FileReader();
    reader.readAsDataURL(values.audioFile);
    reader.onload = async () => {
      const audioSampleDataUri = reader.result as string;
      try {
        const result = await cloneVoice({ audioSampleDataUri, voiceName: values.voiceName });
        setClonedResult(result);
        onVoiceCloned({ value: result.clonedVoiceModel, label: result.voiceName });
        toast({
          title: "Voice Cloned Successfully!",
          description: `Your new voice "${result.voiceName}" is ready and has been added to the 'Generate Voice' tab.`,
        });
        form.reset();
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem cloning your voice. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error(error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "File Reading Error",
        description: "There was an error reading your audio file.",
      });
    };
  };

  const handleCopy = () => {
    if (!clonedResult) return;
    navigator.clipboard.writeText(clonedResult.clonedVoiceModel);
    setIsCopied(true);
    toast({ title: "Model ID copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader>
        <CardTitle>Clone a Voice</CardTitle>
        <CardDescription>Upload a 1-2 minute audio sample (.mp3, .wav, or .m4a) to clone a voice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="voiceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morgan's Voice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audioFile"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Audio Sample</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".mp3,.wav,.m4a"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="file:text-primary-foreground"
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Cloning...
                </>
              ) : (
                <>
                  <Upload />
                  Clone Voice
                </>
              )}
            </Button>
            {clonedResult && (
              <div className="mt-4 rounded-lg border-2 border-primary/50 bg-gradient-to-br from-background to-secondary/30 p-4 animate-in fade-in-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                     <Sparkles className="text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">Your Cloned Voice is Ready!</h3>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="font-semibold text-lg">{clonedResult.voiceName}</p>
                    <p className="text-muted-foreground text-sm">
                      Use this model ID with text-to-speech APIs for your projects.
                    </p>
                </div>
                
                <div className="relative rounded-md bg-background/50 border p-3 pr-12 font-mono text-sm">
                  <p className="break-words">{clonedResult.clonedVoiceModel}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                    onClick={handleCopy}
                    aria-label="Copy model ID"
                  >
                    {isCopied ? <Check className="text-green-500" /> : <Clipboard />}
                  </Button>
                </div>
                
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
