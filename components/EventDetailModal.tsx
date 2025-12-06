import React from 'react';
import { MassEvent, Repertoire, RepertoireItem } from '../types';
import { X, Edit, Trash2, Calendar, MapPin, User, Music } from 'lucide-react';

interface EventDetailModalProps {
  event: MassEvent | null;
  onClose: () => void;
  onEdit: (event: MassEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onEdit, onDelete }) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const repertoireLabels: Record<keyof Repertoire, string> = {
    entrada: 'Entrada',
    atoPenitencial: 'Ato Penitencial',
    gloria: 'Glória',
    salmo: 'Salmo',
    aclamacao: 'Aclamação',
    ofertorio: 'Ofertório',
    santo: 'Santo',
    comunhao: 'Comunhão',
    final: 'Final'
  };

  const hasRepertoire = (Object.values(event.repertoire) as RepertoireItem[]).some(item => item.name.trim() !== '');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-start p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              {event.equipe}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{event.local}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="text-[#3E2723]" size={20} />
            <span className="font-medium">{formatDate(event.data)} às <span className="text-[#3E2723] font-bold">{event.hora}</span></span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className={`w-5 h-5 rounded-full border border-gray-300 ${
              event.cor === 'Roxo' ? 'bg-purple-700' :
              event.cor === 'Verde' ? 'bg-green-600' : 'bg-yellow-100'
            }`}></div>
            <span>Cor Litúrgica: <strong>{event.cor}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <User className="text-[#3E2723]" size={20} />
            <span>Responsável: <strong>{event.responsavel || 'Não informado'}</strong></span>
          </div>

          <hr />

          <div className="space-y-3">
             <div className="flex items-center gap-2 mb-2 text-[#3E2723]">
               <Music size={20} />
               <h3 className="font-bold text-lg">Repertório</h3>
             </div>

             {!hasRepertoire && <p className="text-gray-400 italic text-sm">Nenhuma música cadastrada.</p>}

             {hasRepertoire && (
               <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
                 {(Object.keys(repertoireLabels) as Array<keyof Repertoire>).map((key) => {
                   const item = event.repertoire[key];
                   if (!item.name) return null;
                   return (
                     <div key={key} className="flex justify-between items-start text-sm border-b border-gray-200 last:border-0 pb-1 last:pb-0">
                        <div>
                          <span className="font-bold text-gray-600 block text-xs uppercase">{repertoireLabels[key]}</span>
                          <span className="text-gray-800">{item.name}</span>
                        </div>
                        {item.key && (
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ml-2">
                            {item.key}
                          </span>
                        )}
                     </div>
                   )
                 })}
               </div>
             )}
          </div>

        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button 
            onClick={() => onEdit(event)}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition"
          >
            <Edit size={18} /> EDITAR
          </button>
          <button 
            onClick={() => onDelete(event.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-red-600 transition"
          >
            <Trash2 size={18} /> EXCLUIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;