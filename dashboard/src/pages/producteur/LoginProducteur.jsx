import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Loader2 } from 'lucide-react';

export default function LoginProducteur() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState('email'); // email | password

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const mail = email?.trim().toLowerCase();

      // On détermine le rôle en base
      const res = await api.post('/v1/auth/resolve-role', { email: mail });
      const role = res?.data?.role;

      if (role === 'admin') {
        navigate('/login', { state: { email: mail } });
        return;
      }

      if (role !== 'producteur') {
        setError('Ce compte n’est pas un producteur');
        return;
      }

      setStep('password');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, motDePasse);

      const utilisateur = data?.utilisateur;
      if (utilisateur?.role !== 'producteur') {
        setError('Ce compte n’est pas un producteur');
        return;
      }

      navigate('/dashboard-producteur');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-1">
            {step === 'email' ? 'Entrez votre email' : 'Entrez votre mot de passe'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={submitEmail} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Adresse email"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continuer
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Adresse email"
            />

            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Mot de passe"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Se connecter
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 mt-4 text-center">
          Pas de compte ?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}


