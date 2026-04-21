import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Package, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
                api.get('/v1/utilisateurs'),
                api.get('/v1/produits'),
                api.get('/v1/commandes'),
                api.get('/v1/producteurs'),
            ]);

            const allOrders = orders.data.data || orders.data || [];
            const allProducts = products.data.data || products.data || [];
            const allUsers = users.data.data || users.data || [];
            const allProducers = producers.data.data || producers.data || [];

            const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

            const ordersByStatus = allOrders.reduce((acc, o) => {
                const s = o.statut || 'en_attente';
                acc[s] = (acc[s] || 0) + 1;
                return acc;
            }, {});

            const statusData = Object.entries(ordersByStatus).map(([name, value]) => ({ name, value }));

            const roleData = allUsers.reduce((acc, u) => {
                const r = u.role || 'client';
                acc[r] = (acc[r] || 0) + 1;
                return acc;
            }, {});

            const rolesChart = Object.entries(roleData).map(([name, value]) => ({ name, value }));

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
            console.error('Erreur chargement stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!stats) return <p className="text-red-500">Erreur de chargement des données</p>;

    const kpis = [
        { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
        { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'bg-green-500' },
        { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-orange-500' },
        { label: 'Revenus (FCFA)', value: stats.totalRevenue.toLocaleString('fr-FR'), icon: TrendingUp, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">{label}</span>
                            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes par statut</h3>
                    {stats.statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-8">Aucune commande</p>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs par rôle</h3>
                    {stats.rolesChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stats.rolesChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {stats.rolesChart.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-8">Aucun utilisateur</p>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes récentes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-2 font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-2 font-medium text-gray-500">Client</th>
                                <th className="text-left py-3 px-2 font-medium text-gray-500">Produit</th>
                                <th className="text-left py-3 px-2 font-medium text-gray-500">Quantité</th>
                                <th className="text-left py-3 px-2 font-medium text-gray-500">Total</th>
                                <th className="text-left py-3 px-2 font-medium text-gray-500">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((o) => (
                                <tr key={o.id} className="border-b border-gray-100">
                                    <td className="py-3 px-2 text-gray-900">#{o.id}</td>
                                    <td className="py-3 px-2 text-gray-600">{o.client?.utilisateur?.nom || o.client_id}</td>
                                    <td className="py-3 px-2 text-gray-600">{o.produit?.nom || o.produit_id}</td>
                                    <td className="py-3 px-2 text-gray-600">{o.quantite}</td>
                                    <td className="py-3 px-2 font-medium text-gray-900">{parseFloat(o.total || 0).toLocaleString('fr-FR')} F</td>
                                    <td className="py-3 px-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${o.statut === 'livree' ? 'bg-green-100 text-green-700' :
                                                o.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                                    o.statut === 'annulee' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {o.statut || 'en_attente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <tr><td colSpan="6" className="text-center text-gray-400 py-6">Aucune commande</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
