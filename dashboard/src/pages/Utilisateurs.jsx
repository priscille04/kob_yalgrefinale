import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Trash2, Loader2, Plus, X, Pencil } from 'lucide-react';

export default function Utilisateurs() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ nom: '', email: '', telephone: '', mot_de_passe: '', role: 'client' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/v1/utilisateurs');
            setUsers(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/v1/utilisateurs/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const openCreate = () => {
        setEditUser(null);
        setForm({ nom: '', email: '', telephone: '', mot_de_passe: '', role: 'client' });
        setError('');
        setShowModal(true);
    };

    const openEdit = (u) => {
        setEditUser(u);
        setForm({ nom: u.nom || '', email: u.email || '', telephone: u.telephone || '', mot_de_passe: '', role: u.role || 'client' });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (editUser) {
                const payload = { nom: form.nom, email: form.email, telephone: form.telephone, role: form.role };
                if (form.mot_de_passe) payload.mot_de_passe = form.mot_de_passe;
                await api.put(`/v1/utilisateurs/${editUser.id}`, payload);
            } else {
                await api.post('/auth/register', form);
            }
            setShowModal(false);
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const filtered = users.filter(
        (u) =>
            u.nom?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.role?.toLowerCase().includes(search.toLowerCase())
    );

    const roleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700',
            producteur: 'bg-green-100 text-green-700',
            client: 'bg-blue-100 text-blue-700',
        };
        return styles[role] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Utilisateurs ({users.length})</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        <Plus className="w-4 h-4" /> Ajouter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Téléphone</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Rôle</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">{u.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{u.nom}</td>
                                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                                    <td className="py-3 px-4 text-gray-600">{u.telephone || '—'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleBadge(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right flex justify-end gap-1">
                                        <button
                                            onClick={() => openEdit(u)}
                                            className="text-blue-500 hover:text-blue-700 transition p-1"
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="text-red-500 hover:text-red-700 transition p-1"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" className="text-center text-gray-400 py-8">Aucun utilisateur trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal création / édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" required placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <input type="text" placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <input type="password" placeholder={editUser ? 'Nouveau mot de passe (laisser vide)' : 'Mot de passe'} required={!editUser} value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                                <option value="client">Client</option>
                                <option value="producteur">Producteur</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editUser ? 'Enregistrer' : 'Créer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
