'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileModals from '@/components/ProfileModals';
import { useParams } from 'next/navigation';
import mockProfiles from '@/mock/mockProfiles'; // (We'll create this file if it doesn't exist)

interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  price: number;
  rating: number;
  isVerified: boolean;
  isOnline: boolean;
  media: { url: string }[];
  phoneNumber: string;
  _count: {
    reviews: number;
    questions: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id;
  
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${profileId}`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        // Fallback to mock profile if API fails or ID is not valid
        const mock = mockProfiles.find(p => String(p.id) === String(profileId));
        setProfile(mock || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Perfil não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header: 3-Column Layout */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Photo */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="relative">
                <img 
                  src={profile.media[0]?.url || "https://images.unsplash.com/photo-1494790108755-2616b332c9ef?w=200&h=200&fit=crop&crop=face"} 
                  alt={profile.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-red-600"
                />
                {profile.isOnline && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Column: Main Info */}
            <div className="text-center lg:text-left space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-sm text-gray-500">Online há 2 horas</p>
              <p className="text-lg text-gray-700 italic">"Experiência única e inesquecível"</p>
              
              <button 
                onClick={() => setShowQuestionModal(true)} 
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Fazer uma pergunta
              </button>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-2xl text-red-600">€{profile.price}</span>
                  <span className="text-gray-800">/hora</span>
                  <button className="text-red-600 hover:text-red-700 underline">Ver preços</button>
                </div>
                {profile.phoneNumber && (
                  <Link 
                    href={`/perfis/mesmo-numero/${encodeURIComponent(profile.phoneNumber)}`}
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Ver perfis com o mesmo número
                  </Link>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>📷 {profile.media.length} mídias</span>
                <span>⭐ {profile._count.reviews} avaliações</span>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4">
                <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2">
                  <i className="fas fa-phone-alt"></i>
                  <span>Ligar</span>
                </button>
                <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2">
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-semibold ml-2">{profile.age} anos</span>
                </div>
                <div>
                  <span className="text-gray-600">Local:</span>
                  <span className="font-semibold ml-2 text-green-600">Com local</span>
                </div>
                <div>
                  <span className="text-gray-600">Localização:</span>
                  <span className="font-semibold ml-2">{profile.city}</span>
                </div>
                <div>
                  <span className="text-gray-600">Atende:</span>
                  <span className="font-semibold ml-2">Homens</span>
                </div>
                <div>
                  <span className="text-gray-600">Seguidores:</span>
                  <span className="font-semibold ml-2">1.2k</span>
                </div>
                <div>
                  <span className="text-gray-600">Distância:</span>
                  <span className="font-semibold ml-2">2.5 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Status/Verification */}
      <div className="bg-white border-t px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
            <span>✓</span>
            <span>Perfil Verificado</span>
          </span>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
            <span>🛡️</span>
            <span>Contacto Seguro</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Sobre Mim</h2>
          <p className="text-gray-700 leading-relaxed">
            Olá! Sou a Isabella, uma jovem brasileira que vive em Lisboa há 3 anos. 
            Sou uma pessoa carinhosa, educada e muito discreta. Adoro conversar e proporcionar 
            momentos únicos e inesquecíveis. Procuro sempre criar um ambiente relaxante e 
            acolhedor para que se sinta completamente à vontade. Valorizo muito a higiene 
            e o respeito mútuo. Vamos juntos criar memórias especiais!
          </p>
        </div>

        {/* Media Gallery */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold">Galeria de Mídia</h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                ✓ Mídia Verificada
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'photos' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <i className="fas fa-camera mr-1"></i>Fotos
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'videos' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <i className="fas fa-video mr-1"></i>Vídeos
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer">
                <img 
                  src={`https://images.unsplash.com/photo-${1494790108755 + i}?w=200&h=200&fit=crop`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                {i === 1 && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                    🎥
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="text-red-600 hover:text-red-700 font-medium">
              Ver mais mídia →
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Serviços Oferecidos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Acompanhante social</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Massagem relaxante</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Jantar romântico</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Eventos sociais</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600">✗</span>
                <span className="text-gray-500">Serviços não convencionais</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Detalhes Adicionais</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duração mínima:</span>
                <span className="font-medium">1 hora</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aviso prévio:</span>
                <span className="font-medium">2 horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aceita cartão:</span>
                <span className="font-medium text-green-600">Sim</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Desconto para regulares:</span>
                <span className="font-medium text-green-600">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison/Attributes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Comparison Media */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Mídia de Comparação</h3>
            <div className="relative max-w-[300px] mx-auto">
              <video 
                className="w-full h-[500px] bg-gray-200 rounded-2xl object-cover" 
                poster="https://images.unsplash.com/photo-1494790108755-2616b332c9ef?w=300&h=500&fit=crop"
                style={{ aspectRatio: '9/16' }}
              >
                <source src="#" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-colors">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </button>
              </div>
              {/* Story-like elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                    IS
                  </div>
                  <span className="text-white font-medium drop-shadow-lg">Isabella Santos</span>
                </div>
                <button className="text-white drop-shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <div className="h-full w-1/3 bg-red-600"></div>
              </div>
              {/* Bottom controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button className="text-white drop-shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="text-white drop-shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
                <button className="text-white drop-shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Physical Attributes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Detalhes Físicos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gênero:</span>
                <span className="font-medium">Feminino</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferência:</span>
                <span className="font-medium">Heterossexual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">55 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Altura:</span>
                <span className="font-medium">1.68m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Etnia:</span>
                <span className="font-medium">Latina</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cor dos olhos:</span>
                <span className="font-medium">Castanhos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cabelo:</span>
                <span className="font-medium">Longo, Castanho</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calçado:</span>
                <span className="font-medium">37</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Silicone:</span>
                <span className="font-medium">Não</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tatuagens:</span>
                <span className="font-medium">Pequenas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Piercings:</span>
                <span className="font-medium">Orelhas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fumadora:</span>
                <span className="font-medium">Não</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Idiomas:</span>
                <span className="font-medium">PT, EN, ES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tariffs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Tarifas - Meu Local</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">1 hora</span>
                <span className="text-xl font-bold text-red-600">€150</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">2 horas</span>
                <span className="text-xl font-bold text-red-600">€280</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">Pernoite</span>
                <span className="text-xl font-bold text-red-600">€800</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Tarifas - Deslocação</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">1 hora</span>
                <span className="text-xl font-bold text-red-600">€200</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">2 horas</span>
                <span className="text-xl font-bold text-red-600">€350</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-800">Pernoite</span>
                <span className="text-xl font-bold text-red-600">€1000</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">*Taxas de deslocação podem aplicar-se</p>
          </div>
        </div>
      </div>
    </div>
  );
} 