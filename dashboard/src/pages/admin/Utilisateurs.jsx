import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react';

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    boutique: '',
    role: 'client',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/v1/utilisateurs?all=true');

      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.utilisateurs)
          ? res.data.utilisateurs
          : [];

      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editUser) {
        const payload = {
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          role: form.role,
          code_boutique: form.boutique||null,
        };

        if (form.boutique) payload.boutique = form.boutique;
        if (form.mot_de_passe) payload.mot_de_passe = form.mot_de_passe;

        await api.put(`/v1/utilisateurs/${editUser.id}`, payload);
      } else {
        const payload = {
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          mot_de_passe: form.mot_de_passe,
          boutique: form.boutique,
          role: form.role,
        };

        await api.post('/auth/register', payload);
      }

      setShowModal(false);
      setEditUser(null);
      setForm({
        nom: '',
        email: '',
        telephone: '',
        mot_de_passe: '',
        boutique: '',
        role: 'client',
      });

      loadUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return (users || []).filter((u) =>
      u.nom?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  }, [users, search]);

  const openCreate = () => {
    setEditUser(null);
    setForm({
      nom: '',
      email: '',
      telephone: '',
      mot_de_passe: '',
      boutique: '',
      role: 'client',
    });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      nom: u.nom || '',
      email: u.email || '',
      telephone: u.telephone || '',
      mot_de_passe: '',
      boutique: u.boutique || '',
      role: u.role || 'client',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    try {
      await api.delete(`/v1/utilisateurs/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des utilisateurs
        </h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.telephone}</td>

                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${u.role === 'admin' && 'bg-purple-100 text-purple-700'}
                      ${u.role === 'producteur' && 'bg-green-100 text-green-700'}
                      ${u.role === 'client' && 'bg-blue-100 text-blue-700'}
                    `}>
                      {u.role}
                    </span>
                  </td>

                  <td className="flex justify-center gap-2 p-2">

                    {/* EDIT */}
                    <button
                      onClick={() => openEdit(u)}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="space-y-3">

              <input className="w-full border p-2 rounded" placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />

              <input className="w-full border p-2 rounded" placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input className="w-full border p-2 rounded" placeholder="Téléphone"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />

              <input className="w-full border p-2 rounded" type="password"
                placeholder="Mot de passe"
                value={form.mot_de_passe}
                onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
              />

              <select className="w-full border p-2 rounded"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="producteur">Producteur</option>
                <option value="admin">Admin</option>
              </select>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
              >
                {saving ? '...' : 'Enregistrer'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}