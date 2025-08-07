"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloneVoice } from "@/ai/flows/clone-voice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Clipboard, Check } from "lucide-react";

const formSchema = z.object({
  audioFile: (typeof window !== 'undefined' ? z.instanceof(File) : z.any())
    .refine((file) => file && file.size > 0, "Please upload an audio file.")
    .refine(
      (file) => file && ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"].includes(file.type),
      "Only .mp3 and .wav files are accepted."
    ),
});

export function CloneVoiceForm() {
  const [loading, setLoading] = useState(false);
  const [clonedModel, setClonedModel] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioFile: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setClonedModel(null);
    setIsCopied(false);

    const reader = new FileReader();
    reader.readAsDataURL(values.audioFile);
    reader.onload = async () => {
      const audioSampleDataUri = reader.result as string;
      try {
        const result = await cloneVoice({ audioSampleDataUri });
        setClonedModel(result.clonedVoiceModel);
        toast({
          title: "Voice Cloned Successfully!",
          description: "Your new voice model is ready to be used.",
        });
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
    if (!clonedModel) return;
    navigator.clipboard.writeText(clonedModel);
    setIsCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader>
        <CardTitle>Clone a Voice</CardTitle>
        <CardDescription>Upload a 1-2 minute audio sample (.mp3 or .wav) to clone a voice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="audioFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio Sample</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".mp3,.wav"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="file:text-primary-foreground"
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
            {clonedModel && (
              <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <h3 className="font-semibold text-lg mb-2">Your Cloned Voice Model</h3>
                <div className="relative rounded-md bg-background p-3 pr-12 font-mono text-sm">
                  <p className="break-words">{clonedModel}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check className="text-green-500" /> : <Clipboard />}
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mt-2">
                  Use this model with text-to-speech APIs for future projects.
                </p>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
