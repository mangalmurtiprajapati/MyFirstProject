import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VocalForgeLogo } from "@/components/vocal-forge-logo";
import { GenerateVoiceForm } from "@/components/generate-voice-form";
import { CloneVoiceForm } from "@/components/clone-voice-form";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col items-center gap-4 text-center">
        <VocalForgeLogo className="h-20 w-20 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
          VocalForge
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Craft the perfect voice. Clone an existing one or generate a unique synthetic voice with AI.
        </p>
      </header>
      <main className="w-full max-w-4xl">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Voice</TabsTrigger>
            <TabsTrigger value="clone">Clone Voice</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="mt-6">
            <GenerateVoiceForm />
          </TabsContent>
          <TabsContent value="clone" className="mt-6">
            <CloneVoiceForm />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Powered by AI. Built with Next.js and Firebase.</p>
      </footer>
    </div>
  );
}
