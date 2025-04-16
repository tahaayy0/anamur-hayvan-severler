import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  subject: z.string().min(5, 'Konu en az 5 karakter olmalıdır'),
  message: z.string().min(20, 'Mesajınız en az 20 karakter olmalıdır')
});

type ContactForm = z.infer<typeof contactSchema>;

const API_URL = 'http://localhost:5001/api';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const response = await fetch(`${API_URL}/contact-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Mesajınız alınmıştır. En kısa sürede size dönüş yapacağız.');
        reset();
      } else {
        alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya yardım talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-emerald-600 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold">Adres</h3>
                    <p className="text-gray-600">
                      Yeşilyurt Mahallesi, Park Caddesi No:123
                      <br />
                      Anamur, Mersin
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-emerald-600 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold">Telefon</h3>
                    <p className="text-gray-600">+90 324 XXX XX XX</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-emerald-600 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold">E-posta</h3>
                    <p className="text-gray-600">info@anamurhayvanseverler.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-emerald-600 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold">Çalışma Saatleri</h3>
                    <p className="text-gray-600">
                      Pazartesi - Cumartesi: 09:00 - 18:00
                      <br />
                      Pazar: 10:00 - 16:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12866.893671641396!2d32.83558!3d36.07515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc7b3c3e3b3b3b%3A0x3c3b3b3b3b3b3b3b!2sAnamur%2C+Mersin!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Bize Ulaşın</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                  <label className="block text-sm font-medium text-gray-700">Konu</label>
                  <input
                    type="text"
                    {...register('subject')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mesajınız</label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold"
                >
                  Mesaj Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;