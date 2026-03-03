import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, UserPlus, ScanLine, Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { isExpiringSoon } from '../utils/date';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const { members, getTodayAttendance } = useApp();
    const navigate = useNavigate();
    const [attendanceCount, setAttendanceCount] = useState(0);

    useEffect(() => {
        getTodayAttendance().then((records) => setAttendanceCount(records.length));
    }, [getTodayAttendance]);

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.active).length;
    const expiringSoon = members.filter((m) => m.active && isExpiringSoon(m.expiry_date)).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card glass>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-surface-500 dark:text-surface-400">
                            Total Members
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{totalMembers}</div>
                    </CardContent>
                </Card>
                <Card glass>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-surface-500 dark:text-surface-400">
                            Active Members
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-success-500">{activeMembers}</div>
                    </CardContent>
                </Card>
                <Card glass>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-surface-500 dark:text-surface-400">
                            Expiring Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-warning-500">{expiringSoon}</div>
                    </CardContent>
                </Card>
                <Card glass>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-surface-500 dark:text-surface-400">
                            Today's Scans
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-brand-500">{attendanceCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" className="h-auto py-3 flex-col gap-2" onClick={() => navigate('/members/add')}>
                        <UserPlus className="w-5 h-5" />
                        <span className="text-xs">Add Member</span>
                    </Button>
                    <Button variant="secondary" className="h-auto py-3 flex-col gap-2" onClick={() => navigate('/scan')}>
                        <ScanLine className="w-5 h-5" />
                        <span className="text-xs">Scan QR</span>
                    </Button>
                    <Button variant="secondary" className="h-auto py-3 flex-col gap-2" onClick={() => navigate('/members?filter=expiring')}>
                        <Bell className="w-5 h-5 text-warning-500" />
                        <span className="text-xs">Reminders</span>
                    </Button>
                    <Button variant="secondary" className="h-auto py-3 flex-col gap-2" onClick={() => navigate('/members')}>
                        <Users className="w-5 h-5 text-brand-500" />
                        <span className="text-xs">All Members</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
