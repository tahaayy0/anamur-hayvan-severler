import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, PawPrint, Calendar, User, Activity, Shield, MessageCircle } from 'lucide-react';

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

// Örnek ek fotoğraflar (normalde backend'den gelecek)
const SAMPLE_ADDITIONAL_IMAGES = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
];

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`${API_URL}/pets/${id}`);
        if (!response.ok) {
          throw new Error('Pet bulunamadı');
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAdopt = () => {
    if (pet) {
      navigate(`/adopt/${pet._id}`, { state: { pet } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
          <p className="text-gray-700">{error || 'Pet bulunamadı'}</p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-96 w-full object-cover md:h-full"
              src={pet.image}
              alt={pet.name}
            />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              {pet.isAdopted ? (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  Sahiplendirildi
                </span>
              ) : (
                <button
                  onClick={handleAdopt}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sahiplen
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-500">Tür</h2>
                <p className="text-lg text-gray-900">{pet.type}</p>
              </div>

              <div className="flex space-x-8">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Yaş</h2>
                  <p className="text-lg text-gray-900">{pet.age}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Cinsiyet</h2>
                  <p className="text-lg text-gray-900">{pet.gender}</p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500">Açıklama</h2>
                <p className="text-gray-700 whitespace-pre-line">{pet.description}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500">Sağlık Durumu</h2>
                <p className="text-gray-700">{pet.health}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500">Karakter Özellikleri</h2>
                <p className="text-gray-700">{pet.character}</p>
              </div>
            </div>

            <Link
              to="/adoptable-pets"
              className="mt-8 inline-flex items-center text-blue-500 hover:text-blue-700"
            >
              ← Sahiplendirilecek Hayvanlara Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail; 