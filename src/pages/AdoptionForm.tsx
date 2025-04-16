import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const API_URL = 'http://localhost:5001/api';

const adoptionSchema = z.object({
  fullName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  hasExperience: z.boolean(),
  livingConditions: z.string().min(10, 'Yaşam koşullarınızı detaylı açıklayınız'),
  additionalNotes: z.string().optional()
});

type AdoptionForm = z.infer<typeof adoptionSchema>;

const AdoptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdoptionForm>({
    resolver: zodResolver(adoptionSchema)
  });

  const onSubmit = async (data: AdoptionForm) => {
    if (!pet?._id) {
      alert('Lütfen bir hayvan seçiniz');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/adoption-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          petId: pet._id
        })
      });

      if (response.ok) {
        alert('Başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Başvuru gönderilirken bir hata oluştu: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      alert('Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Lütfen önce bir hayvan seçiniz.</p>
          <button
            onClick={() => navigate('/adoptable-pets')}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
          >
            Sahiplendirme Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Sahiplendirme Başvuru Formu
          </h1>
          <div className="mb-8 p-4 bg-emerald-50 rounded-lg">
            <p className="text-emerald-800">
              <strong>{pet.name}</strong> isimli dostumuzu sahiplenmek için başvuruyorsunuz.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adres</label>
              <textarea
                {...register('address')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Yaşam Koşullarınız</label>
              <textarea
                {...register('livingConditions')}
                rows={3}
                placeholder="Ev/apartman durumu, bahçe var mı, evde başka hayvan var mı?"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.livingConditions && (
                <p className="mt-1 text-sm text-red-600">{errors.livingConditions.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hasExperience')}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Daha önce evcil hayvan sahipliği deneyimim var
                </label>
              </div>
              {errors.hasExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.hasExperience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ek Notlar</label>
              <textarea
                {...register('additionalNotes')}
                rows={3}
                placeholder="Eklemek istediğiniz başka bilgiler varsa yazabilirsiniz"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold"
            >
              Başvuruyu Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;