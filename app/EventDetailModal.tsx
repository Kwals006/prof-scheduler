'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';

registerLocale('fr', fr);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onDelete: (event: Event) => void;
  onUpdate: (event: Event, title: string, start: Date, end: Date) => void;
}

export default function EventDetailModal({
  event,
  onClose,
  onDelete,
  onUpdate,
}: EventDetailModalProps) {
  if (!event) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [startDate, setStartDate] = useState<Date>(event.start);
  const [endDate, setEndDate] = useState<Date>(event.end);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = () => {
    if (!title) {
      alert('Remplis le nom de l\'événement!');
      return;
    }

    if (endDate <= startDate) {
      alert('L\'heure de fin doit être après l\'heure de début!');
      return;
    }

    onUpdate(event, title, startDate, endDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? '✏️ Modifier' : '📅 Événement'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Mode lecture */}
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">
                Événement
              </label>
              <p className="text-lg font-bold text-gray-900">{event.title}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">
                Date
              </label>
              <p className="text-gray-700">
                {event.start.toLocaleDateString('fr-BE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">
                Horaire
              </label>
              <p className="text-gray-700">
                {formatTime(event.start)} → {formatTime(event.end)}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                Fermer
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => onDelete(event)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ) : (
          /* Mode édition */
          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nom de l'événement
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    const newStart = new Date(date);
                    newStart.setHours(startDate.getHours(), startDate.getMinutes(), 0);
                    const newEnd = new Date(date);
                    newEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0);
                    setStartDate(newStart);
                    setEndDate(newEnd);
                  }
                }}
                locale="fr"
                dateFormat="EEEE d MMMM yyyy"
                calendarStartDay={1}
                inline={false}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                placeholderText="Choisir une date"
              />
            </div>

            {/* Heure début */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Heure de début
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date) setStartDate(date);
                }}
                locale="fr"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Heure fin */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Heure de fin
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  if (date) setEndDate(date);
                }}
                locale="fr"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Sauvegarder ✅
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}