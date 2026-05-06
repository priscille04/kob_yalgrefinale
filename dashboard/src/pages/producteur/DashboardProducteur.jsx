import { useState } from "react";
import ProduitsProducteur from "./ProduitsProducteur";
import Meteo from "../../components/Meteo";
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
  User
} from "lucide-react";
import ConseilsProducteur from "./ConseilsProducteur";

export default function DashboardProducteur() {
  const [section, setSection] = useState("produits");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { id: "produits", label: "Produits", icon: <Package size={18} /> },
    { id: "commandes", label: "Commandes", icon: <ClipboardList size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "meteo", label: "Météo", icon: <Cloud size={18} /> },
    { id: "conseils", label: "Conseils", icon: <Lightbulb size={18} /> },
    { id: "ussd", label: "USSD", icon: <Smartphone size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 text-gray-800">

      {/* SIDEBAR */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r shadow-xl p-6 flex flex-col">

        {/* LOGO */}
        <h1 className="text-2xl font-extrabold text-green-700 mb-8">
          KOB YALGRE
        </h1>

        {/* MENU */}
        <nav className="space-y-2 flex-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition
              ${
                section === item.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "hover:bg-green-100 text-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

       {/* logo */}

        <div className="border-t pt-4 space-y-3">

          {/* PROFILE */}
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.nom || "Producteur"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
          >
            <LogOut size={16} />
            Déconnexion
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-7 shadow-lg">
          <h2 className="text-3xl font-bold">
            Espace Producteur 
          </h2>
          <p className="text-white/80">
            Gérez vos activités agricoles facilement
          </p>
        </header>

        {/* BODY */}
        <main className="flex-1 p-8">

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 min-h-[500px]">

            {section === "produits" && <ProduitsProducteur />}

            {section === "commandes" && (
              <h2 className="text-xl font-bold">Commandes (à venir)</h2>
            )}

            {section === "notifications" && (
              <h2 className="text-xl font-bold">Notifications</h2>
            )}

            {section === "meteo" && <Meteo  />}
            

            {section === "conseils" &&  <ConseilsProducteur /> }
             

            {section === "ussd" && (
              <h2 className="text-xl font-bold">USSD *123#</h2>
            )}
             
          </div>

        </main>
      </div>
    </div>
  );
}