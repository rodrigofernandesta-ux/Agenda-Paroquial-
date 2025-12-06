import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import EventFormModal from './components/EventFormModal';
import EventDetailModal from './components/EventDetailModal';
import UserSettingsModal from './components/UserSettingsModal';
import { storageService } from './services/storageService';
import { MassEvent, TabType, LiturgicalColor } from './types';
import { Calendar, BookOpen, Music, LogOut, Plus, Filter, Printer, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [events, setEvents] = useState<MassEvent[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('missas');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MassEvent | null>(null); // For details
  const [editingEvent, setEditingEvent] = useState<MassEvent | null>(null); // For edit form
  
  // Filter state
  const [filterColor, setFilterColor] = useState<string>('todos');

  // Initialization
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadEvents(currentUser);
    }
  }, []);

  const loadEvents = (username: string) => {
    const loadedEvents = storageService.getEvents(username);
    setEvents(loadedEvents);
  };

  const handleLoginSuccess = (username: string) => {
    setUser(username);
    loadEvents(username);
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      storageService.logout();
      setUser(null);
      setEvents([]);
      setCurrentTab('missas');
    }
  };

  const handleSaveEvent = (event: MassEvent) => {
    if (!user) return;
    
    let updatedEvents = [...events];
    const index = updatedEvents.findIndex(e => e.id === event.id);
    
    if (index >= 0) {
      updatedEvents[index] = event; // Update
    } else {
      updatedEvents.push(event); // Create
    }

    storageService.saveEvents(user, updatedEvents);
    setEvents(updatedEvents);
    setIsFormOpen(false);
    setEditingEvent(null);
    setSelectedEvent(null); // Close detail if open
  };

  const handleDeleteEvent = (id: string) => {
    if (!user) return;
    if (!confirm('Tem certeza que deseja deletar esta Missa?')) return;

    const updatedEvents = events.filter(e => e.id !== id);
    storageService.saveEvents(user, updatedEvents);
    setEvents(updatedEvents);
    setSelectedEvent(null);
  };

  const handleOpenEdit = (event: MassEvent) => {
    setEditingEvent(event);
    setSelectedEvent(null); // Close details
    setIsFormOpen(true);
  };

  // Helper for color styles
  const getEventStyle = (color: LiturgicalColor) => {
    switch (color) {
      case LiturgicalColor.ROXO: return 'border-l-[6px] border-purple-800';
      case LiturgicalColor.BRANCO: return 'border-l-[6px] border-yellow-400 bg-yellow-50/50';
      case LiturgicalColor.VERDE: return 'border-l-[6px] border-green-600';
      default: return 'border-l-[6px] border-gray-400';
    }
  };

  // Filtered and Sorted Events
  const filteredEvents = events
    .filter(e => filterColor === 'todos' || e.cor === filterColor)
    .sort((a, b) => new Date(`${a.data}T${a.hora}`).getTime() - new Date(`${b.data}T${b.hora}`).getTime());


  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f9] pb-[80px]"> {/* padding bottom for footer */}
      
      {/* Header */}
      <header className="bg-[#3E2723] text-white p-4 shadow-md sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Agenda de {user}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-transparent p-2 rounded hover:bg-white/10 transition-colors"
            title="Configurações"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="bg-transparent border border-white/50 px-3 py-1 rounded text-sm hover:bg-white/10 flex items-center gap-1 transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      {/* Tabs Content */}
      <main className="w-full max-w-3xl mx-auto">
        
        {currentTab === 'missas' && (
          <>
            {/* Toolbar */}
            <div className="bg-white p-3 border-b flex justify-between items-center shadow-sm sticky top-[60px] z-10">
              <div className="relative flex-1 max-w-[200px]">
                <Filter size={16} className="absolute left-2 top-3 text-gray-500" />
                <select 
                  className="w-full pl-8 pr-2 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#3E2723] appearance-none"
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                >
                  <option value="todos">Todas as Cores</option>
                  <option value={LiturgicalColor.ROXO}>Roxo</option>
                  <option value={LiturgicalColor.BRANCO}>Branco</option>
                  <option value={LiturgicalColor.VERDE}>Verde</option>
                </select>
              </div>
              <button onClick={() => window.print()} className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Printer size={20} />
              </button>
            </div>

            {/* List */}
            <div className="p-3 space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p>Nenhuma Missa agendada.</p>
                  <p className="text-sm">Clique no "+" para adicionar.</p>
                </div>
              ) : (
                filteredEvents.map(event => {
                   const [y, m, d] = event.data.split('-');
                   const dateObj = new Date(event.data);
                   const weekDay = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                   
                   return (
                    <div 
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`bg-white rounded-lg shadow-sm p-3 flex cursor-pointer hover:shadow-md transition-shadow relative ${getEventStyle(event.cor)}`}
                    >
                      {/* Date Block */}
                      <div className="pr-4 mr-4 border-r border-gray-100 flex flex-col items-center justify-center min-w-[70px]">
                        <span className="text-xs text-gray-500 uppercase font-bold">{weekDay}</span>
                        <span className="text-xl font-bold text-gray-800">{d}/{m}</span>
                        <span className="text-xs text-[#3E2723] font-bold mt-1">{event.hora}</span>
                      </div>
                      
                      {/* Info Block */}
                      <div className="flex-1">
                        <h4 className="font-bold text-[#3E2723] text-sm mb-1">{event.equipe}</h4>
                        <p className="text-sm text-gray-700 font-medium">{event.local}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Resp: {event.responsavel || 'N/A'}
                        </p>
                      </div>

                      {/* Edit Icon hint */}
                      <div className="absolute top-2 right-2 text-gray-300">
                        <Plus size={14} className="transform rotate-45" />
                      </div>
                    </div>
                   );
                })
              )}
            </div>

            {/* FAB */}
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsFormOpen(true);
              }}
              className="fixed bottom-24 right-5 w-14 h-14 bg-green-400 text-gray-900 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold hover:scale-105 transition-transform z-30"
            >
              <Plus size={30} />
            </button>
          </>
        )}

        {currentTab === 'liturgia' && (
          <div className="h-[calc(100vh-140px)] w-full bg-white">
            <iframe 
              src="https://liturgia.cancaonova.com/pb/" 
              title="Liturgia Diária"
              className="w-full h-full border-none"
            />
          </div>
        )}

        {currentTab === 'musica' && (
          <div className="h-[calc(100vh-140px)] w-full bg-white">
            <iframe 
              src="https://musicasparamissa.com.br/" 
              title="Músicas para Missa"
              className="w-full h-full border-none"
            />
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setCurrentTab('missas')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${currentTab === 'missas' ? 'text-[#3E2723] border-t-2 border-[#3E2723]' : 'text-gray-500'}`}
          >
            <Calendar size={20} />
            <span>Missas</span>
          </button>
          <button 
            onClick={() => setCurrentTab('liturgia')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${currentTab === 'liturgia' ? 'text-[#3E2723] border-t-2 border-[#3E2723]' : 'text-gray-500'}`}
          >
            <BookOpen size={20} />
            <span>Liturgia</span>
          </button>
          <button 
            onClick={() => setCurrentTab('musica')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${currentTab === 'musica' ? 'text-[#3E2723] border-t-2 border-[#3E2723]' : 'text-gray-500'}`}
          >
            <Music size={20} />
            <span>Música</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <EventFormModal 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }} 
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteEvent}
      />

      <UserSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        username={user || ''}
      />

    </div>
  );
};

export default App;