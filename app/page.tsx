'use client';

import { useState } from 'react';
import CalendarComponent from './Calendar';

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!showCalendar ? (
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              📅 Prof Scheduler
            </h1>
            <p className="text-xl text-gray-600">
              Gérez vos emplois du temps facilement
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Bienvenue!
            </h2>
            <p className="text-gray-700 mb-4">
              Cette app te permettra de :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Ajouter tes événements (cours, réunions, etc)</li>
              <li>Voir ton emploi du temps par jour/semaine/mois</li>
              <li>Gérer plusieurs écoles à la fois</li>
              <li>Exporter ton calendrier</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => setShowCalendar(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Commencer →
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col">
          <div className="bg-white shadow p-4">
            <button
              onClick={() => setShowCalendar(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              ← Retour
            </button>
          </div>
          <div className="flex-1">
            <CalendarComponent />
          </div>
        </div>
      )}
    </main>
  );
}