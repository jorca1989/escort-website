'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ProfileGrid from '@/components/ProfileGrid';
import ProfileList from '@/components/ProfileList';
import FilterSidebar from '@/components/FilterSidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Profile } from '@/components/ProfileGrid';

export default function ProfilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  // Filter state
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Feminino', count: 0, checked: false },
    { name: 'MILF', count: 0, checked: false },
    { name: 'Trans', count: 0, checked: false },
    { name: 'VIP', count: 0, checked: false },
  ]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ages, setAges] = useState([
    { label: '18-25', checked: false },
    { label: '26-35', checked: false },
    { label: '36-45', checked: false },
    { label: '45+', checked: false },
  ]);
  const [availability, setAvailability] = useState([
    { label: 'Online agora', checked: false },
    { label: 'Verificado', checked: false },
    { label: 'Com fotos', checked: false },
  ]);
  const [hairColors, setHairColors] = useState([
    { label: 'Loiro', checked: false },
    { label: 'Moreno', checked: false },
    { label: 'Ruivo', checked: false },
    { label: 'Preto', checked: false },
    { label: 'Castanho', checked: false },
  ]);
  const [eyeColors, setEyeColors] = useState([
    { label: 'Azul', checked: false },
    { label: 'Verde', checked: false },
    { label: 'Castanho', checked: false },
    { label: 'Preto', checked: false },
    { label: 'Cinza', checked: false },
  ]);
  const [ethnicities, setEthnicities] = useState([
    { label: 'Caucasiana', checked: false },
    { label: 'Africana', checked: false },
    { label: 'Asiática', checked: false },
    { label: 'Latina', checked: false },
    { label: 'Mista', checked: false },
  ]);
  const [cities, setCities] = useState(['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Aveiro', 'Faro']);

  // Mock profiles array
  const allProfiles: Profile[] = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Sofia ${i + 1}`,
    age: 20 + (i % 15),
    city: ['Lisboa', 'Porto', 'Coimbra', 'Braga'][i % 4],
    height: 155 + (i % 20),
    weight: 45 + (i % 20),
    price: 100 + (i * 25),
    rating: 5,
    reviews: 10 + (i % 50),
    isOnline: i % 3 === 0,
    isVerified: i % 4 === 0,
    image: `https://images.unsplash.com/photo-151950102${5260 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
    description: 'Olá, sou a Sofia! Uma acompanhante elegante e sofisticada, pronta para proporcionar momentos únicos e inesquecíveis. Discreta e carinhosa.'
  }));

  // Filtering logic
  const filteredProfiles = allProfiles.filter(profile => {
    // Search
    if (search && !profile.name.toLowerCase().includes(search.toLowerCase()) && !profile.city.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // City
    if (city && profile.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }
    // Categories (mock: Feminino, MILF, Trans, VIP)
    const selectedCategories = categories.filter(c => c.checked).map(c => c.name);
    if (selectedCategories.length > 0) {
      if (selectedCategories.includes('MILF') && profile.age < 36) return false;
      if (selectedCategories.includes('Trans') && !profile.name.toLowerCase().includes('trans')) return false;
      if (selectedCategories.includes('VIP') && profile.price < 200) return false;
      if (selectedCategories.includes('Feminino') && profile.name.toLowerCase().includes('trans')) return false;
    }
    // Price
    if (priceRange.min && profile.price < Number(priceRange.min)) return false;
    if (priceRange.max && profile.price > Number(priceRange.max)) return false;
    // Age
    const selectedAges = ages.filter(a => a.checked).map(a => a.label);
    if (selectedAges.length > 0) {
      const ageMatch = selectedAges.some(label => {
        if (label === '18-25') return profile.age >= 18 && profile.age <= 25;
        if (label === '26-35') return profile.age >= 26 && profile.age <= 35;
        if (label === '36-45') return profile.age >= 36 && profile.age <= 45;
        if (label === '45+') return profile.age >= 46;
        return false;
      });
      if (!ageMatch) return false;
    }
    // Availability
    const selectedAvail = availability.filter(a => a.checked).map(a => a.label);
    if (selectedAvail.length > 0) {
      if (selectedAvail.includes('Online agora') && !profile.isOnline) return false;
      if (selectedAvail.includes('Verificado') && !profile.isVerified) return false;
      // 'Com fotos' always true in mock
    }
    // Hair Color (mock filtering - in real app this would use actual profile data)
    const selectedHairColors = hairColors.filter(h => h.checked).map(h => h.label);
    if (selectedHairColors.length > 0) {
      // Mock: assign hair colors based on profile ID for demo
      const mockHairColors = ['Loiro', 'Moreno', 'Ruivo', 'Preto', 'Castanho'];
      const profileHairColor = mockHairColors[profile.id % mockHairColors.length];
      if (!selectedHairColors.includes(profileHairColor)) return false;
    }
    // Eye Color (mock filtering)
    const selectedEyeColors = eyeColors.filter(e => e.checked).map(e => e.label);
    if (selectedEyeColors.length > 0) {
      const mockEyeColors = ['Azul', 'Verde', 'Castanho', 'Preto', 'Cinza'];
      const profileEyeColor = mockEyeColors[profile.id % mockEyeColors.length];
      if (!selectedEyeColors.includes(profileEyeColor)) return false;
    }
    // Ethnicity (mock filtering)
    const selectedEthnicities = ethnicities.filter(e => e.checked).map(e => e.label);
    if (selectedEthnicities.length > 0) {
      const mockEthnicities = ['Caucasiana', 'Africana', 'Asiática', 'Latina', 'Mista'];
      const profileEthnicity = mockEthnicities[profile.id % mockEthnicities.length];
      if (!selectedEthnicities.includes(profileEthnicity)) return false;
    }
    return true;
  });

  // Pagination state (must come after filteredProfiles is declared)
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 12;
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const paginatedProfiles = filteredProfiles.slice((currentPage - 1) * profilesPerPage, currentPage * profilesPerPage);

  // Sync filter state with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('cidade', city.toLowerCase());
    categories.forEach(cat => { if (cat.checked) params.append('categoria', cat.name.toLowerCase()); });
    if (priceRange.min) params.set('preco-min', priceRange.min);
    if (priceRange.max) params.set('preco-max', priceRange.max);
    ages.forEach(age => { if (age.checked) params.append('idade', age.label); });
    availability.forEach(a => { if (a.checked) params.append('disponibilidade', a.label.toLowerCase().replace(' ', '-')); });
    router.replace(`?${params.toString()}`);
  }, [search, city, categories, priceRange, ages, availability]);

  // Sync state from URL on load or URL change
  useEffect(() => {
    const params = searchParams;
    setSearch(params.get('search') || '');
    setCity(params.get('cidade') || '');
    setCategories(categories.map(cat => ({
      ...cat,
      checked: params.getAll('categoria').includes(cat.name.toLowerCase())
    })));
    setPriceRange({
      min: params.get('preco-min') || '',
      max: params.get('preco-max') || ''
    });
    setAges(ages.map(age => ({
      ...age,
      checked: params.getAll('idade').includes(age.label)
    })));
    setAvailability(availability.map(a => ({
      ...a,
      checked: params.getAll('disponibilidade').includes(a.label.toLowerCase().replace(' ', '-'))
    })));
  }, [searchParams]);

  // Handlers
  const handleCategoryChange = (name: string) => {
    setCategories(categories.map(cat => cat.name === name ? { ...cat, checked: !cat.checked } : cat));
  };
  const handleAgeChange = (label: string) => {
    setAges(ages.map(age => age.label === label ? { ...age, checked: !age.checked } : age));
  };
  const handleAvailabilityChange = (label: string) => {
    setAvailability(availability.map(a => a.label === label ? { ...a, checked: !a.checked } : a));
  };
  const handleHairColorChange = (label: string) => {
    setHairColors(hairColors.map(hair => hair.label === label ? { ...hair, checked: !hair.checked } : hair));
  };
  const handleEyeColorChange = (label: string) => {
    setEyeColors(eyeColors.map(eye => eye.label === label ? { ...eye, checked: !eye.checked } : eye));
  };
  const handleEthnicityChange = (label: string) => {
    setEthnicities(ethnicities.map(ethnicity => ethnicity.label === label ? { ...ethnicity, checked: !ethnicity.checked } : ethnicity));
  };
  const handleClear = () => {
    setSearch('');
    setCity('');
    setCategories(categories.map(cat => ({ ...cat, checked: false })));
    setPriceRange({ min: '', max: '' });
    setAges(ages.map(age => ({ ...age, checked: false })));
    setAvailability(availability.map(a => ({ ...a, checked: false })));
    setHairColors(hairColors.map(hair => ({ ...hair, checked: false })));
    setEyeColors(eyeColors.map(eye => ({ ...eye, checked: false })));
    setEthnicities(ethnicities.map(ethnicity => ({ ...ethnicity, checked: false })));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header Section */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Todos os Perfis
              </h1>
              <p className="text-gray-600 mt-2">
                Encontrados <span className="font-semibold text-red-600">1,247</span> perfis
              </p>
            </div>
            
            {/* View Toggle & Sort */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Filter Toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <i className="fas fa-filter mr-2"></i>Filtros
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  aria-label="Ver em grade"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  aria-label="Ver em lista"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-500 bg-white"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
                <option value="price-low">Preço: Menor</option>
                <option value="price-high">Preço: Maior</option>
                <option value="rating">Melhor Avaliação</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters and Banner */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
            <FilterSidebar
              showFilters={showFilters}
              search={search}
              onSearchChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              city={city}
              onCityChange={(e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
              cities={cities}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              ages={ages}
              onAgeChange={handleAgeChange}
              availability={availability}
              onAvailabilityChange={handleAvailabilityChange}
              hairColors={hairColors}
              onHairColorChange={handleHairColorChange}
              eyeColors={eyeColors}
              onEyeColorChange={handleEyeColorChange}
              ethnicities={ethnicities}
              onEthnicityChange={handleEthnicityChange}
              onClear={handleClear}
            />
            {/* Sidebar Banner (only on lg+) */}
            <div className="hidden lg:block relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src="/banners/colombian-banner.jpg"
                alt="Promoção Webcams Premium"
                className="w-full h-[365px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 gap-3">
                <h3 className="text-2xl font-bold text-white drop-shadow text-center">Webcams Premium</h3>
                <p className="text-white text-base drop-shadow text-center leading-tight max-w-xs">
                  Assista transmissões ao vivo ou agende uma sessão exclusiva com as melhores performers da Colômbia!
                </p>
                <button className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 transition text-base mt-2">
                  Agendar Webcam
                </button>
              </div>
            </div>
            {/* Second Sidebar Banner (only on lg+) */}
            <div className="hidden lg:block mt-6 relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src="/banners/colombian-banner.jpg"
                alt="Promoção Webcams Premium"
                className="w-full h-[365px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 gap-3">
                <h3 className="text-2xl font-bold text-white drop-shadow text-center">Webcams Premium</h3>
                <p className="text-white text-base drop-shadow text-center leading-tight max-w-xs">
                  Assista transmissões ao vivo ou agende uma sessão exclusiva com as melhores performers da Colômbia!
                </p>
                <button className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 transition text-base mt-2">
                  Agendar Webcam
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'grid' ? <ProfileGrid profiles={paginatedProfiles} /> : <ProfileList profiles={paginatedProfiles} />}

            {/* Horizontal Banner below grid/list, above pagination */}
            <div className="mt-10 mb-8 relative rounded-xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
              <img
                src="/banners/colombian-banner.jpg"
                alt="Promoção Webcams Premium"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-8 gap-3">
                <h2 className="text-2xl font-bold text-white drop-shadow">Webcams Premium</h2>
                <p className="text-lg text-white drop-shadow text-center max-w-2xl">
                  Assista transmissões ao vivo ou agende uma sessão exclusiva com as melhores performers da Colômbia!
                </p>
                <button className="bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition text-lg mt-2 shadow-lg">
                  Agendar Webcam
                </button>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 