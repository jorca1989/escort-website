'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  _id: string;
  name: string;
  city: string;
  nationality: string;
  hairColor: string;
  height: number;
  weight: number;
  age: number;
  price: number;
  services: string[];
  tags: string[];
  images: string[];
  description: string;
  isVerified: boolean;
  isActive: boolean;
}

const SERVICES = [
  'Webcam',
  'BDSM',
  'Massagem',
  'Sexo Oral',
  'Sexo Anal',
  'Beijo na Boca',
  'Fetiche',
  'Casais',
  'A Domicílio',
  'Com Local',
  'Viagens',
  'Eventos',
  'Noite Inteira',
  'Rapidinha'
];

const HAIR_COLORS = ['Loira', 'Morena', 'Ruiva', 'Negra', 'Castanha', 'Colorida'];
const NATIONALITIES = ['Brasileira', 'Portuguesa', 'Colombiana', 'Venezuelana', 'Angolana', 'Outra'];

export default function EditListing({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (params.id !== 'new') {
      fetchListing();
    } else {
      setListing({
        _id: '',
        name: '',
        city: '',
        nationality: '',
        hairColor: '',
        height: 0,
        weight: 0,
        age: 0,
        price: 0,
        services: [],
        tags: [],
        images: [],
        description: '',
        isVerified: false,
        isActive: true
      });
      setLoading(false);
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/admin/listings/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch listing');
      const data = await response.json();
      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/listings/${params.id === 'new' ? '' : params.id}`, {
        method: params.id === 'new' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing),
      });

      if (!response.ok) throw new Error('Failed to save listing');
      
      router.push('/admin/listings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save listing');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!listing) return;
    
    const { name, value, type } = e.target;
    setListing({
      ...listing,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleServiceToggle = (service: string) => {
    if (!listing) return;
    
    setListing({
      ...listing,
      services: listing.services.includes(service)
        ? listing.services.filter(s => s !== service)
        : [...listing.services, service]
    });
  };

  const handleAddTag = () => {
    if (!listing || !newTag.trim()) return;
    
    setListing({
      ...listing,
      tags: [...listing.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!listing) return;
    
    setListing({
      ...listing,
      tags: listing.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!listing) return <div className="p-8">Listing not found</div>;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'Create New Listing' : 'Edit Listing'}
          </h1>
          <Link
            href="/admin/listings"
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Listings
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={listing.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={listing.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <select
                  name="nationality"
                  value={listing.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Select Nationality</option>
                  {NATIONALITIES.map(nat => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hair Color</label>
                <select
                  name="hairColor"
                  value={listing.hairColor}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Select Hair Color</option>
                  {HAIR_COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Physical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={listing.height}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={listing.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={listing.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SERVICES.map(service => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={listing.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Price and Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Price and Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (€/hour)</label>
                <input
                  type="number"
                  name="price"
                  value={listing.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={listing.isVerified}
                    onChange={(e) => setListing({ ...listing, isVerified: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Verified</span>
                </label>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={listing.isActive}
                    onChange={(e) => setListing({ ...listing, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <textarea
              name="description"
              value={listing.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 