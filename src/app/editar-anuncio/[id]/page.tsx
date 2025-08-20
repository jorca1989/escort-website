'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  city: string;
  age: number;
  phone: string;
  services: string;
  status: string;
  minDuration: string;
  advanceNotice: string;
  acceptsCard: boolean;
  regularDiscount: string;
  createdAt: string;
  user: {
    profile: {
      name: string;
      description: string;
      neighborhood: string;
      gender: string;
      weight: string;
      height: string;
      ethnicity: string;
      eyeColor: string;
      hairColor: string;
      shoeSize: string;
      tattoos: string;
      piercings: string;
      smoker: string;
      languages: string;
      bodyType: string;
      breastSize: string;
      breastType: string;
      personalityTags: string[];
      whatsappEnabled: boolean;
      telegramEnabled: boolean;
      onlyfans: string;
      instagram: string;
      twitter: string;
      tiktok: string;
      snapchat: string;
      telegramChannel: string;
      whatsappBusiness: string;
      manyvids: string;
      chaturbate: string;
      myfreecams: string;
      livejasmin: string;
      linkHubUrl: string;
    };
  };
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}/edit`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        setError('Listing not found or you do not have permission to edit it');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!listing) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      router.push('/dashboard');
    } catch (error) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{error || 'Este anúncio não existe ou você não tem permissão para editá-lo.'}</p>
          <Link
            href="/dashboard"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const profile = listing.user.profile;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Anúncio</h1>
              <p className="text-gray-600">{profile.name} • {listing.city}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {listing.status === 'ACTIVE' ? '🟢 Ativo' : 
                 listing.status === 'PENDING' ? '🟡 Pendente' : '🔴 Inativo'}
              </div>
              <p className="text-sm text-gray-500">
                Criado em {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setListing(prev => prev ? {
                  ...prev,
                  user: {
                    ...prev.user,
                    profile: { ...prev.user.profile, name: e.target.value }
                  }
                } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
              <input
                type="number"
                value={listing.age}
                onChange={(e) => setListing(prev => prev ? { ...prev, age: parseInt(e.target.value) } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <select
                value={listing.city}
                onChange={(e) => setListing(prev => prev ? { ...prev, city: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Lisboa">Lisboa</option>
                <option value="Porto">Porto</option>
                <option value="Braga">Braga</option>
                <option value="Coimbra">Coimbra</option>
                <option value="Faro">Faro</option>
                <option value="Aveiro">Aveiro</option>
                <option value="Leiria">Leiria</option>
                <option value="Setúbal">Setúbal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={listing.phone}
                onChange={(e) => setListing(prev => prev ? { ...prev, phone: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
          <textarea
            value={profile.description || ''}
            onChange={(e) => setListing(prev => prev ? {
              ...prev,
              user: {
                ...prev.user,
                profile: { ...prev.user.profile, description: e.target.value }
              }
            } : null)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Conte um pouco sobre você, sua personalidade, experiência..."
          />
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Serviços</h2>
          <textarea
            value={listing.services || ''}
            onChange={(e) => setListing(prev => prev ? { ...prev, services: e.target.value } : null)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Liste os serviços oferecidos, separados por vírgula"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 