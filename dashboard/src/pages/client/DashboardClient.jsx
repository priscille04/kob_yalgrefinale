import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, MessageSquare, ShoppingBag, User, CheckCircle2, Clock, Package, LogOut, ArrowLeft, ShieldCheck, Truck, XCircle } from "lucide-react";
import api from "../../api/axios";

export default function DashboardClient() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState(location.state?.successMessage || location.state?.message || null);
  const [activeTab, setActiveTab] = useState("commandes");

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!localUser || !token) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(localUser));

    const fetchCommandes = async () => {
      try {
        const res = await api.get("/v1/client/commandes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCommandes(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Erreur chargement des commandes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();

    if (successBanner) {
      const timer = setTimeout(() => setSuccessBanner(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [navigate, successBanner]);

  const handleDeconnexion = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Les vraies valeurs stockées en base (colonne `statut`) sont :
  // en_attente | en_cours | livree | annulee
  const getStatutStyle = (statut) => {
    switch (statut) {
      case "livree":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "en_cours":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "annulee":
        return "bg-red-50 text-red-700 border-red-200/60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
  };

  const getStatutDot = (statut) => {
    switch (statut) {
      case "livree":
        return "bg-emerald-500";
      case "en_cours":
        return "bg-blue-500";
      case "annulee":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case "livree":
        return "Livrée";
      case "en_cours":
        return "En cours de livraison";
      case "annulee":
        return "Annulée";
      case "en_attente":
        return "En attente";
      default:
        return statut || "En attente";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* SIDEBAR DESIGN PROFESSIONNEL */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-green-950 to-emerald-950 text-white p-6 flex flex-col justify-between border-r border-green-900/30 shadow-xl">
        <div>
          {/* LOGO BRANDING */}
          <div className="flex items-center gap-3 mb-8">
            <div>
              <h2 className="text-lg font-black text-white tracking-wider leading-none">KOB YALGRÉ</h2>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Espace Client</span>
            </div>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/80 mb-3 px-2">Navigation</p>
          
          {/* MENU DES BOUTONS */}
          <nav className="space-y-1.5">
            {/* 1. BOUTON COMMANDES */}
            <button 
              onClick={() => setActiveTab("commandes")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                activeTab === "commandes" 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/10" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-5 h-5 transition-transform group-hover:scale-105 ${activeTab === "commandes" ? "text-yellow-400" : "text-slate-400"}`} /> 
                <span>Mes Commandes</span>
              </div>
              {commandes.length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${activeTab === "commandes" ? "bg-white text-green-700" : "bg-white/10 text-slate-300"}`}>
                  {commandes.length}
                </span>
              )}
            </button>

            {/* 2. BOUTON MESSAGES */}
            <button 
              onClick={() => navigate("/MessagesClient")} 
              className="w-full flex items-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group"
            >
              <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" /> 
              <span>Messages & Discussions</span>
            </button>

            {/* 3. BOUTON RETOUR MARCHÉ */}
            <button 
              onClick={() => navigate("/marcher")} 
              className="w-full flex items-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group"
            >
              <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" /> 
              <span>Retour au marché</span>
            </button>
          </nav>
        </div>

        {/* 4. BOUTON DÉCONNEXION */}
        <div className="pt-6 border-t border-white/10 mt-8">
          <button 
            onClick={handleDeconnexion} 
            className="w-full flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            <LogOut className="w-5 h-5" /> 
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl overflow-y-auto">
        
        {/* BANNIÈRE DE SUCCÈS PREMIUM */}
        {successBanner && (
          <div className="mb-8 p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base">Opération réussie !</h4>
                <p className="text-xs text-emerald-100 mt-0.5">{successBanner}</p>
              </div>
            </div>
            <button onClick={() => setSuccessBanner(null)} className="text-white/70 hover:text-white text-xs font-bold px-3 py-1 bg-white/10 rounded-lg transition">
              Fermer
            </button>
          </div>
        )}

        {/* TOP BAR / EN-TÊTE BIENVENUE */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-4 h-4" /> 
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">{user?.nom || "Cher Client"}</span> 
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Consultez vos achats en temps réel et suivez vos livraisons.</p>
          </div>

          {/* BADGE COMPTE UTILISATEUR */}
          <div className="flex items-center gap-3 bg-white p-2.5 pr-5 rounded-2xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
            <div className="w-11 h-11 bg-gradient-to-tr from-green-50 to-emerald-100 text-green-700 rounded-xl flex items-center justify-center font-bold text-base shadow-inner">
              {user?.nom ? user.nom.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-tight">{user?.nom}</p>
              <p className="text-[11px] font-medium text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* SECTION STATISTIQUES RAPIDES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">{commandes.length}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Commandes</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">
                {commandes.filter(c => c.statut === "livree").length}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Commandes livrées
              </span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-900">
                {commandes.filter(c => c.statut === "en_attente" || c.statut === "en_cours").length}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En attente</span>
            </div>
          </div>
        </div>

        {/* CONTAINER HISTORIQUE DES COMMANDES */}
        <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h3 className="text-base font-black text-slate-800">Historique complet de vos achats</h3>
              <p className="text-xs text-slate-400 mt-0.5">Liste chronologique de vos acquisitions agricoles locales.</p>
            </div>
            <button 
              onClick={() => navigate("/marcher")}
              className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1.5 bg-green-50 hover:bg-green-100/80 px-3 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Nouvelle commande
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-green-600" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calcul des données...</span>
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Votre historique est vide</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Vous n'avez pas encore effectué d'achats sur la plateforme pour le moment.</p>
              <button 
                onClick={() => navigate("/marcher")}
                className="mt-4 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
              >
                Visiter le marché public
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                    <th className="py-4 px-6">Identifiant</th>
                    <th className="py-4 px-6">Désignation Produit</th>
                    <th className="py-4 px-6 text-center">Quantité Commandée</th>
                    <th className="py-4 px-6 text-right">Montant Global</th>
                    <th className="py-4 px-6 text-center">Statut du Flux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                  {commandes.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">#{cmd.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{cmd.produit?.nom || "Produit Agricole"}</div>
                        {cmd.created_at && (
                          <span className="text-[10px] text-slate-400 font-normal">Commandé le {new Date(cmd.created_at).toLocaleDateString()}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 font-semibold">{cmd.quantite} kg</td>
                      <td className="py-4 px-6 text-right font-black text-slate-900">
                        {(cmd.total || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-400">FCFA</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${getStatutStyle(cmd.statut)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatutDot(cmd.statut)}`} />
                          {getStatutLabel(cmd.statut)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
