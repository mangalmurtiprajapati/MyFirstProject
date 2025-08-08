
"use client"

import { usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from "./ui/sidebar";
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

    const isLegalPage = pathname === '/terms' || pathname === '/privacy';

    const mainContent = (
         <div className="flex flex-col flex-1">
            {!isLegalPage && <AnimatedHeader />}
            <main className="flex-1">
                {children}
            </main>
            <AppFooter />
        </div>
    )

    if (isLegalPage) {
        return (
            <div className="flex flex-col flex-1">
                <main className="flex-1">
                    {children}
                </main>
                <AppFooter />
            </div>
        )
    }

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2.5">
                        <VocalForgeLogo className="h-8 w-8 text-primary" />
                        <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">VocalForge</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
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
                 <SidebarContent className="p-2 mt-auto">
                    <SidebarSeparator className="my-1" />
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

           {mainContent}
        </>
    );
}
