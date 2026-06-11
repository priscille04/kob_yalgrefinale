import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '../../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    role: '',
    code_boutique: '' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.role) {
      setError("Veuillez choisir un rôle");
      return;
    }

    // SI PRODUCTEUR → vérifier code boutique
    if (form.role === "producteur" && !form.code_boutique) {
      setError("Veuillez entrer le code de la boutique");
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erreur lors de l’inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Créer un compte
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nom */}
          <input
            type="text"
            placeholder="Nom complet"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Adresse email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Téléphone */}
          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Mot de passe */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={form.mot_de_passe}
              onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </span>
          </div>

          {/* Role */}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Je suis...</option>
            <option value="client">Client</option>
            <option value="producteur">Producteur</option>
          </select>

          {/* CODE BOUTIQUE (UNIQUEMENT PRODUCTEUR) */}
          {form.role === "producteur" && (
            <input
              type="text"
              placeholder="Code boutique"
              value={form.code_boutique}
              onChange={e => setForm({ ...form, code_boutique: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition"
          >
            {loading ? "Création..." : "S’inscrire"}
          </button>

        </form>
      </div>
    </div>
  );
}