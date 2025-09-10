
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, MessageSquare, BarChart, ImageIcon, BrainCircuit, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const aiTools = [
  {
    icon: Bot,
    title: "AI Content Generation",
    description: "Create high-quality blog posts, social media updates, and marketing copy in seconds. Overcome writer's block and scale your content strategy.",
    image: "https://picsum.photos/seed/tool1/600/400",
    hint: "writing robot"
  },
  {
    icon: MessageSquare,
    title: "Intelligent Chatbots",
    description: "Build smart, conversational chatbots for customer support, lead generation, or internal training, available 24/7 to assist your users.",
    image: "https://picsum.photos/seed/tool2/600/400",
    hint: "support chat"
  },
  {
    icon: BarChart,
    title: "AI Data Analysis",
    description: "Turn raw data into actionable insights. I can build tools to analyze trends, forecast outcomes, and create interactive visualizations.",
    image: "https://picsum.photos/seed/tool3/600/400",
    hint: "data chart"
  },
  {
    icon: ImageIcon,
    title: "Image & Video AI",
    description: "From generating unique images from text prompts to analyzing video content for objects and sentiment, unlock the power of visual AI.",
    image: "https://picsum.photos/seed/tool4/600/400",
    hint: "visual art"
  },
  {
    icon: BrainCircuit,
    title: "Custom AI Models",
    description: "Have a unique challenge? I can help you design, train, and deploy custom machine learning models tailored to your specific business needs.",
    image: "https://picsum.photos/seed/tool5/600/400",
    hint: "neural network"
  }
];

export default function LearnMorePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore More AI Possibilities</h1>
          <p className="text-muted-foreground">
            Beyond voice, I can build a wide range of AI-powered applications.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiTools.map((tool, index) => (
          <Card key={index} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                <span className="p-3 rounded-full bg-primary/10 border border-primary/20">
                    <tool.icon className="w-6 h-6 text-primary" />
                </span>
                <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="aspect-video relative rounded-lg overflow-hidden border">
                 <Image src={tool.image} alt={tool.title} width={600} height={400} className="object-cover" data-ai-hint={tool.hint} />
               </div>
              <CardDescription>{tool.description}</CardDescription>
              <Badge variant="outline">Coming Soon</Badge>
            </CardContent>
          </Card>
        ))}
         <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl md:col-span-2 lg:col-span-1">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                <span className="p-3 rounded-full bg-primary/10 border border-primary/20">
                    <BookOpen className="w-6 h-6 text-primary" />
                </span>
                <div>
                    <CardTitle className="text-xl">And Many More!</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="aspect-video relative rounded-lg overflow-hidden border">
                 <Image src="https://picsum.photos/seed/tool6/600/400" alt="More AI Tools" width={600} height={400} className="object-cover" data-ai-hint="idea lightbulb" />
               </div>
              <CardDescription>If you can imagine it, I can probably build it. Let's collaborate to bring your most ambitious AI ideas to life. Contact me to discuss your project.</CardDescription>
              <Badge variant="secondary">Let's Talk</Badge>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
