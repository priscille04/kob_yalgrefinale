import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, ShoppingCart, Package,
    Megaphone, BookOpen, LogOut, Leaf, Menu, X, Tags, Bell
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/utilisateurs', icon: Users, label: 'Utilisateurs' },
    { to: '/produits', icon: Package, label: 'Produits' },
    { to: '/commandes', icon: ShoppingCart, label: 'Commandes' },
    { to: '/conseils', icon: BookOpen, label: 'Conseils agricoles' },
    { to: '/annonces', icon: Megaphone, label: 'Annonces' },
    { to: '/typeproduits', icon: Tags, label: 'Types de produits' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">

            {/* SIDEBAR */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-green-800 via-emerald-700 to-green-600 text-white flex flex-col shadow-2xl transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* HEADER SIDEBAR */}
                <div className="px-6 py-6 border-b border-white/10 bg-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shadow">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-wide">KOB YALGRÉ</h1>
                            <p className="text-xs text-white/70">Plateforme agricole</p>
                        </div>

                        <button
                            className="ml-auto lg:hidden text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* NAV */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white text-green-700 shadow-lg scale-[1.02]'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* USER */}
                <div className="p-5 border-t border-white/10 bg-white/5 backdrop-blur-xl">

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white text-green-700 rounded-full flex items-center justify-center font-bold shadow">
                            {user?.nom?.charAt(0)?.toUpperCase() || 'A'}
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.nom || 'Admin'}</p>
                            <p className="text-xs text-white/70 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-white text-green-700 py-2 rounded-xl font-medium hover:bg-gray-100 transition shadow"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-green-100 px-6 py-5 flex items-center justify-between shadow-sm">

                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            KOB YALGRÉ votre plateforme d'E-agriculture au Burkina Faso
                        </h2>
                        <p className="text-sm italic text-green-600">
                            “Moderniser l’agriculture pour un avenir prospère”
                        </p>
                    </div>

                    <button
                        className="lg:hidden bg-green-600 text-white p-2 rounded-lg shadow"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-6">
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 min-h-full">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}