import React, { useState, useEffect } from 'react';
import { Users, Heart, Calendar, Award } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  order: number;
}

const API_URL = 'http://localhost:5001/api';

const About = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_URL}/team`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-emerald-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-xl max-w-3xl mx-auto">
              2015 yılından beri Anamur'daki sokak hayvanları için çalışıyor, onlara umut oluyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Anamur'daki tüm sokak hayvanlarının sağlıklı, güvenli ve mutlu bir yaşam sürmelerini
                sağlamak için çalışıyoruz. Onları tedavi ediyor, rehabilite ediyor ve sıcak yuvalara
                kavuşturuyoruz. Aynı zamanda toplumda hayvan sevgisi ve sorumlu hayvan sahiplenme
                bilincini yaygınlaştırmayı hedefliyoruz.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Sokakta yaşayan hiçbir hayvanın açlık, hastalık veya şiddetle karşılaşmadığı bir
                Anamur hayal ediyoruz. Tüm toplumun hayvan haklarına saygı duyduğu, sokak
                hayvanlarının değerli birer can olarak görüldüğü bir gelecek için çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">1,500+</div>
              <div className="text-gray-600">Tedavi Edilen Hayvan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">800+</div>
              <div className="text-gray-600">Sahiplendirilen Hayvan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">200+</div>
              <div className="text-gray-600">Aktif Gönüllü</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">8</div>
              <div className="text-gray-600">Yıllık Tecrübe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ekibimiz</h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    className="object-cover w-full h-full"
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-emerald-600 mt-1">{member.role}</p>
                  <p className="mt-3 text-gray-500">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Şefkat</h3>
              <p className="text-gray-600">
                Tüm canlılara karşı sonsuz sevgi ve şefkatle yaklaşırız.
              </p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">İşbirliği</h3>
              <p className="text-gray-600">
                Toplumun tüm kesimleriyle birlikte çalışmaya önem veririz.
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sürdürülebilirlik</h3>
              <p className="text-gray-600">
                Uzun vadeli çözümler üretmek için çalışırız.
              </p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profesyonellik</h3>
              <p className="text-gray-600">
                İşimizi en yüksek standartlarda yapmaya özen gösteririz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;