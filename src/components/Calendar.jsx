import React, { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval,
  isToday,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const BINDER_RINGS = 24;

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [range, setRange] = useState({ start: null, end: null });
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDateClick = (date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else {
      if (date < range.start) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ ...range, end: date });
      }
    }
  };

  const isInRange = (date) => {
    if (!range.start || !range.end) return false;
    return isWithinInterval(date, { start: range.start, end: range.end });
  };

  const isStart = (date) => range.start && isSameDay(date, range.start);
  const isEnd = (date) => range.end && isSameDay(date, range.end);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const addNote = () => {
    if (!newNoteContent.trim()) return;
    const dateStr = range.start ? format(range.start, 'yyyy-MM-dd') : format(currentMonth, 'yyyy-MM');
    const newNote = {
      id: crypto.randomUUID(),
      date: dateStr,
      content: newNoteContent,
    };
    setNotes([...notes, newNote]);
    setNewNoteContent('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const currentMonthNotes = useMemo(() => {
    const monthKey = format(currentMonth, 'yyyy-MM');
    return notes.filter(n => n.date.startsWith(monthKey));
  }, [notes, currentMonth]);

  const clearRange = () => setRange({ start: null, end: null });

  const goToToday = () => {
    setCurrentMonth(new Date());
    setRange({ start: new Date(), end: null });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-5xl">
        {/* Binder Rings */}
        <div className="absolute -top-4 left-0 right-0 flex justify-around px-8 z-20 pointer-events-none">
          {Array.from({ length: BINDER_RINGS }).map((_, i) => (
            <div key={i} className="w-1.5 h-8 bg-zinc-800 rounded-full shadow-md" />
          ))}
        </div>

        {/* Main Calendar Card */}
        <motion.div 
          layout
          className="calendar-paper bg-white rounded-lg overflow-hidden flex flex-col"
        >
          {/* Hero Section */}
          <div className="relative h-64 md:h-96 overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={format(currentMonth, 'MMMM-yyyy')}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.6 }}
                src={`https://picsum.photos/seed/${format(currentMonth, 'MMMM-yyyy')}/1200/800`}
                alt="Calendar Hero"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Geometric Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M0 60 L40 80 L100 50 L100 100 L0 100 Z" 
                  fill="var(--color-calendar-blue)" 
                  fillOpacity="0.8"
                />
                <path 
                  d="M0 70 L30 90 L80 60 L100 80 L100 100 L0 100 Z" 
                  fill="white" 
                  fillOpacity="0.2"
                />
              </svg>
            </div>

            {/* Month/Year Display */}
            <div className="absolute bottom-8 right-8 text-right text-white z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={format(currentMonth, 'yyyy')}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-2xl font-display font-medium opacity-80"
                >
                  {format(currentMonth, 'yyyy')}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={format(currentMonth, 'MMMM')}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-7xl font-display font-bold uppercase tracking-tighter"
                >
                  {format(currentMonth, 'MMMM')}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls Overlay */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={prevMonth}
                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Today Button */}
            <button 
              onClick={goToToday}
              className="absolute top-8 right-8 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
            >
              Today
            </button>
          </div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={format(currentMonth, 'MM-yyyy')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row min-h-[400px]"
            >
            {/* Notes Section */}
            <div className="w-full md:w-1/3 p-8 border-r border-zinc-100 bg-zinc-50/50 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-400">Notes</h3>
                <div className="flex gap-2">
                  {range.start && (
                    <button 
                      onClick={clearRange}
                      className="text-[10px] font-bold text-zinc-400 hover:text-calendar-blue uppercase tracking-widest transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                  <Edit3 size={18} className="text-zinc-300" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder={range.start ? `Note for ${format(range.start, 'MMM d')}...` : "General monthly note..."}
                    className="w-full min-h-[140px] p-4 bg-white border border-zinc-200 rounded-lg shadow-sm focus:ring-2 focus:ring-calendar-blue focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed"
                  />
                  <button 
                    onClick={addNote}
                    disabled={!newNoteContent.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-calendar-blue text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="relative min-h-[200px]">
                  {/* Lined paper effect background */}
                  <div className="absolute inset-0 notes-lines opacity-50 pointer-events-none" />
                  
                  <div className="relative space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {currentMonthNotes.length === 0 ? (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-zinc-300 text-sm italic pt-2"
                        >
                          No notes for this month yet...
                        </motion.p>
                      ) : (
                        currentMonthNotes.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="group p-3 bg-white/80 backdrop-blur-sm border border-zinc-100 rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-calendar-blue uppercase tracking-widest">
                                {note.date.length > 7 ? format(parseISO(note.date), 'MMM d') : 'Monthly'}
                              </span>
                              <button 
                                onClick={() => deleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition-opacity"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">{note.content}</p>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-8">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-6">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                  <div 
                    key={day} 
                    className={cn(
                      "text-center text-[10px] font-bold tracking-[0.2em] pb-2 border-b border-zinc-50",
                      i >= 5 ? "text-calendar-blue" : "text-zinc-400"
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-7 gap-y-2">
                {days.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isWeekend = i % 7 >= 5;
                  const selected = isStart(day) || isEnd(day);
                  const inRange = isInRange(day);
                  const today = isToday(day);

                  return (
                    <div key={day.toString()} className="relative py-1">
                      {/* Range Highlight Background */}
                      {inRange && (
                        <div className={cn(
                          "absolute inset-y-1 bg-blue-50/80 z-0",
                          isStart(day) ? "left-1/2 right-0 rounded-l-none" : 
                          isEnd(day) ? "right-1/2 left-0 rounded-r-none" : "left-0 right-0"
                        )} />
                      )}
                      
                      <button
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "relative z-10 w-11 h-11 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                          !isCurrentMonth && "text-zinc-200",
                          isCurrentMonth && !selected && !isWeekend && "text-zinc-800 hover:bg-zinc-100",
                          isCurrentMonth && isWeekend && !selected && "text-calendar-blue hover:bg-blue-50",
                          selected && "bg-calendar-blue text-white shadow-lg scale-110 ring-4 ring-blue-100",
                          today && !selected && "ring-2 ring-calendar-blue ring-offset-2"
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

        {/* Footer Shadow/Depth Effect */}
        <div className="h-4 bg-white/50 rounded-b-lg mx-4 shadow-sm" />
        <div className="h-4 bg-white/30 rounded-b-lg mx-8 shadow-sm" />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
