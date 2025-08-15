
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const { favorites } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Favorite Voices</h1>
                    <p className="text-muted-foreground">Your starred creations will appear here.</p>
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
                <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Favorite Voices</h1>
                <p className="text-muted-foreground">Your starred creations will appear here.</p>
            </div>
        </div>
      {favorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] border-dashed shadow-none">
          <CardHeader className="space-y-4">
            <div className="p-5 bg-muted rounded-full mx-auto border-2 border-dashed">
              <Star className="w-16 h-16 text-muted-foreground/60" />
            </div>
            <CardTitle className="text-2xl mt-4">No Favorites Yet</CardTitle>
            <CardDescription className="max-w-xs mx-auto">
              Go to your history and click the star on any generated voice to save it here for easy access.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
