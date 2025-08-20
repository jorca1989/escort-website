'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  createdAt: string;
  user: {
    profile: {
      name: string;
      age: number;
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

export default function ListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        setError('Listing not found or no longer available');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anúncio não encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'Este anúncio não existe ou foi removido.'}</p>
          <Link
            href="/perfis"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Ver outros perfis
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
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.age} anos • {listing.city}</p>
              {profile.neighborhood && (
                <p className="text-gray-500 text-sm">{profile.neighborhood}</p>
              )}
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

          {profile.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sobre</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.description}</p>
            </div>
          )}
        </div>

        {/* Physical Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhes Físicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.gender && (
              <div>
                <span className="text-sm font-medium text-gray-500">Gênero:</span>
                <p className="text-gray-900">{profile.gender}</p>
              </div>
            )}
            {profile.weight && (
              <div>
                <span className="text-sm font-medium text-gray-500">Peso:</span>
                <p className="text-gray-900">{profile.weight} kg</p>
              </div>
            )}
            {profile.height && (
              <div>
                <span className="text-sm font-medium text-gray-500">Altura:</span>
                <p className="text-gray-900">{profile.height} m</p>
              </div>
            )}
            {profile.ethnicity && (
              <div>
                <span className="text-sm font-medium text-gray-500">Etnia:</span>
                <p className="text-gray-900">{profile.ethnicity}</p>
              </div>
            )}
            {profile.eyeColor && (
              <div>
                <span className="text-sm font-medium text-gray-500">Cor dos Olhos:</span>
                <p className="text-gray-900">{profile.eyeColor}</p>
              </div>
            )}
            {profile.hairColor && (
              <div>
                <span className="text-sm font-medium text-gray-500">Cor do Cabelo:</span>
                <p className="text-gray-900">{profile.hairColor}</p>
              </div>
            )}
            {profile.shoeSize && (
              <div>
                <span className="text-sm font-medium text-gray-500">Calçado:</span>
                <p className="text-gray-900">{profile.shoeSize}</p>
              </div>
            )}
            {profile.tattoos && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tatuagens:</span>
                <p className="text-gray-900">{profile.tattoos}</p>
              </div>
            )}
            {profile.piercings && (
              <div>
                <span className="text-sm font-medium text-gray-500">Piercings:</span>
                <p className="text-gray-900">{profile.piercings}</p>
              </div>
            )}
            {profile.smoker && (
              <div>
                <span className="text-sm font-medium text-gray-500">Fumador/a:</span>
                <p className="text-gray-900">{profile.smoker}</p>
              </div>
            )}
            {profile.bodyType && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tipo de Corpo:</span>
                <p className="text-gray-900">{profile.bodyType}</p>
              </div>
            )}
            {profile.breastSize && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tamanho de Peito:</span>
                <p className="text-gray-900">{profile.breastSize}</p>
              </div>
            )}
            {profile.breastType && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tipo de Peito:</span>
                <p className="text-gray-900">{profile.breastType}</p>
              </div>
            )}
          </div>

          {profile.languages && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Idiomas:</span>
              <p className="text-gray-900">{profile.languages}</p>
            </div>
          )}

          {profile.personalityTags && profile.personalityTags.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Tags de Personalidade:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.personalityTags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services */}
        {listing.services && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {listing.services.split(', ').map((service, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações de Contato</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 w-24">Telefone:</span>
              <span className="text-gray-900">{listing.phone}</span>
            </div>
            
            {profile.whatsappEnabled && (
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Aceita contato via WhatsApp</span>
              </div>
            )}
            
            {profile.telegramEnabled && (
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-gray-700">Aceita contato via Telegram</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        {(profile.onlyfans || profile.instagram || profile.twitter || profile.tiktok || 
          profile.snapchat || profile.telegramChannel || profile.whatsappBusiness || 
          profile.manyvids || profile.chaturbate || profile.myfreecams || 
          profile.livejasmin || profile.linkHubUrl) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Redes Sociais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.onlyfans && (
                <a href={profile.onlyfans} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-purple-600 hover:text-purple-700">
                  <span className="mr-2">🔴</span> OnlyFans
                </a>
              )}
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-pink-600 hover:text-pink-700">
                  <span className="mr-2">📷</span> Instagram
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-blue-600 hover:text-blue-700">
                  <span className="mr-2">🐦</span> Twitter/X
                </a>
              )}
              {profile.tiktok && (
                <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-black hover:text-gray-700">
                  <span className="mr-2">🎵</span> TikTok
                </a>
              )}
              {profile.snapchat && (
                <a href={profile.snapchat} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-yellow-600 hover:text-yellow-700">
                  <span className="mr-2">👻</span> Snapchat
                </a>
              )}
              {profile.telegramChannel && (
                <a href={profile.telegramChannel} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-blue-600 hover:text-blue-700">
                  <span className="mr-2">📢</span> Telegram Channel
                </a>
              )}
              {profile.whatsappBusiness && (
                <a href={profile.whatsappBusiness} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-green-600 hover:text-green-700">
                  <span className="mr-2">💬</span> WhatsApp Business
                </a>
              )}
              {profile.manyvids && (
                <a href={profile.manyvids} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-purple-600 hover:text-purple-700">
                  <span className="mr-2">🎬</span> ManyVids
                </a>
              )}
              {profile.chaturbate && (
                <a href={profile.chaturbate} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-orange-600 hover:text-orange-700">
                  <span className="mr-2">📺</span> Chaturbate
                </a>
              )}
              {profile.myfreecams && (
                <a href={profile.myfreecams} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-red-600 hover:text-red-700">
                  <span className="mr-2">📹</span> MyFreeCams
                </a>
              )}
              {profile.livejasmin && (
                <a href={profile.livejasmin} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-pink-600 hover:text-pink-700">
                  <span className="mr-2">💎</span> LiveJasmin
                </a>
              )}
              {profile.linkHubUrl && (
                <a href={profile.linkHubUrl} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-gray-600 hover:text-gray-700">
                  <span className="mr-2">🔗</span> Links
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/perfis"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Ver outros perfis
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
} 