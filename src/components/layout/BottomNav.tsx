import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ScanLine, Settings } from 'lucide-react';
import { cn } from '../ui/Button';

const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Users, label: 'Members', path: '/members' },
    { icon: ScanLine, label: 'Scan', path: '/scan' },
    { icon: Settings, label: 'Menu', path: '/settings' },
];

export function BottomNav() {
    const location = useLocation();

    // Hide on landing page
    if (location.pathname === '/' || location.pathname === '/login') {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-surface-200 dark:border-surface-800 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname.startsWith(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1',
                                isActive
                                    ? 'text-brand-600 dark:text-brand-500'
                                    : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'
                            )}
                        >
                            <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
