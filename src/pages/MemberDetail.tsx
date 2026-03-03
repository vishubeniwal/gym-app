import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Edit2, Trash2, MessageCircle, Calendar } from 'lucide-react';
import { isExpired, isExpiringSoon } from '../utils/date';
import { QRCodeSVG } from 'qrcode.react';

export function MemberDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { members, plans, workspace, deleteMember } = useApp();

    const member = members.find(m => m.id === id);

    if (!member) {
        return <div className="p-4 text-center">Member not found.</div>;
    }

    const plan = plans.find(p => p.id === member.plan_id);
    const expired = isExpired(member.expiry_date);
    const expiring = !expired && isExpiringSoon(member.expiry_date);

    const statusColor = expired
        ? 'text-danger-500 bg-danger-50 dark:bg-danger-500/10'
        : expiring
            ? 'text-warning-600 bg-warning-50 dark:bg-warning-500/10'
            : 'text-success-600 bg-success-50 dark:bg-success-500/10';

    const statusText = expired ? 'Expired' : expiring ? 'Expiring Soon' : 'Active';

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            await deleteMember(member.id);
            navigate('/members');
        }
    };

    const qrValue = JSON.stringify({
        member_id: member.id,
        workspace_id: workspace?.id,
    });

    const generateWhatsAppLink = () => {
        const message = `Hi ${member.full_name}, your gym membership at ${workspace?.gym_name} expires on ${member.expiry_date}. Renew to continue without break 💪`;
        return `https://wa.me/${member.phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/members')} className="p-2 -ml-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">Member Details</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/members/${member.id}/edit`)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className={`px-4 py-1 rounded-full text-xs font-semibold mb-4 ${statusColor}`}>
                    {statusText}
                </div>
                <h1 className="text-2xl font-bold text-center mb-1">{member.full_name}</h1>
                <p className="text-surface-500">{member.phone}</p>
            </div>

            <Card className="p-6 flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-2 rounded-xl border border-surface-200">
                    <QRCodeSVG value={qrValue} size={160} />
                </div>
                <p className="text-sm text-surface-500 text-center">Scan at the front desk for attendance.</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                    <div className="flex items-center gap-2 text-surface-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Join Date</span>
                    </div>
                    <div className="font-semibold">{member.join_date}</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                    <div className="flex items-center gap-2 text-surface-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Expiry Date</span>
                    </div>
                    <div className="font-semibold">{member.expiry_date}</div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between p-4 rounded-xl border border-surface-100 dark:border-surface-800">
                    <span className="text-surface-500">Plan</span>
                    <span className="font-medium">{plan?.name || 'Unknown Plan'}</span>
                </div>
                <div className="flex justify-between p-4 rounded-xl border border-surface-100 dark:border-surface-800">
                    <span className="text-surface-500">Payment</span>
                    <span className={`font-medium ${member.payment_status === 'Due' ? 'text-warning-500' : 'text-success-500'}`}>
                        {member.payment_status}
                    </span>
                </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
                <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate(`/members/${member.id}/edit`)}
                    variant="secondary"
                >
                    Renew Plan
                </Button>
                <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button fullWidth size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Remind
                    </Button>
                </a>
            </div>
        </div>
    );
}
