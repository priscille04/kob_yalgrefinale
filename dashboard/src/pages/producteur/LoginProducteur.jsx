import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Leaf, Loader2 } from 'lucide-react';

export default function LoginProducteur() {
  const [telephone, setTelephone] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState('telephone'); // telephone | otp

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // ETAPE 1 : envoi du téléphone -> génération OTP (loggé côté Laravel)
  const submitTelephone = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/producteur/send-otp', { telephone });
      setStep('otp');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  // ETAPE 2 : vérification du code OTP -> connexion
  const submitOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/producteur/verify-otp', {
        telephone,
        otp,
      });

      const utilisateur = data?.utilisateur;
      if (utilisateur?.role !== 'producteur') {
        setError('Ce compte n’est pas un producteur');
        return;
      }

      loginWithToken({ utilisateur, token: data.token });
      navigate('/dashboard-producteur');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Code OTP invalide');
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
          <h1 className="text-2xl font-bold text-gray-900">Connexion Producteur</h1>
          <p className="text-gray-500 mt-1">
            {step === 'telephone'
              ? 'Entrez votre numéro de téléphone'
              : 'Entrez le code reçu'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'telephone' ? (
          <form onSubmit={submitTelephone} className="space-y-4">
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Numéro de téléphone"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Envoyer le code
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="space-y-4">
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Numéro de téléphone"
            />

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg tracking-widest text-center text-lg"
              placeholder="Code OTP"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Se connecter
            </button>

            <button
              type="button"
              onClick={() => setStep('telephone')}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Modifier le numéro
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