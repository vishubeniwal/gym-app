import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';
import { Plus, MessageCircle, Target } from 'lucide-react';

export function DietPlans() {
    const { dietPlans, workspace } = useApp();
    const navigate = useNavigate();

    const handleShare = (plan: any) => {
        const text = `*${plan.title}*\nGoal: ${plan.goal}\n\n${plan.content}\n\n_Shared via ${workspace?.gym_name}_`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Diet Plans</h2>
                <Button size="sm" className="gap-2" onClick={() => navigate('/diet-plans/add')}>
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            <div className="space-y-4 pt-2">
                {dietPlans.length === 0 ? (
                    <div className="text-center py-10 text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-800">
                        No diet plans created yet.
                    </div>
                ) : (
                    dietPlans.map((plan) => (
                        <div key={plan.id} className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <div>
                                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-surface-500 mt-0.5 uppercase tracking-wider">
                                        <Target className="w-3.5 h-3.5" />
                                        {plan.goal}
                                    </div>
                                </div>
                                <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
                                    {plan.content}
                                </p>

                                <div className="pt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2 text-[#128C7E] dark:text-[#25D366] border-[#25D366]/30 dark:border-[#25D366]/30 hover:bg-[#25D366]/10"
                                        onClick={() => handleShare(plan)}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Share via WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
