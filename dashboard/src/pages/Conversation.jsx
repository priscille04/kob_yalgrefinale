import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Send, ArrowLeft } from 'lucide-react';

export default function Conversation() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contenu, setContenu] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const conversationId = useMemo(() => (id ? parseInt(id, 10) : null), [id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/v1/conversations/${conversationId}/messages`);
      setMessages(data || []);
    } catch (e) {
      setError('Erreur lors du chargement des messages');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;

    const utilisateur = JSON.parse(localStorage.getItem('user') || 'null');
    const expediteur_id = utilisateur?.id;
    if (!expediteur_id) {
      setError('Utilisateur non trouvé');
      return;
    }

    try {
      setSending(true);
      setError('');
      await api.post(`/v1/conversations/${conversationId}/messages`, {
        expediteur_id,
        contenu,
      });

      setContenu('');
      await loadMessages();
    } catch (e2) {
      setError(e2.response?.data?.message || 'Erreur en envoyant');
      console.error(e2);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[70vh]">
      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft className="w-5 h-5 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900">Conversation #{conversationId}</h1>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6">
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-10">Aucun message</div>
            ) : (
              messages.map((m) => {
                const isMine = m?.expediteur?.id === JSON.parse(localStorage.getItem('user') || 'null')?.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm border ${
                        isMine
                          ? 'bg-green-600 text-white border-green-700'
                          : 'bg-gray-50 text-gray-900 border-gray-200'
                      }`}
                    >
                      <div className="text-xs opacity-80 mb-1">
                        {!isMine ? m?.expediteur?.nom || 'Client' : 'Vous'}
                      </div>

                      <div className="whitespace-pre-wrap">{m.contenu}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSend} className="mt-6 flex gap-2 items-end">
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={3}
              className="flex-1 resize-none border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Votre message..."
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

