import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Settings() {
    const { workspace } = useApp();
    const navigate = useNavigate();
    const [gymName, setGymName] = useState('');
    const [whatsappTemplate, setWhatsappTemplate] = useState(
        'Hi {name}, your gym membership at {gym} expires on {date}. Renew to continue without break 💪'
    );

    useEffect(() => {
        if (workspace) {
            setGymName(workspace.gym_name);
        }
    }, [workspace]);

    const handleSave = () => {
        // In a real app we'd update the workplace context here
        alert('Settings saved successfully!');
    };

    const handleLogout = () => {
        // Just clear local storage and reload for MVP guest mode demo
        if (window.confirm('Are you sure you want to exit Guest Mode? All local data will be cleared if not migrated to Google.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>

            <div className="space-y-4 bg-white dark:bg-surface-900 p-4 rounded-2xl border border-surface-200 dark:border-surface-800">
                <h3 className="font-semibold text-lg border-b border-surface-100 dark:border-surface-800 pb-2">
                    Workspace
                </h3>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Gym Name</label>
                    <Input
                        value={gymName}
                        onChange={(e) => setGymName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <div>
                        <Button variant="secondary" className="w-full justify-between" onClick={() => navigate('/settings/plans')}>
                            <span>Manage Subscription Plans</span>
                            <span>→</span>
                        </Button>
                    </div>
                    <div>
                        <Button variant="secondary" className="w-full justify-between" onClick={() => navigate('/diet-plans')}>
                            <span>Manage Diet Plans</span>
                            <span>→</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-surface-900 p-4 rounded-2xl border border-surface-200 dark:border-surface-800">
                <h3 className="font-semibold text-lg border-b border-surface-100 dark:border-surface-800 pb-2">
                    WhatsApp Reminders
                </h3>
                <div>
                    <label className="block text-sm font-medium mb-1.5 break-words">Message Template</label>
                    <textarea
                        className="w-full min-h-[100px] rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none break-words"
                        value={whatsappTemplate}
                        onChange={(e) => setWhatsappTemplate(e.target.value)}
                    />
                    <p className="text-xs text-surface-500 mt-2 break-words">
                        Available variables: {'{name}'}, {'{date}'}, {'{gym}'}
                    </p>
                </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button onClick={handleSave} className="gap-2" size="lg">
                    <Save className="w-5 h-5" />
                    Save Settings
                </Button>
                <Button variant="danger" onClick={handleLogout} className="gap-2" size="lg">
                    <LogOut className="w-5 h-5" />
                    Exit Guest Mode (Clear Data)
                </Button>
            </div>
        </div>
    );
}
