
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, Star, History, Edit, LogIn, UserPlus } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { EditProfileSheet } from "@/components/edit-profile-sheet";
import Link from "next/link";

export default function ProfilePage() {
    const { profile, stats, isAuthenticated, logout } = useAppContext();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const statItems = [
        { icon: Mic, label: "Voices Generated", value: stats.voicesGenerated },
        { icon: Star, label: "Favorites", value: stats.favoritesCount },
        { icon: History, label: "History Items", value: stats.historyItems },
    ];

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
                <Card className="max-w-md w-full text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Join VocalForge</CardTitle>
                        <CardDescription>
                            Log in or create an account to manage your profile and track your creations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                       <Button asChild size="lg">
                           <Link href="/auth/login">
                                <LogIn className="mr-2" />
                                Login
                           </Link>
                       </Button>
                       <Button asChild variant="outline" size="lg">
                           <Link href="/auth/register">
                                <UserPlus className="mr-2" />
                                Register
                           </Link>
                       </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

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
                        <CardHeader className="items-center text-center p-4 md:p-6">
                            <Avatar className="w-24 h-24 mb-4" data-ai-hint="profile picture">
                                <AvatarImage src={profile.avatar} alt={profile.name} />
                                <AvatarFallback>{profile.initials}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{profile.name}</CardTitle>
                            <CardDescription>{profile.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center px-4 md:px-6">
                            <p className="text-sm text-muted-foreground">{profile.bio}</p>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 px-4 pb-4 md:px-6 md:pb-6">
                            <Button variant="outline" className="w-full" onClick={() => setIsSheetOpen(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                             <Button variant="destructive" className="w-full" onClick={logout}>
                                Logout
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
                            {statItems.map((stat, index) => (
                                <Card key={index} className="flex flex-col items-center justify-center p-4 md:p-6 text-center bg-muted/50">
                                    <stat.icon className="w-8 h-8 md:w-10 md:h-10 mb-2 text-primary" />
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <EditProfileSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        </div>
    )
}
