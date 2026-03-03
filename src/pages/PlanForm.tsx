import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowLeft, IndianRupee } from 'lucide-react';

export function PlanForm() {
    const navigate = useNavigate();
    const { addPlan } = useApp();

    const [formData, setFormData] = useState({
        name: '',
        duration_days: 30,
        price: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.duration_days) {
            alert('Name and Duration are required');
            return;
        }

        await addPlan({
            name: formData.name,
            duration_days: Number(formData.duration_days),
            price: formData.price ? Number(formData.price) : undefined,
        });

        navigate(-1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">New Plan</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Plan Name *</label>
                    <Input
                        required
                        placeholder="e.g. Monthly, Quarterly"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Duration (Days) *</label>
                    <Input
                        required
                        type="number"
                        min="1"
                        placeholder="30"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    />
                    <p className="text-xs text-surface-500 mt-1">This is carefully used to auto-calculate expiry dates.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Price (Optional)</label>
                    <Input
                        type="number"
                        placeholder="999"
                        leftIcon={<IndianRupee className="w-4 h-4" />}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" fullWidth size="lg"> Save Plan </Button>
                </div>
            </form>
        </div>
    );
}
