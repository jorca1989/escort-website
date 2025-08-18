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
  age: number;
  price: number;
  services: string[];
  tags: string[];
  isVerified: boolean;
  isActive: boolean;
}

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    // Update filtered listings when search term or selected tags change
    const filtered = listings.filter(listing => {
      const matchesSearch = 
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.nationality.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => listing.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    setFilteredListings(filtered);
  }, [listings, searchTerm, selectedTags]);

  useEffect(() => {
    // Extract unique tags from all listings
    const tags = new Set<string>();
    listings.forEach(listing => {
      listing.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
  }, [listings]);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/admin/listings');
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setListings(data);
      setFilteredListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTagUpdate = async (listingId: string, newTags: string[]) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      
      if (!response.ok) throw new Error('Failed to update tags');
      
      // Update local state
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, tags: newTags }
          : listing
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tags');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Listings</h1>
        <Link 
          href="/admin/listings/new"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add New Listing
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, city, or nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6">
        {filteredListings.map((listing) => (
          <div 
            key={listing._id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{listing.name}</h2>
                <p className="text-gray-600">
                  {listing.city} • {listing.nationality} • {listing.age} anos
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  listing.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {listing.isVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  listing.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/admin/listings/${listing._id}/edit`)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleTagUpdate(listing._id, [...listing.tags, 'New Tag'])}
                className="text-green-600 hover:text-green-800"
              >
                Add Tag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 