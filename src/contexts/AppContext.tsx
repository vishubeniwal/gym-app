import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { guestStorage } from '../services/guestStorage';
import type { Member, Plan, Workspace, Attendance, DietPlan } from '../services/guestStorage';

interface AppContextType {
    workspace: Workspace | null;
    members: Member[];
    plans: Plan[];
    dietPlans: DietPlan[];
    loading: boolean;
    initGuestWorkspace: (name: string) => Promise<void>;
    addMember: (member: Omit<Member, 'id'>) => Promise<void>;
    updateMember: (member: Member) => Promise<void>;
    deleteMember: (id: string) => Promise<void>;
    addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
    addDietPlan: (plan: Omit<DietPlan, 'id'>) => Promise<void>;
    markAttendance: (memberId: string) => Promise<{ success: boolean; message: string }>;
    getTodayAttendance: () => Promise<Attendance[]>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const ws = await guestStorage.getWorkspace();
            setWorkspace(ws);
            if (ws) {
                const [m, p, d] = await Promise.all([
                    guestStorage.getMembers(),
                    guestStorage.getPlans(),
                    guestStorage.getDietPlans(),
                ]);
                setMembers(m);
                setPlans(p);
                setDietPlans(d);
            }
        } catch (error) {
            console.error('Failed to load local data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const initGuestWorkspace = async (name: string) => {
        const ws: Workspace = { id: 'guest-ws', gym_name: name, created_at: new Date().toISOString() };
        await guestStorage.saveWorkspace(ws);
        setWorkspace(ws);
    };

    const addMember = async (memberData: Omit<Member, 'id'>) => {
        const newMember: Member = { ...memberData, id: crypto.randomUUID() };
        await guestStorage.saveMember(newMember);
        setMembers((prev) => [...prev, newMember]);
    };

    const updateMember = async (member: Member) => {
        await guestStorage.saveMember(member);
        setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    };

    const deleteMember = async (id: string) => {
        await guestStorage.deleteMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const addPlan = async (planData: Omit<Plan, 'id'>) => {
        const newPlan: Plan = { ...planData, id: crypto.randomUUID() };
        await guestStorage.savePlan(newPlan);
        setPlans((prev) => [...prev, newPlan]);
    };

    const addDietPlan = async (planData: Omit<DietPlan, 'id'>) => {
        const newPlan: DietPlan = { ...planData, id: crypto.randomUUID() };
        await guestStorage.saveDietPlan(newPlan);
        setDietPlans((prev) => [...prev, newPlan]);
    };

    const markAttendance = async (memberId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = await guestStorage.getAttendanceForDate(today);

        if (todayAttendance.some((a) => a.member_id === memberId)) {
            return { success: false, message: 'Already checked in today.' };
        }

        const newAttendance: Attendance = {
            id: crypto.randomUUID(),
            member_id: memberId,
            check_in_time: new Date().toISOString(),
            check_in_date: today,
        };

        await guestStorage.saveAttendance(newAttendance);
        return { success: true, message: 'Attendance marked successfully.' };
    };

    const getTodayAttendance = async () => {
        const today = new Date().toISOString().split('T')[0];
        return guestStorage.getAttendanceForDate(today);
    };

    return (
        <AppContext.Provider
            value={{
                workspace,
                members,
                plans,
                dietPlans,
                loading,
                initGuestWorkspace,
                addMember,
                updateMember,
                deleteMember,
                addPlan,
                addDietPlan,
                markAttendance,
                getTodayAttendance,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
