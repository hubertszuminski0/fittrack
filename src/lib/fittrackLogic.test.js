import { describe, expect, it } from 'vitest';
import {
  buildAchievementSummary,
  buildWeeklyTimeline,
  evaluateGoals,
  getWeekRange,
  summarizeWorkouts
} from './fittrackLogic';

const referenceDate = new Date('2026-05-06T12:00:00');

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const workouts = [
  {
    id: 'a',
    date: '2026-05-04',
    type: 'Bieganie',
    duration: 40,
    distance: 6,
    calories: 380
  },
  {
    id: 'b',
    date: '2026-05-06',
    type: 'Trening silowy',
    duration: 55,
    distance: 0,
    calories: 420
  },
  {
    id: 'c',
    date: '2026-04-29',
    type: 'Rower',
    duration: 50,
    distance: 15,
    calories: 510
  }
];

describe('fittrack logic', () => {
  it('liczy zakres tygodnia od poniedzialku do niedzieli', () => {
    const range = getWeekRange(referenceDate);

    expect(dateKey(range.start)).toBe('2026-05-04');
    expect(dateKey(range.end)).toBe('2026-05-10');
  });

  it('podsumowuje laczny postep i aktywnosci z obecnego tygodnia', () => {
    const summary = summarizeWorkouts(workouts, referenceDate);

    expect(summary.totalWorkouts).toBe(3);
    expect(summary.totalMinutes).toBe(145);
    expect(summary.currentWeekWorkouts).toBe(2);
    expect(summary.currentWeekDistance).toBe(6);
    expect(summary.averageDuration).toBe(48);
  });

  it('ocenia cele treningowe oraz cel masy ciala', () => {
    const goals = [
      { id: 'weekly', name: '2 treningi', type: 'weekly_workouts', target: 2 },
      { id: 'weight', name: 'Redukcja', type: 'target_weight', startValue: 82, target: 78 }
    ];

    const progress = evaluateGoals(goals, workouts, { weight: 79 }, referenceDate);

    expect(progress[0]).toMatchObject({ completed: true, progress: 100, current: 2 });
    expect(progress[1]).toMatchObject({ completed: false, progress: 75, current: 79 });
  });

  it('buduje dane wykresu tygodniowego i liste osiagniec', () => {
    const timeline = buildWeeklyTimeline(workouts, referenceDate);
    const goals = evaluateGoals([{ id: 'g', name: '2 treningi', type: 'weekly_workouts', target: 2 }], workouts, {}, referenceDate);
    const achievements = buildAchievementSummary(workouts, goals, referenceDate);

    expect(timeline).toHaveLength(7);
    expect(timeline[0]).toMatchObject({ label: 'Pon', minutes: 40 });
    expect(achievements.earned.map((badge) => badge.id)).toContain('goal-crusher');
  });
});
