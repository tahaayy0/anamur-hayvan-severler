import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

interface Pet {
  _id: string;
  name: string;
  type: string;
  age: string;
  gender: string;
  description: string;
  image: string;
  health: string;
  character: string;
  isAdopted: boolean;
}

const AdoptablePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) {
        throw new Error('Veriler alınamadı');
      }
      const data = await response.json();
      setPets(data);
      setLoading(false);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchPets}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PawPrint className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sahiplendirmeyi Bekleyen Dostlarımız</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aşağıdaki dostlarımız sıcak bir yuva arıyor. Her biri özenle bakılmış, sağlık kontrolleri yapılmış ve sevgi dolu bir aileye hazır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {pet.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="font-semibold text-xl">{pet.name}</h3>
                  <p className="text-gray-600 text-sm">{pet.age} • {pet.gender}</p>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{pet.description}</p>
                <Link
                  to={`/pet/${pet._id}`}
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                >
                  Detayları Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdoptablePets;