
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Mic, Sparkles, User as UserIcon } from "lucide-react";
import Link from 'next/link';
import { useAppContext } from '@/components/app-provider';
import type { Voice } from '@/components/generate-voice-form';
import Image from 'next/image';

interface VoiceProfile extends Voice {
    description: string;
    tone: string;
    category: 'male' | 'female' | 'unique' | 'cloned';
    image: string;
    hint: string;
}

const maleVoices: VoiceProfile[] = [
  { value: "algenib", label: "Deep Male", description: "A resonant and authoritative voice, perfect for narration.", tone: "Deep", category: 'male', image: "https://placehold.co/600x400.png", hint: "authoritative man" },
  { value: "gacrux", label: "Standard Male", description: "A clear and neutral male voice for general use.", tone: "Clear", category: 'male', image: "https://placehold.co/600x400.png", hint: "neutral man" },
  { value: "zubenelgenubi", label: "Narrator Male", description: "A professional and engaging voice for storytelling.", tone: "Engaging", category: 'male', image: "https://placehold.co/600x400.png", hint: "storyteller man" },
  { value: "rasalgethi", label: "Raspy Male", description: "A gravelly and textured voice with character.", tone: "Raspy", category: 'male', image: "https://placehold.co/600x400.png", hint: "rugged man" },
  { value: "sadachbia", label: "Smooth Male", description: "A silky and smooth voice, ideal for commercials.", tone: "Smooth", category: 'male', image: "https://placehold.co/600x400.png", hint: "smooth talker" },
  { value: "sadaltager", label: "Authoritative Male", description: "A confident and commanding voice.", tone: "Authoritative", category: 'male', image: "https://placehold.co/600x400.png", hint: "confident man" },
  { value: "alnilam", label: "Friendly Male", description: "A warm and approachable voice.", tone: "Friendly", category: 'male', image: "https://placehold.co/600x400.png", hint: "friendly guy" },
  { value: "orus", label: "Energetic Male", description: "An upbeat and lively voice.", tone: "Energetic", category: 'male', image: "https://placehold.co/600x400.png", hint: "energetic person" },
];

const femaleVoices: VoiceProfile[] = [
  { value: "achernar", label: "Standard Female", description: "A clear and neutral female voice for versatile applications.", tone: "Clear", category: 'female', image: "https://placehold.co/600x400.png", hint: "neutral woman" },
  { value: "schedar", label: "Warm Female", description: "A friendly and inviting voice, great for tutorials.", tone: "Warm", category: 'female', image: "https://placehold.co/600x400.png", hint: "friendly woman" },
  { value: "vindemiatrix", label: "Crisp Female", description: "A sharp and articulate voice for announcements.", tone: "Crisp", category: 'female', image: "https://placehold.co/600x400.png", hint: "professional woman" },
  { value: "achird", label: "Gentle Female", description: "A soft and soothing voice, perfect for meditation content.", tone: "Gentle", category: 'female', image: "https://placehold.co/600x400.png", hint: "gentle woman" },
  { value: "laomedeia", label: "Elegant Female", description: "A sophisticated and graceful voice for high-end branding.", tone: "Elegant", category: 'female', image: "https://placehold.co/600x400.png", hint: "elegant woman" },
  { value: "leda", label: "Soft Female", description: "A gentle and quiet voice.", tone: "Soft", category: 'female', image: "https://placehold.co/600x400.png", hint: "soft spoken" },
  { value: "sulafat", label: "Clear Female", description: "A bright and clear voice.", tone: "Clear", category: 'female', image: "https://placehold.co/600x400.png", hint: "clear speaking" },
  { value: "umbriel", label: "Poetic Female", description: "A lyrical and expressive voice.", tone: "Poetic", category: 'female', image: "https://placehold.co/600x400.png", hint: "expressive artist" },
];

const uniqueVoices: VoiceProfile[] = [
  { value: "aoede", label: "Mythic Bard", description: "A story-telling voice with a touch of ancient magic.", tone: "Mystical", category: 'unique', image: "https://placehold.co/600x400.png", hint: "fantasy bard" },
  { value: "autonoe", label: "Robotic Assistant", description: "A futuristic and clear robotic voice for tech applications.", tone: "Robotic", category: 'unique', image: "https://placehold.co/600x400.png", hint: "futuristic robot" },
  { value: "callirrhoe", label: "Galactic Herald", description: "An epic and booming voice from the cosmos.", tone: "Epic", category: 'unique', image: "https://placehold.co/600x400.png", hint: "cosmic being" },
  { value: "charon", label: "Underworld Guide", description: "A deep, mysterious, and echoing voice.", tone: "Ethereal", category: 'unique', image: "https://placehold.co/600x400.png", hint: "mythological guide" },
  { value: "fenrir", label: "Beastly Howl", description: "A rough, aggressive, and creature-like voice.", tone: "Aggressive", category: 'unique', image: "https://placehold.co/600x400.png", hint: "fierce wolf" },
  { value: "despina", label: "Oceanic Spirit", description: "A flowing and serene voice.", tone: "Serene", category: 'unique', image: "https://placehold.co/600x400.png", hint: "ocean spirit" },
  { value: "enceladus", label: "Ice Giant", description: "A booming and frosty voice.", tone: "Frosty", category: 'unique', image: "https://placehold.co/600x400.png", hint: "ice giant" },
  { value: "erinome", label: "Cosmic Wanderer", description: "A wise and ancient voice.", tone: "Wise", category: 'unique', image: "https://placehold.co/600x400.png", hint: "cosmic wanderer" },
  { value: "iapetus", label: "Ancient Titan", description: "A powerful and old voice.", tone: "Powerful", category: 'unique', image: "https://placehold.co/600x400.png", hint: "ancient titan" },
  { value: "kore", label: "Whispering Nymph", description: "A soft and magical whisper.", tone: "Whisper", category: 'unique', image: "https://placehold.co/600x400.png", hint: "forest nymph" },
  { value: "puck", label: "Mad Scientist (Gold)", description: "An eccentric and brilliant voice.", tone: "Eccentric", category: 'unique', image: "https://placehold.co/600x400.png", hint: "mad scientist" },
  { value: "pulcherrima", label: "Celestial Singer", description: "A beautiful and melodic voice.", tone: "Melodic", category: 'unique', image: "https://placehold.co/600x400.png", hint: "celestial singer" },
];

export default function VoicesPage() {
    const { history } = useAppContext(); 
    const clonedVoices: VoiceProfile[] = history
        .filter(h => !maleVoices.find(v => v.label === h.voice) && !femaleVoices.find(v => v.label === h.voice) && !uniqueVoices.find(v => v.label === h.voice))
        .map(h => ({ 
            value: h.voice, 
            label: h.voice, 
            description: "A user-cloned voice.", 
            tone: "Custom", 
            category: 'cloned', 
            image: "https://placehold.co/600x400.png",
            hint: "custom person" 
        }))
        .filter((v, i, a) => a.findIndex(t => (t.label === v.label)) === i); // Unique cloned voices


    const allVoices = {
        male: maleVoices,
        female: femaleVoices,
        unique: uniqueVoices,
        cloned: clonedVoices,
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Voice Library</h1>
                <p className="text-muted-foreground">
                    Browse, discover, and select the perfect voice for your project.
                </p>
            </div>
            
            <Tabs defaultValue="male" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="male" className="py-2"><UserIcon className="mr-2 h-4 w-4"/>Male</TabsTrigger>
                    <TabsTrigger value="female" className="py-2"><UserIcon className="mr-2 h-4 w-4"/>Female</TabsTrigger>
                    <TabsTrigger value="unique" className="py-2"><Sparkles className="mr-2 h-4 w-4"/>Unique</TabsTrigger>
                    <TabsTrigger value="cloned" className="py-2"><Mic className="mr-2 h-4 w-4"/>Cloned</TabsTrigger>
                </TabsList>
                
                {Object.entries(allVoices).map(([category, voices]) => (
                    <TabsContent key={category} value={category}>
                        {voices.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {voices.map(voice => (
                                    <Card key={voice.value} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
                                        <div className="aspect-video relative overflow-hidden w-full">
                                            <Image src={voice.image} alt={voice.label} fill className="object-cover" data-ai-hint={voice.hint} />
                                        </div>
                                        <CardHeader>
                                            <CardTitle>{voice.label}</CardTitle>
                                            <CardDescription className="line-clamp-2 h-[40px]">{voice.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <Badge variant="outline">{voice.tone}</Badge>
                                        </CardContent>
                                        <CardFooter>
                                            <Button asChild className="w-full">
                                                <Link href={`/workspace?voice=${voice.value}`}>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Select Voice
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                             <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[300px] mt-4">
                                <CardHeader>
                                    <div className="p-4 bg-muted rounded-full mx-auto">
                                        <Mic className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="mt-4">No Cloned Voices</CardTitle>
                                    <CardDescription>
                                        Cloned voices will appear here after you create them in the workspace.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
