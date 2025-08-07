"use client"

import React from 'react';
import { SidebarProvider } from './ui/sidebar';
import { MainLayout } from './main-layout';

export function AppProvider({ children }: { children: React.ReactNode }) {
    // We read the cookie here and set it as the default open state.
    const [sidebarOpen, setSidebarOpen] = React.useState(true)

    return (
        <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={(open) => setSidebarOpen(open)}>
            <MainLayout>
                {children}
            </MainLayout>
        </SidebarProvider>
    )
}
