import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { isExpiringSoon, isExpired } from '../utils/date';
import { Search, Plus, UserCircle, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function MembersList() {
    const { members } = useApp();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'all';
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            // Name Search
            if (searchQuery && !member.full_name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Filter Tabs
            if (filter === 'active' && !member.active) return false;
            if (filter === 'expiring') {
                if (!member.active || !isExpiringSoon(member.expiry_date)) return false;
            }
            if (filter === 'expired') {
                if (member.active && !isExpired(member.expiry_date)) return false;
            }
            return true;
        });
    }, [members, filter, searchQuery]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Members</h2>
                <Button size="sm" className="gap-2" onClick={() => navigate('/members/add')}>
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            <div className="sticky top-16 z-40 bg-bg-color pt-2 pb-2 space-y-3">
                <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                />

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setSearchParams({ filter: 'all' })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSearchParams({ filter: 'active' })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'active' ? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setSearchParams({ filter: 'expiring' })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'expiring' ? 'bg-warning-500 text-white' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                            }`}
                    >
                        Expiring Soon
                    </button>
                    <button
                        onClick={() => setSearchParams({ filter: 'expired' })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'expired' ? 'bg-danger-500 text-white' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                            }`}
                    >
                        Expired
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-10 text-surface-500">
                        No members found.
                    </div>
                ) : (
                    filteredMembers.map((member) => {
                        const expired = isExpired(member.expiry_date);
                        const expiring = !expired && isExpiringSoon(member.expiry_date);

                        return (
                            <div
                                key={member.id}
                                onClick={() => navigate(`/members/${member.id}`)}
                                className="flex items-center p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
                                    <UserCircle className="w-7 h-7 text-surface-400" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold text-surface-900 dark:text-surface-50">{member.full_name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-500">
                                        <span
                                            className={`w-2 h-2 rounded-full ${expired ? 'bg-danger-500' : expiring ? 'bg-warning-500' : 'bg-success-500'
                                                }`}
                                        />
                                        <span>
                                            {expired ? 'Expired' : expiring ? 'Expiring soon' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-surface-300" />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
