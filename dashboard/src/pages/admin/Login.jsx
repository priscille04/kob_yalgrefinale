import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Leaf, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);
    const [codeBoutique, setCodeBoutique] = useState('');
    const [userTemp, setUserTemp] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    // STEP 1 : LOGIN NORMAL
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            const role = data?.utilisateur?.role;

            // PRODUCTEUR → passe à étape 2
            if (role === "producteur") {
                setUserTemp(data.utilisateur);
                setStep(2);
                return;
            }
            
            // ADMIN
            if (role === "admin") {
                navigate("/admin/dashboard");
                return;
            }

            //  CLIENT
            if (role === "client") {
                navigate("/");
                return;
            }

            setError("Rôle utilisateur non reconnu");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Erreur de connexion"
            );
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 : VERIFICATION CODE BOUTIQUE
    const checkCode = async () => {
        setLoading(true);
        setError('');

        try {
           await api.post('/auth/check-boutique', {
    user_id: userTemp.id,
    code_boutique: codeBoutique
});
            navigate('/dashboard-producteur');

        } catch (err) {
            setError(err.response?.data?.message || "Code boutique incorrect");
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
                    <h1 className="text-2xl font-bold text-gray-900">KOB-YALGRÉ</h1>
                    <p className="text-gray-500 mt-1">
                        {step === 1 ? "Connexion" : "Code Boutique"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            placeholder="Email"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    
                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Code boutique"
                            value={codeBoutique}
                            onChange={(e) => setCodeBoutique(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
 
                        <button
                            onClick={checkCode}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Valider le code
                        </button>

                        <button
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-gray-500"
                        >
                            ← Retour
                        </button>

                    </div>
                )}

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Pas de compte ?{" "}
                    <Link to="/register" className="text-green-600 hover:underline">
                        S’inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
}
