import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdoptablePets from './pages/AdoptablePets';
import AdoptionForm from './pages/AdoptionForm';
import About from './pages/About';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PetDetail from './pages/PetDetail';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adoptable-pets" element={<AdoptablePets />} />
          <Route path="/adopt/:id" element={<AdoptionForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/pet/:id" element={<PetDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;