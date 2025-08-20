"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  profileName: string;
  age: string;
  city: string;
  description: string;
}

export default function CriarPerfilPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'escort' | 'user'>('escort');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    profileName: '',
    age: '',
    city: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountType,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const result = await response.json();
      
      // Redirect to main dashboard (user will be automatically logged in)
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">Criar Conta</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-lg border ${accountType === 'escort' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                onClick={() => setAccountType('escort')}
              >
                Sou Escort
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-lg border ${accountType === 'user' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                onClick={() => setAccountType('user')}
              >
                Sou Cliente
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
              required 
            />
          </div>

          {/* Escort Profile Info */}
          {accountType === 'escort' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome de Perfil</label>
                <input 
                  name="profileName"
                  type="text" 
                  value={formData.profileName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade</label>
                <input 
                  name="age"
                  type="number" 
                  min="18" 
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input 
                  name="city"
                  type="text" 
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900" 
                  rows={3} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                <input 
                  name="profilePhoto"
                  type="file" 
                  accept="image/*" 
                  className="mt-1 w-full" 
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-pink-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
} 