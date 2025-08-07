
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, Star, History, Edit } from "lucide-react";

export default function ProfilePage() {
    // Mock data
    const user = {
        name: "Alex Doe",
        email: "alex.doe@example.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "AD",
        bio: "AI enthusiast and sound designer, exploring the future of voice synthesis with VocalForge."
    };

    const stats = [
        { icon: Mic, label: "Voices Generated", value: 128 },
        { icon: Star, label: "Favorites", value: 12 },
        { icon: History, label: "History Items", value: 45 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">
                    Your personal space to track your activity.
                </p>
            </div>
            <Separator />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4" data-ai-hint="profile picture">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                         <CardHeader>
                            <CardTitle>Activity Stats</CardTitle>
                            <CardDescription>An overview of your usage on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="flex flex-col items-center justify-center p-6 text-center bg-muted/50">
                                    <stat.icon className="w-10 h-10 mb-2 text-primary" />
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
