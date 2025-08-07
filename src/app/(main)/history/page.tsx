import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Generation History</h1>
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
    </div>
  )
}
