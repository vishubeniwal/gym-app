import localforage from 'localforage';

export interface Workspace {
    id: string;
    gym_name: string;
    created_at: string;
}

export interface Plan {
    id: string;
    name: string;
    duration_days: number;
    price?: number;
}

export interface Member {
    id: string;
    full_name: string;
    phone: string;
    join_date: string;
    plan_id: string;
    expiry_date: string;
    payment_status: 'Paid' | 'Due';
    notes?: string;
    active: boolean;
}

export interface Attendance {
    id: string;
    member_id: string;
    check_in_time: string;
    check_in_date: string; // YYYY-MM-DD for easy querying
}

export interface DietPlan {
    id: string;
    title: string;
    goal: string;
    content: string;
}

// Initialize stores
const workspaceStore = localforage.createInstance({ name: 'GymChecker', storeName: 'workspace' });
const membersStore = localforage.createInstance({ name: 'GymChecker', storeName: 'members' });
const plansStore = localforage.createInstance({ name: 'GymChecker', storeName: 'plans' });
const attendanceStore = localforage.createInstance({ name: 'GymChecker', storeName: 'attendance' });
const dietPlansStore = localforage.createInstance({ name: 'GymChecker', storeName: 'diet_plans' });

export const guestStorage = {
    // Workspace
    getWorkspace: async (): Promise<Workspace | null> => {
        return workspaceStore.getItem<Workspace>('current_workspace');
    },
    saveWorkspace: async (workspace: Workspace): Promise<Workspace> => {
        return workspaceStore.setItem('current_workspace', workspace);
    },

    // Members
    getMembers: async (): Promise<Member[]> => {
        const list: Member[] = [];
        await membersStore.iterate<Member, void>((value) => {
            list.push(value);
        });
        return list;
    },
    saveMember: async (member: Member): Promise<Member> => {
        return membersStore.setItem(member.id, member);
    },
    deleteMember: async (id: string): Promise<void> => {
        return membersStore.removeItem(id);
    },

    // Plans
    getPlans: async (): Promise<Plan[]> => {
        const list: Plan[] = [];
        await plansStore.iterate<Plan, void>((value) => {
            list.push(value);
        });
        return list;
    },
    savePlan: async (plan: Plan): Promise<Plan> => {
        return plansStore.setItem(plan.id, plan);
    },

    // Diet Plans
    getDietPlans: async (): Promise<DietPlan[]> => {
        const list: DietPlan[] = [];
        await dietPlansStore.iterate<DietPlan, void>((value) => {
            list.push(value);
        });
        return list;
    },
    saveDietPlan: async (plan: DietPlan): Promise<DietPlan> => {
        return dietPlansStore.setItem(plan.id, plan);
    },

    // Attendance
    getAttendanceForDate: async (dateStr: string): Promise<Attendance[]> => {
        const list: Attendance[] = [];
        await attendanceStore.iterate<Attendance, void>((value) => {
            if (value.check_in_date === dateStr) {
                list.push(value);
            }
        });
        return list;
    },
    saveAttendance: async (attendance: Attendance): Promise<Attendance> => {
        return attendanceStore.setItem(attendance.id, attendance);
    },
};
