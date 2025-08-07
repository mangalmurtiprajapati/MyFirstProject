
"use client"

import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "./ui/sidebar";
import { VocalForgeLogo } from "./vocal-forge-logo";
import { AnimatedHeader } from './animated-header';
import { Home, Settings, Mic, History, Star, User } from 'lucide-react';
import { AppFooter } from './app-footer';

const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/workspace", icon: Mic, label: "Workspace" },
    { href: "/history", icon: History, label: "History" },
    { href: "/favorites", icon: Star, label: "Favorites" },
];

const bottomNavItems = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <VocalForgeLogo className="h-8 w-8 text-primary" />
                        <span className="text-lg font-semibold">VocalForge</span>
                    </div>
                </SidebarHeader>
                <ScrollArea className="flex-1">
                    <SidebarContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className="justify-start"
                                        tooltip={{
                                            children: item.label,
                                            side: "right",
                                            align: "center",
                                        }}
                                    >
                                        <a href={item.href}>
                                            <item.icon className="size-5" />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </ScrollArea>
                 <SidebarContent>
                    <SidebarMenu>
                        {bottomNavItems.map((item) => (
                             <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                    className="justify-start"
                                    tooltip={{
                                        children: item.label,
                                        side: "right",
                                        align: "center",
                                    }}
                                >
                                    <a href={item.href}>
                                        <item.icon className="size-5" />
                                        <span>{item.label}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>

            <div className="flex flex-col flex-1">
                <AnimatedHeader />
                <main className="flex-1">
                    {children}
                </main>
                <AppFooter />
            </div>
        </>
    );
}
