import { Dumbbell, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const location = useLocation();

    // Hide on landing page
    if (location.pathname === '/' || location.pathname === '/login') {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-2">
                <div className="bg-brand-500 rounded-lg p-1.5 hidden sm:block">
                    <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                    GymChecker
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <button className="p-2 -mr-2 rounded-full text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-surface-100 transition-colors">
                    <UserCircle className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
