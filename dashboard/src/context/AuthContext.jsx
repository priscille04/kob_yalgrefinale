import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// SAFE PARSE (évite JSON.parse(undefined))
const getStoredUser = () => {
    try {
        const stored = localStorage.getItem("user");
        if (!stored || stored === "undefined") return null;
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => getStoredUser());

    // LOGIN CLASSIQUE (email + mot_de_passe)
    const login = async (email, mot_de_passe) => {
        const { data } = await api.post("/login", {
            email,
            mot_de_passe, //  doit correspondre à Laravel
        });

        const utilisateur = data?.utilisateur;
        const token = data?.token;

        if (!utilisateur || !token) {
            throw new Error("Réponse login invalide");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(utilisateur));

        setUser(utilisateur);

        return data;
    };

    // LOGIN ADMIN (OTP)
    const loginWithToken = ({ utilisateur, token }) => {
        if (!utilisateur || !token) {
            throw new Error("Réponse login invalide");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(utilisateur));

        setUser(utilisateur);

        return { utilisateur, token };
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                loginWithToken,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);