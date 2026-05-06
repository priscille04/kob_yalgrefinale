import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Package, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [users, products, orders, producers] = await Promise.all([
                api.get('/v1/utilisateurs?all=true'),
                api.get('/v1/produits?all=true'),
                api.get('/v1/commandes?all=true'),
                api.get('/v1/producteurs?all=true'),
            ]);

            const allOrders = orders.data.data || orders.data || [];
            const allProducts = products.data.data || products.data || [];
            const allUsers = users.data.data || users.data || [];
            const allProducers = producers.data.data || producers.data || [];

            const totalRevenue = allOrders.reduce(
                (sum, o) => sum + parseFloat(o.total || 0), 0
            );

            const statusData = Object.entries(
                allOrders.reduce((acc, o) => {
                    const s = o.statut || 'en_attente';
                    acc[s] = (acc[s] || 0) + 1;
                    return acc;
                }, {})
            ).map(([name, value]) => ({ name, value }));

            const rolesChart = Object.entries(
                allUsers.reduce((acc, u) => {
                    const r = u.role || 'client';
                    acc[r] = (acc[r] || 0) + 1;
                    return acc;
                }, {})
            ).map(([name, value]) => ({ name, value }));

            setStats({
                totalUsers: allUsers.length,
                totalProducts: allProducts.length,
                totalOrders: allOrders.length,
                totalRevenue,
                totalProducers: allProducers.length,
                statusData,
                rolesChart,
                recentOrders: allOrders.slice(-5).reverse(),
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-green-50">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!stats) {
        return <p className="text-red-500 text-center mt-10">Erreur de chargement</p>;
    }

    const kpis = [
        { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
        { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'bg-green-500' },
        { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-orange-500' },
        {
            label: 'Revenus',
            value: stats.totalRevenue.toLocaleString('fr-FR') + ' F',
            icon: TrendingUp,
            color: 'bg-purple-500'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 p-10 space-y-12">

            {/* HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 text-white p-10 rounded-3xl shadow-2xl border border-white/20">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent)]"></div>

                <h1 className="text-5xl font-extrabold tracking-tight relative">
                    Dashboard Admin
                </h1>
                <p className="text-white/80 mt-3 text-base relative">
                    Vue globale de votre plateforme agricole 
                </p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {kpis.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="group bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-gray-500 text-sm">{label}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>

                        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                            <Icon className="text-white w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/40">
                    <h2 className="font-bold text-gray-900 mb-5 text-lg">Commandes par statut</h2>

                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.statusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#16a34a" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/40">
                    <h2 className="font-bold text-gray-900 mb-5 text-lg">Utilisateurs par rôle</h2>

                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={stats.rolesChart}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={95}
                                label
                            >
                                {stats.rolesChart.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/40">

                <h2 className="font-bold text-gray-900 mb-5 text-lg">Commandes récentes</h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="text-left text-gray-700 border-b bg-gray-100/60">
                            <tr>
                                <th className="py-4">ID</th>
                                <th>Client</th>
                                <th>Produit</th>
                                <th>Qté</th>
                                <th>Total</th>
                                <th>Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats.recentOrders.map(o => (
                                <tr key={o.id} className="border-b hover:bg-emerald-50/60 transition">
                                    <td className="py-4 font-semibold text-gray-900">#{o.id}</td>
                                    <td>{o.client?.utilisateur?.nom || 'N/A'}</td>
                                    <td>{o.produit?.nom || 'N/A'}</td>
                                    <td>{o.quantite}</td>
                                    <td className="font-bold text-emerald-600">
                                        {parseFloat(o.total || 0).toLocaleString('fr-FR')} F
                                    </td>
                                    <td>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                            {o.statut || 'en_attente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-400">
                                        Aucune commande
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
}