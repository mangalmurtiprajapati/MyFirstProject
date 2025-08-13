
"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "./app-provider";

interface AudioPlayerProps {
    audioUrl: string;
    audioId: string;
}

export function AudioPlayer({ audioUrl, audioId }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { currentlyPlayingId, setCurrentlyPlayingId } = useAppContext();

    const isPlaying = currentlyPlayingId === audioId;

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [isPlaying]);

    const handlePlay = () => {
        if (isPlaying) {
            setCurrentlyPlayingId(null); // Pause
        } else {
            setCurrentlyPlayingId(audioId); // Play
        }
    };
    
    const handleEnded = () => {
        setCurrentlyPlayingId(null);
    }

    return (
        <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={handlePlay}
            onEnded={handleEnded}
            controls
            className="w-full rounded-lg h-10"
        >
            Your browser does not support the audio element.
        </audio>
    );
}
