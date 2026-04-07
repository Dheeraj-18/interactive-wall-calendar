import Calendar from './components/Calendar';

export default function App() {
  return (
    <main className="min-h-screen bg-zinc-100 selection:bg-calendar-blue/30">
      {/* Wall Texture/Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
      
      <div className="relative z-10 py-12 px-4">
        <header className="max-w-5xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-800 tracking-tight mb-4">
            Interactive Wall Calendar
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            A polished digital interpretation of the classic physical wall calendar. 
            Select date ranges, jot down notes, and navigate through the seasons.
          </p>
        </header>

        <Calendar />

        <footer className="max-w-5xl mx-auto mt-24 pb-12 text-center border-t border-zinc-200 pt-8">
          <p className="text-sm text-zinc-400 font-medium uppercase tracking-widest">
            Built with React, Tailwind & Motion
          </p>
        </footer>
      </div>
    </main>
  );
}
