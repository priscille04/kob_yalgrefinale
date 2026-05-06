import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
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
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Adresse email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Téléphone */}
          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Mot de passe avec bouton */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={form.mot_de_passe}
              onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? "visible" : " "}
            </span>
          </div>

          {/* Role - uniquement client ou producteur */}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Je suis...</option>
            <option value="client">client</option>
            <option value="producteur">producteur</option>
          </select>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white py-3 rounded-lg font-semibold text-lg shadow-md"
          >
            {loading ? 'Création...' : 'S’inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
}
