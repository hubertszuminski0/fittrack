<script setup>
import { computed, ref, watch } from 'vue';
import { CalendarDays, Dumbbell, Goal, History, LayoutDashboard } from 'lucide-vue-next';
import AppHeader from './components/AppHeader.vue';
import AuthPanel from './components/AuthPanel.vue';
import ActivityHistory from './components/ActivityHistory.vue';
import DashboardSummary from './components/DashboardSummary.vue';
import GoalManager from './components/GoalManager.vue';
import PlanManager from './components/PlanManager.vue';
import WorkoutLog from './components/WorkoutLog.vue';
import { createInitialWorkspace } from './data/defaults';
import {
  clearSession,
  getSession,
  getUsers,
  getWorkspace,
  saveSession,
  saveUsers,
  saveWorkspace
} from './lib/storage';

const sessionUser = getSession();
const currentUser = ref(sessionUser);
const authError = ref('');
const activeTab = ref('dashboard');
const initialWorkspace = getInitialWorkspace(sessionUser);

const profile = ref(initialWorkspace.profile);
const plans = ref(initialWorkspace.plans);
const workouts = ref(initialWorkspace.workouts);
const goals = ref(initialWorkspace.goals);

const tabs = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'plans', label: 'Plany', icon: CalendarDays },
  { id: 'workouts', label: 'Trening', icon: Dumbbell },
  { id: 'goals', label: 'Cele', icon: Goal },
  { id: 'history', label: 'Historia', icon: History }
];

const workspacePayload = computed(() => ({
  profile: profile.value,
  plans: plans.value,
  workouts: workouts.value,
  goals: goals.value
}));

watch(
  workspacePayload,
  (workspace) => {
    if (currentUser.value?.email) {
      saveWorkspace(currentUser.value.email, workspace);
    }
  },
  { deep: true }
);

function getInitialWorkspace(user) {
  if (!user?.email) {
    return createInitialWorkspace();
  }

  return getWorkspace(user.email) || createInitialWorkspace();
}

function loadWorkspace(user) {
  const workspace = getWorkspace(user.email) || createInitialWorkspace();
  profile.value = workspace.profile;
  plans.value = workspace.plans;
  workouts.value = workspace.workouts;
  goals.value = workspace.goals;
  saveWorkspace(user.email, workspace);
}

function createId(prefix) {
  const randomPart = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  return `${prefix}-${randomPart}`;
}

function handleAuth(payload) {
  authError.value = '';
  const users = getUsers();
  const email = payload.email.trim().toLowerCase();

  if (!email || !payload.password) {
    authError.value = 'Uzupelnij e-mail i haslo.';
    return;
  }

  if (payload.mode === 'register') {
    if (!payload.name.trim()) {
      authError.value = 'Podaj imie lub nazwe profilu.';
      return;
    }

    if (payload.password.length < 6) {
      authError.value = 'Haslo powinno miec co najmniej 6 znakow.';
      return;
    }

    if (users.some((user) => user.email === email)) {
      authError.value = 'Konto z takim adresem juz istnieje.';
      return;
    }

    const user = {
      name: payload.name.trim(),
      email,
      password: payload.password
    };
    saveUsers([...users, user]);
    signIn(user);
    return;
  }

  const user = users.find((item) => item.email === email && item.password === payload.password);

  if (!user) {
    authError.value = 'Nieprawidlowy e-mail lub haslo.';
    return;
  }

  signIn(user);
}

function signIn(user) {
  const publicUser = { name: user.name, email: user.email };
  currentUser.value = publicUser;
  saveSession(publicUser);
  loadWorkspace(publicUser);
  activeTab.value = 'dashboard';
}

function useDemoAccount() {
  const users = getUsers();
  const demoEmail = 'demo@fittrack.local';
  const demoUser = users.find((user) => user.email === demoEmail) || {
    name: 'Demo FitTrack',
    email: demoEmail,
    password: 'demo1234'
  };

  if (!users.some((user) => user.email === demoEmail)) {
    saveUsers([...users, demoUser]);
  }

  signIn(demoUser);
}

function logout() {
  clearSession();
  currentUser.value = null;
  authError.value = '';
  activeTab.value = 'dashboard';
}

function addPlan(plan) {
  plans.value = [
    {
      ...plan,
      id: createId('plan'),
      active: true
    },
    ...plans.value
  ];
}

function updatePlan(updatedPlan) {
  plans.value = plans.value.map((plan) => (plan.id === updatedPlan.id ? { ...plan, ...updatedPlan } : plan));
}

function deletePlan(planId) {
  plans.value = plans.value.filter((plan) => plan.id !== planId);
  workouts.value = workouts.value.map((workout) =>
    workout.planId === planId ? { ...workout, planId: '' } : workout
  );
}

function togglePlan(planId) {
  plans.value = plans.value.map((plan) => (plan.id === planId ? { ...plan, active: !plan.active } : plan));
}

function addWorkout(workout) {
  workouts.value = [
    {
      ...workout,
      id: createId('workout')
    },
    ...workouts.value
  ];
  activeTab.value = 'dashboard';
}

function deleteWorkout(workoutId) {
  workouts.value = workouts.value.filter((workout) => workout.id !== workoutId);
}

function addGoal(goal) {
  goals.value = [
    {
      ...goal,
      id: createId('goal')
    },
    ...goals.value
  ];
}

function deleteGoal(goalId) {
  goals.value = goals.value.filter((goal) => goal.id !== goalId);
}

function updateProfile(nextProfile) {
  profile.value = {
    ...profile.value,
    ...nextProfile
  };
}
</script>

<template>
  <AuthPanel
    v-if="!currentUser"
    :error="authError"
    @auth-submit="handleAuth"
    @demo-login="useDemoAccount"
  />

  <div v-else class="app-shell">
    <AppHeader
      :active-tab="activeTab"
      :tabs="tabs"
      :user="currentUser"
      @logout="logout"
      @select-tab="activeTab = $event"
    />

    <main class="workspace" aria-live="polite">
      <DashboardSummary
        v-if="activeTab === 'dashboard'"
        :goals="goals"
        :plans="plans"
        :profile="profile"
        :workouts="workouts"
        @quick-log="activeTab = 'workouts'"
      />

      <PlanManager
        v-if="activeTab === 'plans'"
        :plans="plans"
        @create-plan="addPlan"
        @delete-plan="deletePlan"
        @toggle-plan="togglePlan"
        @update-plan="updatePlan"
      />

      <WorkoutLog
        v-if="activeTab === 'workouts'"
        :plans="plans"
        @create-workout="addWorkout"
      />

      <GoalManager
        v-if="activeTab === 'goals'"
        :goals="goals"
        :profile="profile"
        :workouts="workouts"
        @create-goal="addGoal"
        @delete-goal="deleteGoal"
        @update-profile="updateProfile"
      />

      <ActivityHistory
        v-if="activeTab === 'history'"
        :plans="plans"
        :workouts="workouts"
        @delete-workout="deleteWorkout"
      />
    </main>
  </div>
</template>
