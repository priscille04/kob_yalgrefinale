import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { Search, Trash2, Loader2, Plus, X, Pencil } from 'lucide-react';

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
setUsers(
Array.isArray(res.data)
? res.data
: Array.isArray(res.data?.data)
? res.data.data
: Array.isArray(res.data?.utilisateurs)
? res.data.utilisateurs
: []
);
} catch (err) {
console.error(err);
setUsers([]);
} finally {
setLoading(false);
}
};

const handleDelete = async (id) => {
if (!confirm('Supprimer cet utilisateur ?')) return;
try {
await api.delete(`/v1/utilisateurs/${id}`);
setUsers((prev) => prev.filter((u) => u.id !== id));
} catch (err) {
console.error(err);
alert('Erreur lors de la suppression');
}
};

const openCreate = () => {
setEditUser(null);
setForm({ nom: '', email: '', telephone: '', mot_de_passe: '', boutique: '', role: 'client' });
setError('');
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
setError('');
setShowModal(true);
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
      role: form.role,
    };

    if (form.boutique) payload.boutique = form.boutique;

    await api.post('/auth/register', payload);
  }

  setShowModal(false);
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
return users.filter(
(u) =>
u.nom?.toLowerCase().includes(s) ||
u.email?.toLowerCase().includes(s) ||
u.role?.toLowerCase().includes(s)
);
}, [users, search]);

const roleBadge = (role) => {
const styles = {
admin: 'bg-purple-100 text-purple-700',
producteur: 'bg-green-100 text-green-700',
client: 'bg-blue-100 text-blue-700',
};
return styles[role] || 'bg-gray-100 text-gray-700';
};

if (loading) {
return ( <div className="flex items-center justify-center h-64"> <Loader2 className="w-8 h-8 animate-spin text-green-600" /> </div>
);
}

return ( <div className="space-y-6">
{/* ... table inchangée ... */}


  {showModal && (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            required
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder={editUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            required={!editUser}
            value={form.mot_de_passe}
            onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          {/* ✅ PLUS OBLIGATOIRE */}
          <input
            type="text"
            placeholder="Boutique (optionnel)"
            value={form.boutique}
            onChange={(e) => setForm({ ...form, boutique: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="client">Client</option>
            <option value="producteur">Producteur</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {saving ? '...' : editUser ? 'Enregistrer' : 'Créer'}
          </button>

        </form>
      </div>
    </div>
  )}
</div>


);
}
