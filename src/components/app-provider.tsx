
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { SidebarProvider } from './ui/sidebar';
import { isToday } from 'date-fns';

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
  favorites: HistoryItem[];
  toggleFavorite: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  profile: UserProfile;
  setProfile: (newProfile: UserProfile) => void;
  stats: {
    voicesGenerated: number;
    favoritesCount: number;
    historyItems: number;
    generationsToday: number;
  };
  creditState: {
    dailyLimit: number;
    creditsUsed: number;
    creditsRemaining: number;
    limitReached: boolean;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

const DAILY_GENERATION_LIMIT = 15;

export function AppProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [profile, setProfileState] = useState<UserProfile>(defaultProfile);

    useEffect(() => {
        setHistory(getFromLocalStorage('appHistory', []));
        setProfileState(getFromLocalStorage('userProfile', defaultProfile));
        setIsMounted(true);
    }, []);

    const setProfile = useCallback((newProfile: UserProfile) => {
        setProfileState(newProfile);
        setInLocalStorage('userProfile', newProfile);
    }, []);

    const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => {
        setHistory(prev => {
            const newHistoryItem: HistoryItem = {
                ...item,
                id: new Date().toISOString() + Math.random(),
                timestamp: new Date().toISOString(),
                isFavorite: false,
            };
            const updatedHistory = [newHistoryItem, ...prev];
            setInLocalStorage('appHistory', updatedHistory);
            return updatedHistory;
        });
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            );
            setInLocalStorage('appHistory', updatedHistory);
            return updatedHistory;
        });
    }, []);

    const deleteHistoryItem = useCallback((id: string) => {
        setHistory(prev => {
            const updatedHistory = prev.filter(h => h.id !== id);
            setInLocalStorage('appHistory', updatedHistory);
            return updatedHistory;
        });
    }, []);
    
    const favorites = history.filter(item => item.isFavorite);

    const generationsToday = history.filter(item => isToday(new Date(item.timestamp))).length;

    const stats = {
        voicesGenerated: history.length,
        favoritesCount: favorites.length,
        historyItems: history.length,
        generationsToday: generationsToday,
    };

    const creditState = {
        dailyLimit: DAILY_GENERATION_LIMIT,
        creditsUsed: generationsToday,
        creditsRemaining: DAILY_GENERATION_LIMIT - generationsToday,
        limitReached: generationsToday >= DAILY_GENERATION_LIMIT,
    };
    
    if (!isMounted) {
        return (
            <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
                {null}
            </SidebarProvider>
        ); 
    }

    return (
        <AppContext.Provider value={{ history, favorites, toggleFavorite, deleteHistoryItem, addHistoryItem, profile, setProfile, stats, creditState }}>
            <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
                {children}
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
