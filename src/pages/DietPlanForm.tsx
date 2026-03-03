import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function DietPlanForm() {
    const navigate = useNavigate();
    const { addDietPlan } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        goal: 'Weight Loss',
        content: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            alert('Title and Content are required');
            return;
        }

        await addDietPlan({
            title: formData.title,
            goal: formData.goal,
            content: formData.content,
        });

        navigate(-1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">New Diet Plan</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Plan Title *</label>
                    <Input
                        required
                        placeholder="e.g. Keto Fat Loss Plan"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Goal *</label>
                    <select
                        className="flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    >
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="General Health">General Health</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Diet Content *</label>
                    <textarea
                        required
                        className="w-full min-h-[200px] rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        placeholder="Write the full diet plan here. This text will be shared directly on WhatsApp."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" fullWidth size="lg"> Create Diet Plan </Button>
                </div>
            </form>
        </div>
    );
}
