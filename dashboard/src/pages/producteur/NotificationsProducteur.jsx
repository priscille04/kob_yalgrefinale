import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Bell, BellOff, Trash2, Plus, X } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ utilisateur_id: '', titre: '', message: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { loadNotifications(); }, []);

    const loadNotifications = async () => {
        try {
            const { data } = await api.get('/v1/notifications?all=true');
            setNotifications(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/v1/utilisateurs?all=true');
            setUsers(data.data || data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const openCreate = () => {
        loadUsers();
        setForm({ utilisateur_id: '', titre: '', message: '' });
        setError('');
        setShowModal(true);
    };

    const toggleRead = async (n) => {
        try {
            await api.put(`/v1/notifications/${n.id}`, { lu: !n.lu });
            setNotifications(notifications.map((x) => x.id === n.id ? { ...x, lu: !n.lu } : x));
        } catch (err) {
            alert('Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette notification ?')) return;
        try {
            await api.delete(`/v1/notifications/${id}`);
            setNotifications(notifications.filter((n) => n.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.post('/v1/notifications', { ...form, utilisateur_id: parseInt(form.utilisateur_id), lu: false });
            setShowModal(false);
            loadNotifications();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const unreadCount = notifications.filter((n) => !n.lu).length;

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
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications ({notifications.length})</h1>
                    {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{unreadCount} non lues</span>
                    )}
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <Plus className="w-4 h-4" /> Envoyer
                </button>
            </div>

            <div className="space-y-3">
                {notifications.length === 0 && (
                    <div className="text-center text-gray-400 py-12">Aucune notification</div>
                )}
                {notifications.map((n) => (
                    <div key={n.id} className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${n.lu ? 'border-gray-200' : 'border-green-300 bg-green-50/50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.lu ? 'bg-gray-100' : 'bg-green-100'}`}>
                            {n.lu ? <BellOff className="w-5 h-5 text-gray-400" /> : <Bell className="w-5 h-5 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-medium ${n.lu ? 'text-gray-600' : 'text-gray-900'}`}>{n.titre}</h4>
                                <span className="text-xs text-gray-400 shrink-0">{n.created_at ? new Date(n.created_at).toLocaleDateString('fr-FR') : ''}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">→ {n.utilisateur?.nom || `User #${n.utilisateur_id}`}</p>
                            {n.conversation_id && (
                                <button
                                    className="mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                                    onClick={() => window.location.assign(`/conversation/${n.conversation_id}`)}
                                >
                                    Répondre
                                </button>
                            )}

                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => toggleRead(n)} className="text-blue-500 hover:text-blue-700 p-1" title={n.lu ? 'Marquer non lu' : 'Marquer lu'}>
                                {n.lu ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Nouvelle notification</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleCreate} className="space-y-3">
                            <select required value={form.utilisateur_id} onChange={(e) => setForm({ ...form, utilisateur_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">Destinataire...</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.nom} ({u.role})</option>
                                ))}
                            </select>
                            <input type="text" required placeholder="Titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" rows="3" />
                            <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
