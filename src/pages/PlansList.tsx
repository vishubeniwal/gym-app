import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plus, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function PlansList() {
    const { plans } = useApp();
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gym Plans</h2>
                <Button size="sm" className="gap-2" onClick={() => navigate('/settings/plans/add')}>
                    <Plus className="w-4 h-4" />
                    Add Plan
                </Button>
            </div>

            <div className="space-y-3 pt-2">
                {plans.length === 0 ? (
                    <div className="text-center py-10 text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-800">
                        No plans created yet.
                        <div className="mt-4">
                            <Button size="sm" onClick={() => navigate('/settings/plans/add')}>Create your first plan</Button>
                        </div>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-surface-900 dark:text-surface-50">
                                        {plan.name}
                                    </h3>
                                    <div className="text-sm text-surface-500 mt-1">
                                        {plan.duration_days} Days validity
                                    </div>
                                </div>
                                {plan.price && (
                                    <div className="flex items-center font-bold text-lg text-brand-600 dark:text-brand-400">
                                        <IndianRupee className="w-4 h-4 mr-0.5" />
                                        {plan.price}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
