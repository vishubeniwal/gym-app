import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-bg-color text-text-color flex flex-col font-sans">
            <Header />
            <main className="flex-1 w-full max-w-lg mx-auto pb-20 pt-20 px-4">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
