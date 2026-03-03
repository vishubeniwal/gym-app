import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { addDays, format } from 'date-fns';

export function MemberForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { members, plans, addMember, updateMember } = useApp();

    const isEditing = Boolean(id);
    const existingMember = isEditing ? members.find((m) => m.id === id) : null;

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        plan_id: '',
        join_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        payment_status: 'Due' as 'Paid' | 'Due',
        active: true,
    });

    useEffect(() => {
        if (existingMember) {
            setFormData({
                ...existingMember,
            });
        } else if (plans.length > 0) {
            setFormData(prev => ({ ...prev, plan_id: plans[0].id }));
        }
    }, [existingMember, plans]);

    useEffect(() => {
        // Auto calculate expiry when plan or join_date changes
        if (!isEditing && formData.plan_id && formData.join_date) {
            const selectedPlan = plans.find(p => p.id === formData.plan_id);
            if (selectedPlan) {
                const joinDateObj = new Date(formData.join_date);
                const expiry = addDays(joinDateObj, selectedPlan.duration_days);
                setFormData(prev => ({ ...prev, expiry_date: format(expiry, 'yyyy-MM-dd') }));
            }
        }
    }, [formData.plan_id, formData.join_date, plans, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.full_name || !formData.phone || !formData.plan_id) {
            alert('Please fill out all required fields');
            return;
        }

        if (isEditing && existingMember) {
            await updateMember({ ...existingMember, ...formData });
            navigate(`/members/${existingMember.id}`);
        } else {
            await addMember(formData);
            navigate('/members');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">{isEditing ? 'Edit Member' : 'New Member'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <Input
                        required
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Phone *</label>
                    <Input
                        required
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Gym Plan *</label>
                    {plans.length === 0 ? (
                        <div className="p-3 text-sm text-warning-600 bg-warning-50 rounded-xl">
                            Please create a Plan first in Settings before adding members.
                        </div>
                    ) : (
                        <select
                            required
                            className="flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={formData.plan_id}
                            onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                        >
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.duration_days} days)</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Join Date</label>
                        <Input
                            type="date"
                            required
                            value={formData.join_date}
                            onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                        <Input
                            type="date"
                            required
                            value={formData.expiry_date}
                            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Payment Status</label>
                    <select
                        className="flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.payment_status}
                        onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                    >
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                    </select>
                </div>

                {isEditing && (
                    <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                        <span className="font-medium">Active Member</span>
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                        />
                    </div>
                )}

                <div className="pt-4">
                    <Button type="submit" fullWidth size="lg">
                        {isEditing ? 'Save Changes' : 'Add Member'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
