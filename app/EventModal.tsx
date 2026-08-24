'use client';

interface EventModalProps {
  selectedDate: Date | null;
  onClose: () => void;
  onSave: (title: string, start: Date, end: Date) => void;
}

export default function EventModal({ selectedDate, onClose, onSave }: EventModalProps) {
  if (!selectedDate) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const startTime = (form.elements.namedItem('startTime') as HTMLInputElement).value;
    const endTime = (form.elements.namedItem('endTime') as HTMLInputElement).value;

    if (!title || !startTime || !endTime) {
      alert('Remplis tous les champs!');
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = new Date(selectedDate);
    start.setHours(startH, startM, 0);

    const end = new Date(selectedDate);
    end.setHours(endH, endM, 0);

    if (end <= start) {
      alert('L\'heure de fin doit être après l\'heure de début!');
      return;
    }

    onSave(title, start, end);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            ➕ Ajouter un événement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom de l'événement
            </label>
            <input
              type="text"
              name="title"
              placeholder="Ex: Cours Mathématiques"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Date (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={selectedDate.toLocaleDateString('fr-BE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
            />
          </div>

          {/* Heures */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                name="startTime"
                defaultValue="09:00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                name="endTime"
                defaultValue="10:00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sauvegarder ✅
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}