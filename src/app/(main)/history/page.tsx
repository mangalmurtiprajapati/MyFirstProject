
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mic } from "lucide-react";

export default function HistoryPage() {
  const { history } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <History className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Generation History</h1>
                <p className="text-muted-foreground">Your generated audio will appear here.</p>
            </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-[230px] w-full" />
            <Skeleton className="h-[230px] w-full" />
            <Skeleton className="h-[230px] w-full" />
            <Skeleton className="h-[230px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <History className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Generation History</h1>
                <p className="text-muted-foreground">Your generated audio will appear here.</p>
            </div>
        </div>
      {history.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] border-dashed shadow-none">
            <CardHeader className="space-y-4">
                <div className="p-5 bg-muted rounded-full mx-auto border-2 border-dashed">
                    <History className="w-16 h-16 text-muted-foreground/60" />
                </div>
                <CardTitle className="text-2xl mt-4">No History Yet</CardTitle>
                <CardDescription className="max-w-xs mx-auto">
                    It looks like you haven't generated any voices. Head over to the workspace to create your first one!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild size="lg">
                    <Link href="/workspace">
                        <Mic className="mr-2" />
                        Go to Workspace
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
