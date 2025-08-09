
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { history } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Generation History</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generation History</h1>
      {history.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
          <CardHeader>
            <div className="p-4 bg-muted rounded-full mx-auto">
              <History className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No History Yet</CardTitle>
            <CardDescription>
              Your generated audio files will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      )}
    </div>
  )
}
