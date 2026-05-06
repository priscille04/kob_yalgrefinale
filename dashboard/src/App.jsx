import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Utilisateurs from './pages/admin/Utilisateurs';
import Produits from './pages/admin/Produits';
import Commandes from './pages/admin/Commandes';
import Conseils from './pages/admin/Conseils';
import Annonces from './pages/admin/Annonces';
import TypeProduits from './pages/admin/TypeProduits';
import Notifications from './pages/admin/Notifications';
import Register from './pages/admin/Register';
import DashboardProducteur from './pages/producteur/DashboardProducteur';
import ConseilsProducteur from './pages/producteur/ConseilsProducteur';
import Meteo from './components/Meteo';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="dashboard-producteur" element={<DashboardProducteur />} />
          <Route path="producteur/conseils" element={<ConseilsProducteur />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
