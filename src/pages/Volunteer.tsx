import React, { useState } from 'react';
import { Heart, Users, Calendar, PawPrint } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const API_URL = 'http://localhost:5001/api';

const volunteerSchema = z.object({
  fullName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  age: z.string().min(1, 'Yaşınızı belirtiniz'),
  occupation: z.string().min(2, 'Mesleğinizi belirtiniz'),
  availability: z.string().min(1, 'Müsait olduğunuz zamanları belirtiniz'),
  experience: z.string().min(10, 'Deneyimlerinizi açıklayınız'),
  interests: z.array(z.string()).min(1, 'En az bir ilgi alanı seçiniz'),
  motivation: z.string().min(20, 'Motivasyonunuzu açıklayınız'),
  agreement: z.boolean().refine(val => val === true, 'Şartları kabul etmelisiniz')
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

const Volunteer = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema)
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: VolunteerForm) => {
    try {
      setSubmitError(null);
      const response = await fetch(`${API_URL}/volunteer-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Başvuru gönderilirken bir hata oluştu');
      }

      reset();
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Bir hata oluştu');
      console.error('Form submission error:', error);
    }
  };

  const volunteerAreas = [
    {
      icon: <Heart className="h-12 w-12 text-emerald-600" />,
      title: 'Barınak Desteği',
      description: 'Barınaktaki hayvanların bakımı, temizliği ve beslenmesine yardımcı olun.'
    },
    {
      icon: <Users className="h-12 w-12 text-emerald-600" />,
      title: 'Sosyal Medya',
      description: 'Sosyal medya hesaplarımızın yönetimi ve içerik üretiminde destek olun.'
    },
    {
      icon: <Calendar className="h-12 w-12 text-emerald-600" />,
      title: 'Etkinlik Organizasyonu',
      description: 'Farkındalık etkinlikleri ve bağış kampanyalarının organizasyonuna katkıda bulunun.'
    },
    {
      icon: <PawPrint className="h-12 w-12 text-emerald-600" />,
      title: 'Sahiplendirme',
      description: 'Hayvanların yeni ailelerine kavuşması sürecinde yardımcı olun.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-emerald-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Gönüllü Olun</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sokak hayvanlarına yardım etmek için gönüllülerimiz arasına katılın.
            Her yetenek ve her yardım değerlidir.
          </p>
        </div>
      </div>

      {/* Volunteer Areas */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gönüllülük Alanları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerAreas.map((area, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4 flex justify-center">{area.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gönüllü Başvuru Formu</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {submitError}
              </div>
            )}

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                Başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
              </div>
            ) : (
              <>
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
                  <label className="block text-sm font-medium text-gray-700">Yaş</label>
                  <input
                    type="number"
                    {...register('age')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Meslek</label>
                  <input
                    type="text"
                    {...register('occupation')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Müsait Olduğunuz Zamanlar</label>
                  <select
                    {...register('availability')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="weekday_morning">Hafta İçi - Sabah</option>
                    <option value="weekday_afternoon">Hafta İçi - Öğleden Sonra</option>
                    <option value="weekday_evening">Hafta İçi - Akşam</option>
                    <option value="weekend">Hafta Sonu</option>
                    <option value="flexible">Esnek</option>
                  </select>
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">İlgi Alanları</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value="animal_care"
                        {...register('interests')}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Hayvan Bakımı</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value="social_media"
                        {...register('interests')}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Sosyal Medya</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value="event_organization"
                        {...register('interests')}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Etkinlik Organizasyonu</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value="adoption"
                        {...register('interests')}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Sahiplendirme</label>
                    </div>
                  </div>
                  {errors.interests && (
                    <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hayvanlarla İlgili Deneyimleriniz
                  </label>
                  <textarea
                    {...register('experience')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Daha önce hayvanlarla ilgili çalışmalarınız veya deneyimleriniz varsa belirtiniz."
                  ></textarea>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Neden Gönüllü Olmak İstiyorsunuz?
                  </label>
                  <textarea
                    {...register('motivation')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Motivasyonunuzu ve beklentilerinizi paylaşın."
                  ></textarea>
                  {errors.motivation && (
                    <p className="mt-1 text-sm text-red-600">{errors.motivation.message}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('agreement')}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-1"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Gönüllülük şartlarını okudum ve kabul ediyorum. Verdiğim bilgilerin doğruluğunu
                    onaylıyorum.
                  </label>
                </div>
                {errors.agreement && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreement.message}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold"
                >
                  Başvuruyu Gönder
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;