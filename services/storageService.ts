import { MassEvent, User } from '../types';

const USERS_KEY = 'agendaLiturgicaUsers';
const CURRENT_USER_KEY = 'agendaLiturgicaCurrentUser';

function getUserStorageKey(username: string) {
  return `agendaLiturgicaEventos_${username.toUpperCase()}`;
}

export const storageService = {
  // Auth
  getCurrentUser: (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  getUserCount: (): number => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : {};
    return Object.keys(users).length;
  },

  login: (username: string, password: string): boolean => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : {};
    
    if (users[username] && users[username] === password) {
      localStorage.setItem(CURRENT_USER_KEY, username);
      return true;
    }
    return false;
  },

  register: (username: string, password: string): { success: boolean; message: string } => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    if (users[username]) {
      return { success: false, message: 'Usuário já existe.' };
    }

    if (Object.keys(users).length >= 10) {
      return { success: false, message: 'Banco de dados cheio! Limite de 10 usuários atingido.' };
    }

    users[username] = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  },

  updatePassword: (username: string, newPassword: string): boolean => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    if (users[username]) {
      users[username] = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Events
  getEvents: (username: string): MassEvent[] => {
    const key = getUserStorageKey(username);
    const storedEvents = localStorage.getItem(key);
    return storedEvents ? JSON.parse(storedEvents) : [];
  },

  saveEvents: (username: string, events: MassEvent[]) => {
    const key = getUserStorageKey(username);
    localStorage.setItem(key, JSON.stringify(events));
  }
};