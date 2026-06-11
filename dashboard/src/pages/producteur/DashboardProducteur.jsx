import { useState } from "react";
import ProduitsProducteur from "./ProduitsProducteur";
import Meteo from "../../components/Meteo";
import ConseilsProducteur from "./ConseilsProducteur";
import CommandesProducteur from "./CommandesProducteur";
import NotificationsProducteur from "./NotificationsProducteur";
import AnnoncesProducteur from "./AnnoncesProducteur";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Package,
  ClipboardList,
  Bell,
  Cloud,
  Lightbulb,
  Smartphone,
  LogOut,
  User,
  Leaf,
} from "lucide-react";

export default function DashboardProducteur() {
  const [section, setSection] = useState("produits");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { id: "produits", label: "Mes produits", icon: <Package size={20} /> },
    { id: "commandes", label: "Commandes", icon: <ClipboardList size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "annonces", label: "Annonces", icon: <Bell size={20} /> },
    { id: "meteo", label: "Météo", icon: <Cloud size={20} /> },
    { id: "conseils", label: "Conseils", icon: <Lightbulb size={20} /> },
    { id: "ussd", label: "USSD *123#", icon: <Smartphone size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50 text-gray-800">

      {/* ==================== SIDEBAR (Fond Vert) ==================== */}
      <aside className="w-72 bg-emerald-800 text-white flex flex-col shadow-xl">

        {/* LOGO */}
        <div className="px-6 py-6 border-b border-white/10 bg-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-white">
                KOB YALGRÉ
              </h1>
              <p className="text-xs text-white/70">Espace Producteur</p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200
                ${
                  section === item.id
                    ? "bg-white text-emerald-800 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 text-white/90"
                }`}
            >
              <span className={section === item.id ? "text-emerald-800" : "text-white/80"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* USER PROFILE */}
        <div className="p-6 border-t border-white/10 bg-emerald-900/50">
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center shadow-inner">
              <User size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">
                {user?.nom || "Producteur"}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-red-500/90 hover:bg-red-600 text-white py-3.5 rounded-2xl font-medium transition-all duration-200"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 px-10 py-7 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-emerald-800 tracking-tight">
                Bonjour {user?.nom?.split(" ")[0] || "Producteur"}
              </h2>
              <p className="text-gray-500 mt-1">
                Gérez votre exploitation agricole en toute simplicité
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Aujourd'hui</p>
              <p className="text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </header>

        {/* BODY */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-gray-100 min-h-full p-8">
            
            {section === "produits" && <ProduitsProducteur />}
            {section === "commandes" && <CommandesProducteur />}
            {section === "notifications" && <NotificationsProducteur />}
            {section === "annonces" && <AnnoncesProducteur />}
            {section === "meteo" && <Meteo />}
            {section === "conseils" && <ConseilsProducteur />}
            
            {section === "ussd" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Smartphone size={48} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-800 mb-3">
                  Service USSD *123#
                </h2>
                <p className="text-gray-600 max-w-md">
                  Accédez à vos conseils, alertes météo et notifications directement via votre téléphone
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}