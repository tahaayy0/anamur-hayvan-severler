import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PawPrint } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Sahiplendirilecek Hayvanlar', path: '/adoptable-pets' },
    { name: 'Hakkımızda', path: '/about' },
    { name: 'Gönüllü Ol', path: '/volunteer' },
    { name: 'İletişim', path: '/contact' },
  ];

  return (
    <nav className="bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8" />
            <span className="font-bold text-xl">AHSD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium"
            >
              Bağış Yap
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-emerald-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:bg-emerald-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-orange-500 hover:bg-orange-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Bağış Yap
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;