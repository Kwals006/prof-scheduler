export const EVENT_TYPES = [
  {
    value: 'cours',
    label: '📚 Cours',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1D4ED8',
  },
  {
    value: 'reunion',
    label: '🤝 Réunion',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
  },
  {
    value: 'permanence',
    label: '🏫 Permanence',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    textColor: '#15803D',
  },
  {
    value: 'examen',
    label: '📝 Examen',
    color: '#EAB308',
    bgColor: '#FEF9C3',
    textColor: '#A16207',
  },
  {
    value: 'autre',
    label: '📌 Autre',
    color: '#A855F7',
    bgColor: '#F3E8FF',
    textColor: '#7E22CE',
  },
];

export const getEventType = (value: string) => {
  return EVENT_TYPES.find((t) => t.value === value) || EVENT_TYPES[0];
};