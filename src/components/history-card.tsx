
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
  const { toggleFavorite, deleteHistoryItem } = useAppContext();

  return (
    <Card className="w-full shadow-lg border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:shadow-xl flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg font-bold">
          <p className="truncate" title={item.dialogue}>"{item.dialogue}"</p>
        </CardTitle>
        <CardDescription className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 text-sm">
          <span className="flex items-center gap-2 truncate">
            <Mic className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.voice}</span>
          </span>
          <span className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{format(new Date(item.timestamp), "PPP p")}</span>
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
          <Star className={cn("h-5 w-5 transition-colors", item.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-400")} />
        </Button>
        <Button variant="ghost" size="icon" asChild title="Download audio">
          <a href={item.audioUrl} download={`${item.voice.replace(' ','_')}-${item.id}.wav`}>
            <Download className="h-5 w-5 text-muted-foreground" />
          </a>
        </Button>
         <Button variant="ghost" size="icon" onClick={() => deleteHistoryItem(item.id)} title="Delete history item">
            <Trash2 className="h-5 w-5 text-destructive/80 hover:text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
}
