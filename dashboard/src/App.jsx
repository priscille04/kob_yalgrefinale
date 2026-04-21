import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Utilisateurs from './pages/Utilisateurs';
import Produits from './pages/Produits';
import Commandes from './pages/Commandes';
import Conseils from './pages/Conseils';
import Annonces from './pages/Annonces';
import TypeProduits from './pages/TypeProduits';
import Notifications from './pages/Notifications';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="utilisateurs" element={<Utilisateurs />} />
            <Route path="produits" element={<Produits />} />
            <Route path="commandes" element={<Commandes />} />
            <Route path="conseils" element={<Conseils />} />
            <Route path="annonces" element={<Annonces />} />
            <Route path="typeproduits" element={<TypeProduits />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<div className="flex items-center justify-center h-64"><p className="text-gray-500 text-lg">Page introuvable (404)</p></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
