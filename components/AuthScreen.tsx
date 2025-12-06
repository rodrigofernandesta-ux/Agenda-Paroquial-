import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { LogIn, UserPlus, Database } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (username: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    setUserCount(storageService.getUserCount());
  }, [isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Preencha usuário e senha.');
      return;
    }

    if (isLogin) {
      const success = storageService.login(username, password);
      if (success) {
        onLoginSuccess(username);
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } else {
      const result = storageService.register(username, password);
      if (result.success) {
        alert(result.message);
        setIsLogin(true);
        setPassword('');
        setUserCount(storageService.getUserCount()); // Update count after register
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#3E2723] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-8">Agenda Paroquial</h2>
        
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-center">
            {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center text-sm font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full mt-6 py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 ${
              isLogin 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isLogin ? <><LogIn size={20} /> ENTRAR</> : <><UserPlus size={20} /> CADASTRAR</>}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
            <Database size={14} />
            <span>Banco de dados: {userCount}/10 usuários</span>
        </div>

        <p 
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setUsername('');
            setPassword('');
          }}
          className="text-center mt-6 text-sm underline cursor-pointer hover:text-white/80"
        >
          {isLogin ? 'Ainda não tenho cadastro' : 'Já tenho cadastro'}
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;