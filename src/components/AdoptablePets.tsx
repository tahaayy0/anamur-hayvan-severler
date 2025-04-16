import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

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

const API_URL = 'http://localhost:5001/api';

const AdoptablePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`);
        if (!response.ok) {
          throw new Error('Hayvanlar yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setPets(data);
      } catch (error) {
        setError('Hayvanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PawPrint className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Sahiplendirilebilir Dostlarımız</h2>
          <p className="mt-2 text-lg text-gray-600">
            Yeni bir dost edinmek için aşağıdaki hayvanlarımızdan birini seçebilirsiniz
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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