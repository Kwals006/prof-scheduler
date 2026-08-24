'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import CalendarComponent from './Calendar';
import AuthModal from './AuthModal';

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setShowCalendar(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowCalendar(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl font-semibold text-gray-700">Chargement...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Modal Auth */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

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
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Ajouter tes événements (cours, réunions, etc)</li>
              <li>Voir ton emploi du temps par jour/semaine/mois</li>
              <li>Gérer plusieurs écoles à la fois</li>
              <li>Exporter ton calendrier</li>
            </ul>

            {/* Boutons selon état connexion */}
            {user ? (
              <div className="space-y-3">
                <p className="text-green-600 font-semibold">
                  ✅ Connecté : {user.email}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
                  >
                    Voir mon calendrier →
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
                >
                  🔐 Se connecter / S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col">
          {/* Top bar */}
          <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setShowCalendar(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            >
              ← Retour
            </button>
            <p className="text-sm text-gray-500 font-semibold">
              👤 {user?.email}
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded"
            >
              🚪 Déconnexion
            </button>
          </div>
          <div className="flex-1">
            <CalendarComponent userId={user?.id} />
          </div>
        </div>
      )}
    </main>
  );
}