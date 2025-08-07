
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download, Trash2, Mic, Calendar } from "lucide-react";
import { HistoryItem, useAppContext } from "./app-provider";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
  item: HistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const { toggleFavorite, setHistory } = useAppContext();

  const handleDelete = () => {
    setHistory(prev => prev.filter(h => h.id !== item.id));
  };

  return (
    <Card className="w-full shadow-lg border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle className="truncate text-lg font-bold" title={item.dialogue}>
          "{item.dialogue}"
        </CardTitle>
        <CardDescription className="flex items-center gap-4 pt-2 text-sm">
          <span className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            {item.voice}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(item.timestamp, "PPP p")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <audio controls src={item.audioUrl} className="w-full rounded-lg">
          Your browser does not support the audio element.
        </audio>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(item.id)} title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <Star className={cn("h-5 w-5", item.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
        </Button>
        <Button variant="ghost" size="icon" asChild title="Download audio">
          <a href={item.audioUrl} download={`${item.voice}-${item.id}.wav`}>
            <Download className="h-5 w-5 text-muted-foreground" />
          </a>
        </Button>
         <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete history item">
            <Trash2 className="h-5 w-5 text-destructive/80" />
        </Button>
      </CardFooter>
    </Card>
  );
}
