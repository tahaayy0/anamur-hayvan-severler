import React, { useState } from 'react';
import { CreditCard, Landmark, Heart, ShieldCheck } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const Donate = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    amount: '',
    message: '',
    isAnonymous: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          phone: '',
          amount: '',
          message: '',
          isAnonymous: false
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      setError('Bağış gönderilirken bir hata oluştu');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-emerald-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Bağış Yapın</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sokak hayvanlarına umut olmak için yapacağınız her bağış, bir canın hayatını değiştirebilir.
          </p>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Bağışınızın Etkisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">50₺</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Günlük Mama</h3>
              <p className="text-gray-600">
                Bir sokak hayvanının bir günlük mama ihtiyacını karşılar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">200₺</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Temel Aşılar</h3>
              <p className="text-gray-600">
                Bir hayvanın temel aşılarının yapılmasını sağlar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">500₺</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tedavi Desteği</h3>
              <p className="text-gray-600">
                Yaralı bir hayvanın tedavi masraflarına katkı sağlar.
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bağış Yap</h1>
          <p className="text-lg text-gray-600">
            Sokak hayvanlarına yardım etmek için bağışta bulunabilirsiniz.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Banka Bilgileri</h2>
            <p className="text-gray-600 mt-2">
              Aşağıdaki IBAN numarasına bağışınızı yapabilirsiniz:
            </p>
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-mono">TR12 3456 7890 1234 5678 9012 34</p>
              <p className="text-sm text-gray-500 mt-2">Anamur Hayvan Koruma Derneği</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bağış Bildirim Formu
          </h2>
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-green-800">
                  Bağış bildiriminiz başarıyla alınmıştır. Onaylandıktan sonra listede görünecektir.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Yeni bağış bildirimi yap
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  placeholder="05XX XXX XX XX"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                  İsmim gizli kalsın
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bağış Tutarı (TL)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  min="1"
                  step="any"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mesajınız (İsteğe bağlı)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md"
                >
                  Bağış Bildir
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
       
      {/* Trust Indicators */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">%100 Şeffaflık</h3>
              <p className="text-gray-600">
                Tüm bağışlarımız ve harcamalarımız düzenli olarak raporlanır.
              </p>
            </div>
            <div className="text-center">
              <ShieldCheck className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600">
                Tüm ödemeleriniz SSL sertifikası ile güvence altındadır.
              </p>
            </div>
            <div className="text-center">
              <Landmark className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resmi Dernek</h3>
              <p className="text-gray-600">
                Resmi olarak tanınmış ve denetlenen bir sivil toplum kuruluşuyuz.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Donate;