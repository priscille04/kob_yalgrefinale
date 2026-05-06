import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const roles = ['admin', 'producteur']; // Rôles autorisés à se connecter

    const login = async (email, mot_de_passe) => {
        const { data } = await api.post('/auth/login', { email, mot_de_passe });
        
        if (!roles.includes(data.utilisateur.role)
        ) {
            throw new Error('Accès réservé aux administrateurs');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.utilisateur));
        setUser(data.utilisateur);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);