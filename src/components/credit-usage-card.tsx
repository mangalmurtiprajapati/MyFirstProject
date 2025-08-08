
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "./app-provider";
import { Zap, Clock } from "lucide-react";

export function CreditUsageCard() {
    const { creditState } = useAppContext();
    const [timeTillReset, setTimeTillReset] = useState("");

    useEffect(() => {
        const calculateTimeTillReset = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const diff = tomorrow.getTime() - now.getTime();
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            setTimeTillReset(`${hours}h ${minutes}m`);
        };

        calculateTimeTillReset();
        const interval = setInterval(calculateTimeTillReset, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const progressValue = (creditState.creditsUsed / creditState.dailyLimit) * 100;

    return (
        <Card className="w-full max-w-4xl shadow-lg border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="text-primary" />
                    Daily Usage Credits
                </CardTitle>
                <CardDescription>Your free daily generations quota. Resets every 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-primary">{creditState.creditsRemaining}</span>
                    <span className="text-muted-foreground">/ {creditState.dailyLimit} Generations Left</span>
                </div>
                <Progress value={progressValue} />
                 {creditState.limitReached && (
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-500 font-semibold p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Clock className="h-5 w-5" />
                        <span>Limit reached. Resets in {timeTillReset}.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
