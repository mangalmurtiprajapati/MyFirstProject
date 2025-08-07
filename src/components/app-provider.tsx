
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SidebarProvider } from './ui/sidebar';
import { MainLayout } from './main-layout';

export interface HistoryItem {
  id: string;
  dialogue: string;
  voice: string;
  audioUrl: string;
  timestamp: string; // Storing as ISO string
  isFavorite: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    initials: string;
    bio: string;
}

interface AppContextType {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  favorites: HistoryItem[];
  toggleFavorite: (id: string) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  stats: {
    voicesGenerated: number;
    favoritesCount: number;
    historyItems: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get data from localStorage
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

// Helper to set data to localStorage
const setInLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
    }
};

const defaultProfile: UserProfile = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "AD",
    bio: "AI enthusiast and sound designer, exploring the future of voice synthesis with VocalForge."
};

export function AppProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>(() => getFromLocalStorage('appHistory', []));
    const [profile, setProfile] = useState<UserProfile>(() => getFromLocalStorage('userProfile', defaultProfile));

    // Persist history to localStorage
    useEffect(() => {
        setInLocalStorage('appHistory', history);
    }, [history]);

    // Persist profile to localStorage
    useEffect(() => {
        setInLocalStorage('userProfile', profile);
    }, [profile]);


    const toggleFavorite = (id: string) => {
        setHistory(prevHistory =>
            prevHistory.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    };
    
    const favorites = history.filter(item => item.isFavorite);

    const stats = {
        voicesGenerated: history.length,
        favoritesCount: favorites.length,
        historyItems: history.length,
    };

    return (
        <AppContext.Provider value={{ history, setHistory, favorites, toggleFavorite, profile, setProfile, stats }}>
            <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
                <MainLayout>
                    {children}
                </MainLayout>
            </SidebarProvider>
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
