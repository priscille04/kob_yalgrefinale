import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Leaf, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [showRoles, setShowRoles] = useState(false);
  const [role, setRole] = useState(null); // admin | producteur | client
  const [step, setStep] = useState(null); // email | otp | password

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔐 ADMIN - envoyer OTP
  const startOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/v1/admin/login/start-otp', { email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur envoi OTP');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 ADMIN - vérifier OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/v1/admin/login/verify-otp', {
        email,
        otp,
      });

      loginWithToken(data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  // 🔑 PRODUCTEUR / CLIENT
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, motDePasse);

      if (data?.utilisateur?.role === 'producteur') {
        navigate('/dashboard-producteur');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">KOB-YALGRÉ</h1>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3 text-center">{error}</div>
        )}

        {/* 🔘 BOUTON CONNEXION */}
        {!showRoles && (
          <button
            onClick={() => setShowRoles(true)}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg"
          >
            Connexion
          </button>
        )}

        {/* 👤 CHOIX ROLE */}
        {showRoles && !role && (
          <div className="space-y-3">
            <button
              onClick={() => { setRole('admin'); setStep('email'); }}
              className="w-full bg-gray-100 py-2 rounded"
            >
              Admin
            </button>

            <button
              onClick={() => { setRole('producteur'); setStep('password'); }}
              className="w-full bg-gray-100 py-2 rounded"
            >
              Producteur
            </button>

            <button
              onClick={() => { setRole('client'); setStep('password'); }}
              className="w-full bg-gray-100 py-2 rounded"
            >
              Client
            </button>
          </div>
        )}

        {/* 🔐 ADMIN EMAIL */}
        {role === 'admin' && step === 'email' && (
          <form onSubmit={startOtp} className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center">
              {loading && <Loader2 className="animate-spin mr-2" />}
              Envoyer OTP
            </button>
          </form>
        )}

        {/* 🔐 ADMIN OTP */}
        {role === 'admin' && step === 'otp' && (
          <form onSubmit={verifyOtp} className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Code OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center">
              {loading && <Loader2 className="animate-spin mr-2" />}
              Valider
            </button>
          </form>
        )}

        {/* 🔑 PRODUCTEUR / CLIENT */}
        {step === 'password' && (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center">
              {loading && <Loader2 className="animate-spin mr-2" />}
              Se connecter
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4">
          Pas de compte ? <Link to="/register" className="text-green-600">S’inscrire</Link>
        </p>
      </div>
    </div>
  );
}