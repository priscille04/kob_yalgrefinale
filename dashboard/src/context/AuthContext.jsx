import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, mot_de_passe) => {
        const { data } = await api.post('/auth/login', {
            email,
            mot_de_passe
        });

        const utilisateur = data?.utilisateur;
        const token = data?.token;

        if (!utilisateur || !token) {
            throw new Error("Réponse login invalide");
        }

        // Stockage sécurisé
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(utilisateur));

        setUser(utilisateur);

        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
