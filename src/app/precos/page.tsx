"use client";

import Link from 'next/link';
import { useState } from 'react';

const PRICE_ID = 'price_1RYPhJ4QMX5muotySnPTrRPe'; // Use this for both plans

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICE_ID, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Erro ao iniciar pagamento.');
      }
    } catch (err) {
      setError('Erro ao conectar ao Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">Planos Premium</h1>
        <div className="mb-8 flex flex-col items-center">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900 mb-2"
            disabled={loading}
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Escort Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">Escort Premium</h2>
            <p className="text-gray-700 mb-6">Desbloqueie todas as funcionalidades para promover os seus anúncios e atrair mais clientes.</p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>• Gerir anúncios de forma rápida e fácil</li>
              <li>• Pausar anúncios</li>
              <li>• Indicar disponibilidade do anúncio</li>
              <li>• Agendar destaques</li>
              <li>• Destacar vários anúncios ao mesmo tempo</li>
              <li>• Adicionar vídeos nos anúncios</li>
              <li>• Destaque exclusivo em formato mobile</li>
            </ul>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">15 dias</span>
                <span className="text-xl font-bold text-pink-600">15€</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">30 dias</span>
                <span className="text-xl font-bold text-pink-600">30€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">90 dias</span>
                <span className="text-xl font-bold text-pink-600">90€</span>
              </div>
            </div>
            <button
              className="mt-auto bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Aguarde...' : 'Comprar / Upgrade'}
            </button>
          </div>

          {/* Visitante Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">Visitante Premium</h2>
            <p className="text-gray-700 mb-6">Aceda a funcionalidades exclusivas para encontrar e interagir com os melhores anúncios.</p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>• Atribuir corações aos anúncios favoritos</li>
              <li>• Ver datas nos anúncios</li>
              <li>• Elogiar anúncios</li>
              <li>• Filtrar anúncios ocultando fotos sugestivas</li>
              <li>• Filtrar anúncios com corações</li>
              <li>• Filtrar anúncios com elogios</li>
              <li>• Filtrar anúncios com vídeos</li>
            </ul>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">30 dias</span>
                <span className="text-xl font-bold text-pink-600">5€</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">90 dias</span>
                <span className="text-xl font-bold text-pink-600">15€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">365 dias</span>
                <span className="text-xl font-bold text-pink-600">50€</span>
              </div>
            </div>
            <button
              className="mt-auto bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Aguarde...' : 'Comprar / Upgrade'}
            </button>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/" className="text-pink-600 hover:underline">Voltar à página inicial</Link>
        </div>
      </div>
    </div>
  );
} 