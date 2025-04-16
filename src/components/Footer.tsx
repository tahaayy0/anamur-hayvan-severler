import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Anamur Hayvan Severler Derneği</h3>
            <p className="text-emerald-200">
              Sokak hayvanlarına umut olmak için çalışıyoruz.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-emerald-200 hover:text-white">Hakkımızda</Link></li>
              <li><Link to="/adoptable-pets" className="text-emerald-200 hover:text-white">Sahiplendir</Link></li>
              <li><Link to="/volunteer" className="text-emerald-200 hover:text-white">Gönüllü Ol</Link></li>
              <li><Link to="/donate" className="text-emerald-200 hover:text-white">Bağış Yap</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="text-emerald-200">Anamur, Mersin</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span className="text-emerald-200">0324 XXX XX XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="text-emerald-200">info@anamurhayvanseverler.org</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-200 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-emerald-200 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-emerald-700 text-center text-emerald-200">
          <p>&copy; {new Date().getFullYear()} Anamur Hayvan Severler Derneği. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;