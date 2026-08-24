'use client';

import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';

const messages = {
  today: 'Aujourd\'hui',
  previous: 'Précédent',
  next: 'Suivant',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  week: 'Semaine',
  work_week: 'Semaine de travail',
  day: 'Jour',
  month: 'Mois',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  events: 'Événements',
  allDay: 'Toute la journée',
  duration: 'Durée',
  start: 'Début',
  end: 'Fin',
  type: 'Type',
  noEventsInRange: 'Aucun événement dans cette plage',
  showMore: (total: number) => `+${total} autres`,
};

const locales = { fr: fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function CalendarComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start', { ascending: true });

      if (error) {
        console.error('Erreur Supabase:', error);
        return;
      }

      if (data) {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  const handleSaveEvent = async (title: string, start: Date, end: Date) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            start: start.toISOString(),
            end: end.toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Erreur lors de l\'ajout:', error);
        alert('Erreur lors de l\'ajout de l\'événement');
        return;
      }

      if (data && data[0]) {
        const newEvent: Event = {
          id: data[0].id,
          title,
          start,
          end,
        };
        setEvents([...events, newEvent]);
        setShowModal(false);
        setSelectedDate(null);
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
        return;
      }

      setEvents(events.filter((e) => e.id !== event.id));
      setShowDetailModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateEvent = async (
    event: Event,
    title: string,
    start: Date,
    end: Date
  ) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title,
          start: start.toISOString(),
          end: end.toISOString(),
        })
        .eq('id', event.id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour');
        return;
      }

      setEvents(events.map((e) =>
        e.id === event.id ? { ...e, title, start, end } : e
      ));
      setShowDetailModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleNavigate = (action: string) => {
    if (action === 'PREV') {
      if (view === 'month') {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
      } else if (view === 'week') {
        setDate(addDays(date, -7));
      } else {
        setDate(addDays(date, -1));
      }
    } else if (action === 'NEXT') {
      if (view === 'month') {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
      } else if (view === 'week') {
        setDate(addDays(date, 7));
      } else {
        setDate(addDays(date, 1));
      }
    } else if (action === 'TODAY') {
      setDate(new Date());
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-semibold text-gray-700">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white">

      {/* Modal ajout */}
      {showModal && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => {
            setShowModal(false);
            setSelectedDate(null);
          }}
          onSave={handleSaveEvent}
        />
      )}

      {/* Modal détail/modification */}
      {showDetailModal && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
        />
      )}

      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleNavigate('PREV')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            ← Précédent
          </button>
          <button
            onClick={() => handleNavigate('TODAY')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => handleNavigate('NEXT')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Suivant →
          </button>
        </div>

        <div className="text-lg font-bold text-gray-700">
          {view === 'month'
            ? format(date, 'MMMM yyyy', { locale: fr })
            : format(date, 'd MMMM yyyy', { locale: fr })
          }
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded font-semibold ${
              view === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded font-semibold ${
              view === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded font-semibold ${
              view === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Jour
          </button>
        </div>
      </div>

      {/* Calendrier */}
      <div className="flex-1 overflow-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={['month', 'week', 'day']}
          toolbar={false}
          step={30}
          timeslots={2}
          messages={messages}
          formats={{
            monthHeaderFormat: (date) => format(date, 'MMMM yyyy', { locale: fr }),
            weekdayFormat: (date) => format(date, 'EEEE', { locale: fr }),
            dayFormat: (date) => format(date, 'd', { locale: fr }),
            dayHeaderFormat: (date) => format(date, 'EEEE d MMMM yyyy', { locale: fr }),
            monthDateFormat: (date) => format(date, 'd', { locale: fr }),
            weekDateFormat: (date) => format(date, 'd MMMM', { locale: fr }),
            timeGutterFormat: (date) => format(date, 'HH:mm', { locale: fr }),
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'HH:mm', { locale: fr })} - ${format(end, 'HH:mm', { locale: fr })}`,
          }}
        />
      </div>
    </div>
  );
}