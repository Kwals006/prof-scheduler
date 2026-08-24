'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { EVENT_TYPES } from './eventTypes';

registerLocale('fr', fr);

interface EventModalProps {
  selectedDate: Date | null;
  onClose: () => void;
  onSave: (title: string, start: Date, end: Date, type: string) => void;
}

export default function EventModal({ selectedDate, onClose, onSave }: EventModalProps) {
  if (!selectedDate) return null;

  const defaultStart = new Date(selectedDate);
  defaultStart.setHours(9, 0, 0);

  const defaultEnd = new Date(selectedDate);
  defaultEnd.setHours(10, 0, 0);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);
  const [type, setType] = useState('cours');

  const handleSubmit = () => {
    if (!title) {
      alert('Remplis le nom de l\'événement!');
      return;
    }

    if (endDate <= startDate) {
      alert('L\'heure de fin doit être après l\'heure de début!');
      return;
    }

    onSave(title, startDate, endDate, type);
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
              placeholder="Ex: Cours Mathématiques"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type d'événement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  style={{
                    backgroundColor: type === t.value ? t.color : t.bgColor,
                    color: type === t.value ? 'white' : t.textColor,
                    borderColor: t.color,
                  }}
                  className="border-2 rounded-lg px-3 py-2 font-semibold text-sm transition-all"
                >
                  {t.label}
                </button>
              ))}
            </div>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              placeholderText="Choisir une date"
            />
          </div>

          {/* Heures */}
          <div className="flex gap-4">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
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
      </div>
    </div>
  );
}