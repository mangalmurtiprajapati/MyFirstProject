
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { SidebarProvider } from './ui/sidebar';
import { isToday } from 'date-fns';
import { useRouter } from 'next/navigation';

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
  };
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
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

const guestProfile: UserProfile = {
    name: "Guest User",
    email: "",
    avatar: "",
    initials: "G",
    bio: "Log in to save your profile and creations."
}

const DAILY_GENERATION_LIMIT = 15;

export function AppProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [profile, setProfileState] = useState<UserProfile>(guestProfile);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const getHistoryKey = (userEmail: string | null) => {
        return userEmail ? `appHistory_${userEmail}` : 'appHistory_guest';
    }

    useEffect(() => {
        const storedProfile = getFromLocalStorage<UserProfile | null>('userProfile', null);
        if (storedProfile && storedProfile.email) {
            setProfileState(storedProfile);
            setIsAuthenticated(true);
            setHistory(getFromLocalStorage(getHistoryKey(storedProfile.email), []));
        } else {
            setProfileState(guestProfile);
            setIsAuthenticated(false);
            setHistory([]); // Guests have no history
        }
        setIsMounted(true);
    }, []);

    const setProfile = useCallback((newProfile: UserProfile) => {
        setProfileState(newProfile);
        if (isAuthenticated && profile.email) {
            setInLocalStorage('userProfile', newProfile);
        }
    }, [isAuthenticated, profile.email]);
    
    const login = useCallback((user: UserProfile) => {
        setProfileState(user);
        setIsAuthenticated(!!user.email);
        if(user.email){
            setInLocalStorage('userProfile', user);
            setHistory(getFromLocalStorage(getHistoryKey(user.email), []));
        } else {
             setHistory([]); // Guest user
        }
        router.push('/profile');
    }, [router]);
    
    const logout = useCallback(() => {
        setProfileState(guestProfile);
        setIsAuthenticated(false);
        setHistory([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userProfile');
        }
        router.push('/home');
    }, [router]);

    const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => {
        if (!isAuthenticated || !profile.email) return;
        setHistory(prev => {
            const newHistoryItem: HistoryItem = {
                ...item,
                id: new Date().toISOString() + Math.random(),
                timestamp: new Date().toISOString(),
                isFavorite: false,
            };
            const updatedHistory = [newHistoryItem, ...prev];
            setInLocalStorage(getHistoryKey(profile.email), updatedHistory);
            return updatedHistory;
        });
    }, [isAuthenticated, profile.email]);

    const toggleFavorite = useCallback((id: string) => {
        if (!isAuthenticated || !profile.email) return;
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            );
            setInLocalStorage(getHistoryKey(profile.email), updatedHistory);
            return updatedHistory;
        });
    }, [isAuthenticated, profile.email]);

    const deleteHistoryItem = useCallback((id: string) => {
        if (!isAuthenticated || !profile.email) return;
        setHistory(prev => {
            const updatedHistory = prev.filter(h => h.id !== id);
            setInLocalStorage(getHistoryKey(profile.email), updatedHistory);
            return updatedHistory;
        });
    }, [isAuthenticated, profile.email]);
    
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
        <AppContext.Provider value={{ history, favorites, toggleFavorite, deleteHistoryItem, addHistoryItem, profile, setProfile, stats, creditState, currentlyPlayingId, setCurrentlyPlayingId, isAuthenticated, login, logout }}>
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
