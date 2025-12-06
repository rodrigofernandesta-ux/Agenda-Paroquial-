import React, { useState, useEffect } from 'react';
import { MassEvent, LiturgicalColor, Repertoire } from '../types';
import { X, Save, Music } from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: MassEvent) => void;
  initialData?: MassEvent | null;
}

const emptyRepertoire: Repertoire = {
  entrada: { name: '', key: '' },
  atoPenitencial: { name: '', key: '' },
  gloria: { name: '', key: '' },
  salmo: { name: '', key: '' },
  aclamacao: { name: '', key: '' },
  ofertorio: { name: '', key: '' },
  santo: { name: '', key: '' },
  comunhao: { name: '', key: '' },
  final: { name: '', key: '' },
};

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<MassEvent>>({
    cor: LiturgicalColor.VERDE,
    repertoire: emptyRepertoire
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData))); // Deep copy
      } else {
        setFormData({
          data: '',
          hora: '',
          cor: LiturgicalColor.VERDE,
          local: '',
          equipe: '',
          responsavel: '',
          repertoire: emptyRepertoire
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRepertoireChange = (category: keyof Repertoire, field: 'name' | 'key', value: string) => {
    setFormData(prev => ({
      ...prev,
      repertoire: {
        ...(prev.repertoire || emptyRepertoire),
        [category]: {
          ...(prev.repertoire || emptyRepertoire)[category],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data || !formData.hora || !formData.local || !formData.equipe) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const eventToSave: MassEvent = {
      id: formData.id || crypto.randomUUID(),
      data: formData.data!,
      hora: formData.hora!,
      cor: formData.cor as LiturgicalColor,
      local: formData.local!,
      equipe: formData.equipe!,
      responsavel: formData.responsavel || '',
      repertoire: formData.repertoire || emptyRepertoire
    };

    onSave(eventToSave);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? '✏️ Editar Missa' : '➕ Adicionar Missa'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="overflow-y-auto p-4 flex-1">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cor Litúrgica</label>
              <select
                name="cor"
                value={formData.cor}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
              >
                <option value={LiturgicalColor.ROXO}>Roxo (Advento/Quaresma)</option>
                <option value={LiturgicalColor.BRANCO}>Branco (Natal/Páscoa/Festas)</option>
                <option value={LiturgicalColor.VERDE}>Verde (Tempo Comum)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Local da Missa</label>
              <input
                type="text"
                name="local"
                value={formData.local || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Equipe</label>
              <input
                type="text"
                name="equipe"
                value={formData.equipe || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Responsável</label>
              <input
                type="text"
                name="responsavel"
                value={formData.responsavel || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
              />
            </div>

            <hr className="my-4 border-gray-200" />
            
            <div className="flex items-center gap-2 mb-2 text-[#3E2723]">
               <Music size={20} />
               <h3 className="font-bold text-lg">Repertório</h3>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {(Object.keys(repertoireLabels) as Array<keyof Repertoire>).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{repertoireLabels[key]}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Música"
                      value={formData.repertoire?.[key].name || ''}
                      onChange={(e) => handleRepertoireChange(key, 'name', e.target.value)}
                      className="flex-grow p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#3E2723]"
                    />
                    <input 
                      type="text" 
                      placeholder="Tom"
                      value={formData.repertoire?.[key].key || ''}
                      onChange={(e) => handleRepertoireChange(key, 'key', e.target.value)}
                      className="w-20 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#3E2723]"
                    />
                  </div>
                </div>
              ))}
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
           <button
             type="submit"
             form="event-form"
             className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition-colors w-full justify-center sm:w-auto"
           >
             <Save size={20} /> SALVAR MISSA
           </button>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;