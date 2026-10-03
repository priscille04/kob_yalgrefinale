import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Leaf, Loader2, KeyRound, X } from 'lucide-react';

export default function Login() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showRoles, setShowRoles] = useState(false);
  const [role, setRole] = useState(null); // admin | producteur | client
  const [step, setStep] = useState(null); // email | otp | password | telephone | otp_producteur

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [otp, setOtp] = useState('');
  const [telephone, setTelephone] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Code OTP renvoyé par le serveur en mode démo (null en production)
  const [otpDemo, setOtpDemo] = useState(null);

  //  ADMIN - envoyer OTP
  const startOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/v1/admin/login/start-otp', { email });
      setOtpDemo(data?.otp_debug ?? null);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur envoi OTP');
    } finally {
      setLoading(false);
    }
  };

  //  ADMIN - vérifier OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/v1/admin/login/verify-otp', {
        email,
        otp,
      });

      setOtpDemo(null);
      loginWithToken(data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  //  PRODUCTEUR - envoyer OTP (par téléphone)
  const startOtpProducteur = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/producteur/send-otp', { telephone });
      setOtpDemo(data?.otp_debug ?? null);
      setStep('otp_producteur');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur envoi OTP');
    } finally {
      setLoading(false);
    }
  };

  //  PRODUCTEUR - vérifier OTP
  const verifyOtpProducteur = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/producteur/verify-otp', {
        telephone,
        otp,
      });

      const user = data?.utilisateur;

      if (!user || user.role !== 'producteur') {
        throw new Error('Ce compte n’est pas un producteur');
      }

      setOtpDemo(null);
      loginWithToken({ utilisateur: user, token: data.token });
      navigate('/dashboard-producteur');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  //  CLIENT (et fallback) - email + mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post("/auth/login", {
        email: email,
        mot_de_passe: motDePasse,
      });

      const user = res.data.utilisateur;
      const token = res.data.token;

      if (!user) {
        throw new Error("Utilisateur non reçu du backend");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (typeof loginWithToken === 'function') {
        loginWithToken({ utilisateur: user, token: token });
      }

      // REDIRECTION SELON RÔLE
      if (user.role === "client") {
        const redirect =
          location.state?.redirectAfterLogin || "/client/dashboard-client";

        setTimeout(() => {
          navigate(redirect, {
            replace: true,
            state: {
              produit: location.state?.produit,
            },
          });
        }, 100);

      } else if (user.role === "producteur") {
        navigate("/dashboard-producteur");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Erreur login :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Identifiants invalides ou erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Le bandeau s'affiche seulement pendant une étape de saisie d'OTP
  const enEtapeOtp = step === 'otp' || step === 'otp_producteur';

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

        {/*  BOUTON CONNEXION */}
        {!showRoles && (
          <button
            onClick={() => setShowRoles(true)}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Connexion
          </button>
        )}

        {/*  CHOIX ROLE */}
        {showRoles && !role && (
          <div className="space-y-3">
            <button
              onClick={() => { setRole('admin'); setStep('email'); }}
              className="w-full bg-gray-100 py-2 rounded font-medium hover:bg-gray-200 transition"
            >
              Admin
            </button>

            <button
              onClick={() => { setRole('producteur'); setStep('telephone'); }}
              className="w-full bg-gray-100 py-2 rounded font-medium hover:bg-gray-200 transition"
            >
              Producteur
            </button>

            <button
              onClick={() => { setRole('client'); setStep('password'); }}
              className="w-full bg-gray-100 py-2 rounded font-medium hover:bg-gray-200 transition"
            >
              Client
            </button>
          </div>
        )}

        {/*  ADMIN EMAIL */}
        {role === 'admin' && step === 'email' && (
          <form onSubmit={startOtp} className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center font-semibold" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Envoyer OTP
            </button>
          </form>
        )}

        {/*  ADMIN OTP */}
        {role === 'admin' && step === 'otp' && (
          <form onSubmit={verifyOtp} className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Code OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center font-semibold" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Valider
            </button>

            <button
              type="button"
              onClick={() => { setStep('email'); setOtpDemo(null); }}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Modifier l’email
            </button>
          </form>
        )}

        {/*  PRODUCTEUR TELEPHONE */}
        {role === 'producteur' && step === 'telephone' && (
          <form onSubmit={startOtpProducteur} className="space-y-4 mt-4">
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center font-semibold" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Envoyer le code
            </button>
          </form>
        )}

        {/*  PRODUCTEUR OTP */}
        {role === 'producteur' && step === 'otp_producteur' && (
          <form onSubmit={verifyOtpProducteur} className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Code OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none tracking-widest text-center"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center font-semibold" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Valider
            </button>

            <button
              type="button"
              onClick={() => { setStep('telephone'); setOtpDemo(null); }}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Modifier le numéro
            </button>
          </form>
        )}

        {/* CLIENT (mot de passe) */}
        {role === 'client' && step === 'password' && (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex justify-center items-center font-semibold transition"
            >
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Se connecter
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4">
          Pas de compte ? <Link to="/register" className="text-green-600 font-medium hover:underline">S’inscrire</Link>
        </p>
      </div>

      {/* Bandeau OTP en bas de l'écran (visible uniquement si le serveur renvoie otp_debug) */}
      {otpDemo && enEtapeOtp && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <div className="bg-gray-900 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-green-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Code OTP (mode démo)</p>
              <p className="text-2xl font-bold tracking-[0.3em]">{otpDemo}</p>
            </div>
            <button
              type="button"
              onClick={() => setOtp(otpDemo)}
              className="bg-green-600 hover:bg-green-500 text-sm px-3 py-1.5 rounded-lg"
            >
              Remplir
            </button>
            <button
              type="button"
              onClick={() => setOtpDemo(null)}
              aria-label="Fermer"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
