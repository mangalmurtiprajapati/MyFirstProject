
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { HistoryCard } from "@/components/history-card";

export default function FavoritesPage() {
  const { favorites } = useAppContext();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Favorite Voices</h1>
      {favorites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
          <CardHeader>
            <div className="p-4 bg-muted rounded-full mx-auto">
              <Star className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No Favorites Yet</CardTitle>
            <CardDescription>
              Your favorite voices will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      )}
    </div>
  )
}
