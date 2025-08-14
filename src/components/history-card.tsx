
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download, Trash2, Mic, Calendar, Clock } from "lucide-react";
import { HistoryItem, useAppContext } from "./app-provider";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./audio-player";

interface HistoryCardProps {
  item: HistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const { toggleFavorite, deleteHistoryItem } = useAppContext();

  return (
    <Card className="w-full shadow-lg border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:shadow-xl flex flex-col">
      <CardHeader className="flex-grow pb-4">
        <CardTitle className="text-lg font-bold leading-tight">
          <p className="line-clamp-2" title={item.dialogue}>"{item.dialogue}"</p>
        </CardTitle>
        <CardDescription className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-3 text-xs">
          <span className="flex items-center gap-2 truncate">
            <Mic className="h-4 w-4 flex-shrink-0" />
            <span className="truncate" title={item.voice}>{item.voice}</span>
          </span>
           <span className="flex items-center gap-2 truncate">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.duration}s</span>
          </span>
          <span className="flex items-center gap-2 truncate col-span-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{format(new Date(item.timestamp), "PPp")}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <AudioPlayer audioUrl={item.audioUrl} audioId={item.id} />
      </CardContent>
      <CardFooter className="flex justify-end gap-1 p-2 md:p-3">
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
