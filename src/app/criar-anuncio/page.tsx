'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  // Basic Info
  name: string;
  age: string;
  city: string;
  phone: string;
  description: string;
  
  // Physical Details
  gender: string;
  preference: string;
  weight: string;
  height: string;
  ethnicity: string;
  eyeColor: string;
  hair: string;
  shoeSize: string;
  silicone: string;
  tattoos: string;
  piercings: string;
  smoker: string;
  languages: string;
  
  // Services
  services: string[];
  
  // Additional Details
  minDuration: string;
  advanceNotice: string;
  acceptsCard: string;
  regularDiscount: string;
  
  // Pricing (Optional)
  showPricing: boolean;
  pricing: {
    local: {
      oneHour: string;
      twoHours: string;
      overnight: string;
    };
    travel: {
      oneHour: string;
      twoHours: string;
      overnight: string;
    };
  };
  
  // Media
  photos: File[];
}

export default function CriarAnuncioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    city: '',
    phone: '',
    description: '',
    gender: '',
    preference: '',
    weight: '',
    height: '',
    ethnicity: '',
    eyeColor: '',
    hair: '',
    shoeSize: '',
    silicone: '',
    tattoos: '',
    piercings: '',
    smoker: '',
    languages: '',
    services: [],
    minDuration: '',
    advanceNotice: '',
    acceptsCard: '',
    regularDiscount: '',
    showPricing: false,
    pricing: {
      local: { oneHour: '', twoHours: '', overnight: '' },
      travel: { oneHour: '', twoHours: '', overnight: '' }
    },
    photos: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const steps = [
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Detalhes Físicos' },
    { number: 3, title: 'Serviços' },
    { number: 4, title: 'Preços (Opcional)' },
    { number: 5, title: 'Fotos' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingChange = (type: 'local' | 'travel', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: {
          ...prev.pricing[type],
          [field]: value
        }
      }
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: Array.from(e.target.files || [])
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photos') {
          (value as File[]).forEach((file) => {
            formDataToSend.append('photos', file);
          });
        } else if (key === 'pricing') {
          formDataToSend.append('pricing', JSON.stringify(value));
        } else if (key === 'services') {
          formDataToSend.append('services', JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('/api/listings/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      router.push('/dashboard');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade *</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="25"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade *</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                >
                  <option value="">Selecione uma cidade</option>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="+351 912 345 678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="Conte um pouco sobre você, sua personalidade, experiência..."
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gênero</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Trans">Trans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preferência</label>
                <select
                  value={formData.preference}
                  onChange={(e) => handleInputChange('preference', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Heterossexual">Heterossexual</option>
                  <option value="Homossexual">Homossexual</option>
                  <option value="Bissexual">Bissexual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="55"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Altura (m)</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="1.68"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Etnia</label>
                <select
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Latina">Latina</option>
                  <option value="Caucasiana">Caucasiana</option>
                  <option value="Africana">Africana</option>
                  <option value="Asiática">Asiática</option>
                  <option value="Mista">Mista</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cor dos Olhos</label>
                <select
                  value={formData.eyeColor}
                  onChange={(e) => handleInputChange('eyeColor', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Castanhos">Castanhos</option>
                  <option value="Azuis">Azuis</option>
                  <option value="Verdes">Verdes</option>
                  <option value="Cinzentos">Cinzentos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cabelo</label>
                <input
                  type="text"
                  value={formData.hair}
                  onChange={(e) => handleInputChange('hair', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Longo, Castanho"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Calçado</label>
                <input
                  type="number"
                  value={formData.shoeSize}
                  onChange={(e) => handleInputChange('shoeSize', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="37"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Silicone</label>
                <select
                  value={formData.silicone}
                  onChange={(e) => handleInputChange('silicone', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tatuagens</label>
                <select
                  value={formData.tattoos}
                  onChange={(e) => handleInputChange('tattoos', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Nenhuma">Nenhuma</option>
                  <option value="Pequenas">Pequenas</option>
                  <option value="Frequentes">Frequentes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Piercings</label>
                <input
                  type="text"
                  value={formData.piercings}
                  onChange={(e) => handleInputChange('piercings', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Orelhas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fumadora</label>
                <select
                  value={formData.smoker}
                  onChange={(e) => handleInputChange('smoker', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Idiomas</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="PT, EN, ES"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Serviços Oferecidos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Acompanhante social',
                  'Massagem relaxante',
                  'Jantar romântico',
                  'Eventos sociais',
                  'Massagem terapêutica',
                  'Acompanhante VIP',
                  'Serviços especiais',
                  'Outcall',
                  'Incall',
                  'Dupla'
                ].map((service) => (
                  <label key={service} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duração mínima</label>
                <select
                  value={formData.minDuration}
                  onChange={(e) => handleInputChange('minDuration', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="15 minutos">15 minutos</option>
                  <option value="30 minutos">30 minutos</option>
                  <option value="1 hora">1 hora</option>
                  <option value="2 horas">2 horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Aviso prévio</label>
                <select
                  value={formData.advanceNotice}
                  onChange={(e) => handleInputChange('advanceNotice', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="1 hora">1 hora</option>
                  <option value="2 horas">2 horas</option>
                  <option value="1 dia">1 dia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Aceita cartão</label>
                <select
                  value={formData.acceptsCard}
                  onChange={(e) => handleInputChange('acceptsCard', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Desconto para regulares</label>
                <select
                  value={formData.regularDiscount}
                  onChange={(e) => handleInputChange('regularDiscount', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Selecione</option>
                  <option value="5%">5%</option>
                  <option value="10%">10%</option>
                  <option value="15%">15%</option>
                  <option value="20%">20%</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.showPricing}
                onChange={(e) => handleInputChange('showPricing', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="text-lg font-medium text-gray-900">
                Mostrar preços no perfil
              </label>
            </div>

            {formData.showPricing ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tarifas - Meu Local</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">1 hora:</span>
                      <input
                        type="number"
                        value={formData.pricing.local.oneHour}
                        onChange={(e) => handlePricingChange('local', 'oneHour', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="150"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">2 horas:</span>
                      <input
                        type="number"
                        value={formData.pricing.local.twoHours}
                        onChange={(e) => handlePricingChange('local', 'twoHours', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="280"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">Pernoite:</span>
                      <input
                        type="number"
                        value={formData.pricing.local.overnight}
                        onChange={(e) => handlePricingChange('local', 'overnight', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="800"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tarifas - Deslocação</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">1 hora:</span>
                      <input
                        type="number"
                        value={formData.pricing.travel.oneHour}
                        onChange={(e) => handlePricingChange('travel', 'oneHour', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="200"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">2 horas:</span>
                      <input
                        type="number"
                        value={formData.pricing.travel.twoHours}
                        onChange={(e) => handlePricingChange('travel', 'twoHours', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="350"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium text-gray-700">Pernoite:</span>
                      <input
                        type="number"
                        value={formData.pricing.travel.overnight}
                        onChange={(e) => handlePricingChange('travel', 'overnight', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="1000"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Você pode optar por não mostrar preços publicamente e discutir valores via WhatsApp ou chamada.
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fotos (máximo 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB por foto.
              </p>
            </div>

            {formData.photos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Fotos selecionadas:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Anúncio Grátis</h2>
            <p className="text-gray-600">Complete os passos para criar seu perfil</p>
          </div>

          {/* Progress Steps - Fixed Layout */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.number ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    currentStep >= step.number ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-red-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
              >
                Anterior
              </button>

              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancelar
                </Link>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Criando...' : 'Criar Anúncio'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 