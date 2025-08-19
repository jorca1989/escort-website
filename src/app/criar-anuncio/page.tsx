'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CriarAnuncioPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    age: '',
    phone: '',
    price: '',
    services: '',
    photos: [] as File[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photos') {
          (value as File[]).forEach((file, index) => {
            formDataToSend.append(`photos`, file);
          });
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

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">PortalEscorts</h1>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Anúncio Grátis</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título do Anúncio *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="Ex: Acompanhante VIP em Lisboa"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="Descreva seus serviços, personalidade, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade *
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Idade *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="18"
                  max="99"
                  required
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="+351 912 345 678"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Preço (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="150"
                />
              </div>
            </div>

            <div>
              <label htmlFor="services" className="block text-sm font-medium text-gray-700">
                Serviços Oferecidos
              </label>
              <textarea
                id="services"
                name="services"
                rows={3}
                value={formData.services}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="Liste os serviços que oferece..."
              />
            </div>

            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
                Fotos (máximo 5)
              </label>
              <input
                type="file"
                id="photos"
                name="photos"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB por foto.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                href="/dashboard"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Anúncio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 