const dayMs = 24 * 60 * 60 * 1000;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateOnly(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function getWeekRange(referenceDate = new Date()) {
  const end = toDateOnly(referenceDate);
  const mondayOffset = (end.getDay() + 6) % 7;
  const start = new Date(end.getTime() - mondayOffset * dayMs);
  const finish = new Date(start.getTime() + 6 * dayMs);
  return { start, end: finish };
}

export function summarizeWorkouts(workouts, referenceDate = new Date()) {
  const { start, end } = getWeekRange(referenceDate);
  const activityBreakdown = {};
  const workoutDays = new Set();

  const totals = workouts.reduce(
    (summary, workout) => {
      const date = toDateOnly(workout.date);
      const duration = toNumber(workout.duration);
      const distance = toNumber(workout.distance);
      const calories = toNumber(workout.calories);
      const inWeek = date >= start && date <= end;

      summary.totalWorkouts += 1;
      summary.totalMinutes += duration;
      summary.totalDistance += distance;
      summary.totalCalories += calories;

      if (inWeek) {
        summary.currentWeekWorkouts += 1;
        summary.currentWeekMinutes += duration;
        summary.currentWeekDistance += distance;
      }

      const key = workout.type || 'Inne';
      activityBreakdown[key] ??= { count: 0, minutes: 0, distance: 0 };
      activityBreakdown[key].count += 1;
      activityBreakdown[key].minutes += duration;
      activityBreakdown[key].distance += distance;

      workoutDays.add(toDateKey(date));
      return summary;
    },
    {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalDistance: 0,
      totalCalories: 0,
      currentWeekWorkouts: 0,
      currentWeekMinutes: 0,
      currentWeekDistance: 0,
      activityBreakdown
    }
  );

  return {
    ...totals,
    averageDuration: totals.totalWorkouts ? Math.round(totals.totalMinutes / totals.totalWorkouts) : 0,
    currentStreak: calculateCurrentStreak(workoutDays, referenceDate)
  };
}

export function buildWeeklyTimeline(workouts, referenceDate = new Date()) {
  const { start } = getWeekRange(referenceDate);
  const days = ['Pon', 'Wt', 'Sro', 'Czw', 'Pia', 'Sob', 'Nd'];

  return days.map((label, index) => {
    const date = new Date(start.getTime() + index * dayMs);
    const key = toDateKey(date);
    const dayWorkouts = workouts.filter((workout) => workout.date === key);

    return {
      label,
      date: key,
      count: dayWorkouts.length,
      minutes: dayWorkouts.reduce((sum, workout) => sum + toNumber(workout.duration), 0),
      distance: dayWorkouts.reduce((sum, workout) => sum + toNumber(workout.distance), 0)
    };
  });
}

export function evaluateGoals(goals, workouts, profile = {}, referenceDate = new Date()) {
  const summary = summarizeWorkouts(workouts, referenceDate);

  return goals.map((goal) => {
    let current = 0;
    let unit = '';
    let completed = false;

    if (goal.type === 'weekly_workouts') {
      current = summary.currentWeekWorkouts;
      unit = 'treningow';
      completed = current >= toNumber(goal.target);
    }

    if (goal.type === 'weekly_distance') {
      current = Number(summary.currentWeekDistance.toFixed(1));
      unit = 'km';
      completed = current >= toNumber(goal.target);
    }

    if (goal.type === 'total_minutes') {
      current = summary.totalMinutes;
      unit = 'min';
      completed = current >= toNumber(goal.target);
    }

    if (goal.type === 'target_weight') {
      current = toNumber(profile.weight);
      unit = 'kg';
      const start = toNumber(goal.startValue || profile.weight);
      const target = toNumber(goal.target);
      const span = Math.abs(start - target) || 1;
      const moved = target < start ? start - current : current - start;
      const progress = clamp((moved / span) * 100);

      return {
        ...goal,
        current,
        unit,
        completed: target < start ? current <= target : current >= target,
        progress: Math.round(progress),
        remaining: Math.max(0, Math.abs(target - current))
      };
    }

    const target = toNumber(goal.target);
    const progress = target ? clamp((current / target) * 100) : 0;

    return {
      ...goal,
      current,
      unit,
      completed,
      progress: Math.round(progress),
      remaining: Math.max(0, target - current)
    };
  });
}

export function buildAchievementSummary(workouts, goalProgress, referenceDate = new Date()) {
  const summary = summarizeWorkouts(workouts, referenceDate);
  const badges = [
    {
      id: 'first-workout',
      title: 'Pierwszy trening',
      earned: summary.totalWorkouts >= 1
    },
    {
      id: 'weekly-consistency',
      title: 'Regularny tydzien',
      earned: summary.currentWeekWorkouts >= 3
    },
    {
      id: 'distance-builder',
      title: '20 km ruchu',
      earned: summary.totalDistance >= 20
    },
    {
      id: 'goal-crusher',
      title: 'Cel zrealizowany',
      earned: goalProgress.some((goal) => goal.completed)
    }
  ];

  return {
    earned: badges.filter((badge) => badge.earned),
    locked: badges.filter((badge) => !badge.earned),
    completionRate: Math.round((badges.filter((badge) => badge.earned).length / badges.length) * 100)
  };
}

function calculateCurrentStreak(workoutDays, referenceDate) {
  if (!workoutDays.size) {
    return 0;
  }

  let cursor = toDateOnly(referenceDate);
  let streak = 0;

  for (let index = 0; index < 60; index += 1) {
    const key = toDateKey(cursor);

    if (workoutDays.has(key)) {
      streak += 1;
      cursor = new Date(cursor.getTime() - dayMs);
      continue;
    }

    if (streak === 0 && index === 0) {
      cursor = new Date(cursor.getTime() - dayMs);
      continue;
    }

    break;
  }

  return streak;
}
