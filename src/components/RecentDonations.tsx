import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Donation {
  _id: string;
  fullName: string;
  amount: number;
  message?: string;
  createdAt: string;
  isAnonymous?: boolean;
}

const API_URL = 'http://localhost:5001/api';

const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${API_URL}/donations/approved`);
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };

    fetchDonations();
    // Her 5 dakikada bir güncelle
    const interval = setInterval(fetchDonations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (donations.length === 0) {
    return null;
  }

  return (
    <div className="bg-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Son Bağışlar</h2>
          <p className="mt-2 text-lg text-gray-600">
            Derneğimize destek olan bağışçılarımız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white rounded-lg shadow-sm p-6 flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {donation.isAnonymous 
                    ? donation.fullName.substring(0, 1) + '*'.repeat(donation.fullName.length - 2) + donation.fullName.slice(-1)
                    : donation.fullName
                  }
                </h3>
                <p className="mt-1 text-emerald-600 font-semibold">
                  {donation.amount.toLocaleString('tr-TR')} ₺
                </p>
                {donation.message && (
                  <p className="mt-2 text-gray-500 text-sm">{donation.message}</p>
                )}
                <p className="mt-2 text-sm text-gray-400">
                  {new Date(donation.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentDonations; 