'use client';

import Link from 'next/link';

export default function MobileMenu() {
  return (
    <div className="md:hidden" x-data="{ open: false }">
      <button @click="open = !open" className="text-gray-700 hover:text-red-600 focus:outline-none">
        <i className="fas fa-bars text-xl"></i>
      </button>
      
      {/* Mobile menu */}
      <div x-show="open" x-transition className="absolute top-16 right-4 bg-white rounded-lg shadow-lg py-2 w-48">
        <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
        <Link href="/perfis" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Perfis</Link>
        <Link href="/cidades" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cidades</Link>
        <Link href="/criar-perfil" className="block px-4 py-2 text-red-600 font-medium">Criar Perfil</Link>
        <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
      </div>
    </div>
  );
} 