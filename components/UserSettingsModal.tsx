import React, { useState } from 'react';
import { X, Save, Lock } from 'lucide-react';
import { storageService } from '../services/storageService';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose, username }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    if (!newPassword) {
      setMessage({ type: 'error', text: 'Digite uma nova senha.' });
      return;
    }

    const success = storageService.updatePassword(username, newPassword);
    if (success) {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(onClose, 1500);
    } else {
      setMessage({ type: 'error', text: 'Erro ao atualizar senha.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lock size={20} /> Configurações
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-gray-600">Alterar senha para: <strong>{username}</strong></p>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3E2723] focus:outline-none"
            />
          </div>

          {message && (
            <div className={`p-2 rounded text-sm text-center font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#3E2723] text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-[#5D4037] transition-colors"
          >
             <Save size={18} /> SALVAR NOVA SENHA
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettingsModal;