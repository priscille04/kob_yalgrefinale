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
import Meteo from './components/Meteo';
import Boutiques from "./pages/admin/Boutiques";

function PublicLayout({ children }) {
  return <>{children}</>;
}
import DashboardProducteur from './pages/producteur/DashboardProducteur';
import LoginProducteur from './pages/producteur/LoginProducteur';

import ProduitsProducteur from './pages/producteur/ProduitsProducteur';
import ConseilsProducteur from './pages/producteur/ConseilsProducteur';
import CommandesProducteur from './pages/producteur/CommandesProducteur';
import NotificationsProducteur from './pages/producteur/NotificationsProducteur';
import Conversation from './pages/Conversation';

import PublicHome from './pages/public/PublicHome';
import MarchePublic from './pages/public/MarchePublic';
import Contact from './pages/public/Contact';
import APropos from './pages/public/APropos';
import VideoPublic from './pages/public/VideoPublic'; 

  import ConfirmerCommande from "./pages/client/ConfirmerCommande";
import CommandeClient from "./pages/client/CommandeClient";
import DashboardClient from "./pages/client/DashboardClient";
import MessageClient from "./pages/client/MessageClient";
import Notification from "./pages/client/Notification";
import ValiderPayement from "./pages/client/ValiderPayement";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-producteur" element={<LoginProducteur />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PublicHome />} />
          <Route path="/marcher" element={<MarchePublic />} />
          <Route path="/VideoPublic" element={<VideoPublic />} />
          <Route path="/contact" element={<Contact /> }/>
          <Route
            path="/apropos"
            element={
              <APropos />
            }
          />




          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>

            <Route index element={<Dashboard />} />
            <Route path="utilisateurs" element={<Utilisateurs />} />
            <Route path="produits" element={<Produits />} />
            <Route path="commandes" element={<Commandes />} />
            <Route path="conseils" element={<Conseils />} />
            <Route path="annonces" element={<Annonces />} />
            <Route path="typeproduits" element={<TypeProduits />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="boutiques" element={<Boutiques />} />
            <Route path="*" element={<div className="flex items-center justify-center h-64"><p className="text-gray-500 text-lg">Page introuvable (404)</p></div>} />
          </Route>
          <Route path="/dashboard-producteur" element={<DashboardProducteur />} />
          <Route path="/dashboard-producteur/conseils" element={<ConseilsProducteur />} />
          <Route path="/producteur/dashboard/produits" element={<ProduitsProducteur />} />
          <Route path="/dashboard-producteur/commandes" element={<CommandesProducteur />} />
          <Route path="/dashboard-producteur/notifications" element={<NotificationsProducteur />} />

          <Route path="/conversation/:id" element={<Conversation />} />
              
            
           <Route path="/client/notifications" element={<Notification />} />
          <Route path="/ConfirmerCommande" element={<ConfirmerCommande />} />
          <Route path="/client/commandes/" element={<CommandeClient />} />  
          <Route path="/client/dashboard-client" element={<DashboardClient />} />
            <Route path="/client/notifications" element={<Notification />} />
            
              <Route path="/MessagesClient" element={<MessageClient />} />
              <Route path="client/valider-payement" element={<ValiderPayement />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

