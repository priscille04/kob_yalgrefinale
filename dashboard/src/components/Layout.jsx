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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">KOB-YALGRÉ</h1>
                        <p className="text-xs text-gray-500">Administration</p>
                    </div>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-semibold text-sm">
                                {user?.nom?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.nom || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4">
                    <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">e-Agriculture Burkina Faso</h2>
                </header>
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
