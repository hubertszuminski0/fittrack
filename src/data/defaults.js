export const activityTypes = [
  'Trening silowy',
  'Bieganie',
  'Rower',
  'Mobilnosc',
  'Plywanie',
  'HIIT'
];

const oneDay = 24 * 60 * 60 * 1000;

function isoDaysAgo(days) {
  const date = new Date(Date.now() - days * oneDay);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialWorkspace() {
  const plans = [
    {
      id: 'plan-strength',
      name: 'Silownia: sila calego ciala',
      type: 'Trening silowy',
      days: ['Pon', 'Sro', 'Pia'],
      duration: 55,
      intensity: 'Srednia',
      exercises: ['Przysiad 4x6', 'Wyciskanie 4x8', 'Wioslowanie 4x8', 'Deska 3x45 s'],
      active: true
    },
    {
      id: 'plan-cardio',
      name: 'Bieganie progresywne',
      type: 'Bieganie',
      days: ['Wt', 'Sob'],
      duration: 35,
      intensity: 'Rosnaca',
      exercises: ['10 min spokojnie', '20 min tempo konwersacyjne', '5 min schlodzenia'],
      active: true
    }
  ];

  return {
    profile: {
      name: 'Student FitTrack',
      weight: 79.4,
      height: 178,
      targetWeight: 77.5
    },
    plans,
    workouts: [
      {
        id: 'workout-1',
        planId: 'plan-strength',
        date: isoDaysAgo(1),
        type: 'Trening silowy',
        duration: 58,
        distance: 0,
        calories: 430,
        intensity: 'Srednia',
        notes: 'Udalo sie dolozyc 2,5 kg w przysiadzie.'
      },
      {
        id: 'workout-2',
        planId: 'plan-cardio',
        date: isoDaysAgo(3),
        type: 'Bieganie',
        duration: 34,
        distance: 5.4,
        calories: 360,
        intensity: 'Lekka',
        notes: 'Rowny rytm, bez przerw.'
      },
      {
        id: 'workout-3',
        planId: '',
        date: isoDaysAgo(6),
        type: 'Mobilnosc',
        duration: 22,
        distance: 0,
        calories: 110,
        intensity: 'Lekka',
        notes: 'Krotka sesja po nauce.'
      },
      {
        id: 'workout-4',
        planId: 'plan-cardio',
        date: isoDaysAgo(9),
        type: 'Rower',
        duration: 47,
        distance: 13.2,
        calories: 390,
        intensity: 'Srednia',
        notes: 'Trasa miejska, sporo podjazdow.'
      }
    ],
    goals: [
      {
        id: 'goal-weekly-trainings',
        name: 'Minimum 4 treningi tygodniowo',
        type: 'weekly_workouts',
        target: 4,
        dueDate: isoDaysAgo(-14)
      },
      {
        id: 'goal-distance',
        name: '20 km aktywnosci w tym tygodniu',
        type: 'weekly_distance',
        target: 20,
        dueDate: isoDaysAgo(-7)
      },
      {
        id: 'goal-weight',
        name: 'Zejscie do 77,5 kg',
        type: 'target_weight',
        startValue: 81,
        target: 77.5,
        dueDate: isoDaysAgo(-35)
      }
    ]
  };
}
