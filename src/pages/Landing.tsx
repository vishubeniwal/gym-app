import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export function Landing() {
    const navigate = useNavigate();
    const { initGuestWorkspace, workspace, loading } = useApp();

    if (loading) return null;

    if (workspace) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleGuestMode = async () => {
        // Generate an automatic guest workspace
        await initGuestWorkspace('My Guest Gym');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-brand-600 to-brand-400 bg-clip-text text-transparent sm:text-5xl">
                    GymChecker
                </h1>
                <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 max-w-sm mx-auto">
                    The simplest way to manage your gym, members, and attendance.
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <button
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 h-14 rounded-2xl font-semibold shadow-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-all active:scale-95"
                    onClick={() => alert('Google Login is coming soon! Try Guest Mode for now.')}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-surface-200 dark:border-surface-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-bg-color text-surface-500">or</span>
                    </div>
                </div>
                <button
                    onClick={handleGuestMode}
                    className="w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white h-14 rounded-2xl font-semibold shadow-sm transition-all active:scale-95"
                >
                    Try Guest Mode
                </button>
            </div>

            <p className="text-xs text-surface-500 max-w-xs text-center">
                Guest mode saves data locally on your device. You can safely try the application right now.
            </p>
        </div>
    );
}
