
"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "./app-provider";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
    audioUrl: string;
    audioId: string;
}

export function AudioPlayer({ audioUrl, audioId }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { currentlyPlayingId, setCurrentlyPlayingId } = useAppContext();

    const isPlaying = currentlyPlayingId === audioId;

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => setCurrentlyPlayingId(null);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [setCurrentlyPlayingId]);

    const handlePlayPause = () => {
        if (isPlaying) {
            setCurrentlyPlayingId(null); // Pause
        } else {
            setCurrentlyPlayingId(audioId); // Play
        }
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <Button onClick={handlePlayPause} size="icon" variant="outline" className="flex-shrink-0">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            {/* The hidden audio element handles the actual playback */}
            <audio ref={audioRef} src={audioUrl} className="hidden" />
            <div className="w-full text-sm text-muted-foreground">
                Click to play/pause
            </div>
        </div>
    );
}
