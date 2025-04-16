import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, PawPrint, Users } from 'lucide-react';
import RecentDonations from '../components/RecentDonations';

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

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();
        // Sadece ilk 3 hayvanı göster
        setPets(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Onlar İçin Bir Umut Olun
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Anamur'daki sokak hayvanlarına yardım eli uzatıyoruz. Siz de bu yolculukta bize katılın.
            </p>
            <div className="space-x-4">
              <Link
                to="/donate"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold inline-block"
              >
                Bağış Yap
              </Link>
              <Link
                to="/volunteer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold inline-block"
              >
                Gönüllü Ol
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sokaktaki dostlarımızın sesi olmak, onlara güvenli bir yuva sağlamak ve toplumda hayvan sevgisini yaygınlaştırmak için çalışıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bakım ve Tedavi</h3>
              <p className="text-gray-600">Sokak hayvanlarına tıbbi bakım ve rehabilitasyon hizmetleri sağlıyoruz.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sahiplendirme</h3>
              <p className="text-gray-600">Rehabilite ettiğimiz hayvanları sevgi dolu yuvalara kavuşturuyoruz.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Toplum Bilinci</h3>
              <p className="text-gray-600">Hayvan hakları ve refahı konusunda toplumu bilinçlendiriyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Adoptable Pets Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Sahiplenmek İster Misiniz?</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Sıcak bir yuvaya kavuşmayı bekleyen can dostlarımızla tanışın
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div className="text-center mt-8">
            <Link
              to="/adoptable-pets"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10"
            >
              Tüm Dostlarımızı Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Onlara Yardım Etmek İster misiniz?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Küçük destekleriniz, sokak hayvanlarının hayatında büyük değişiklikler yaratabilir.
          </p>
          <div className="space-x-4">
            <Link
              to="/donate"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold inline-block"
            >
              Bağış Yap
            </Link>
            <Link
              to="/volunteer"
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold inline-block"
            >
              Gönüllü Ol
            </Link>
          </div>
        </div>
      </section>

      <RecentDonations />
    </div>
  );
};

export default Home;