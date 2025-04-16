import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Users, 
  PawPrint, 
  FileText, 
  Check, 
  X,
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  createdAt: string;
}

interface Admin {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AdoptionForm {
  _id: string;
  petId: {
    _id: string;
    name: string;
    type: string;
  };
  fullName: string;
  email: string;
  phone: string;
  address: string;
  hasExperience: boolean;
  livingConditions: string;
  additionalNotes?: string;
  status: 'Beklemede' | 'Onaylandı' | 'Reddedildi';
  createdAt: string;
}

type DonationAction = 'approved' | 'rejected';
type DonationStatus = 'pending' | 'approved' | 'rejected';

interface Donation {
  _id: string;
  fullName: string;
  phone: string;
  amount: number;
  message?: string;
  status: DonationStatus;
  createdAt: string;
  isAnonymous: boolean;
}

interface Form {
  _id: string;
  type: 'volunteer' | 'adoption' | 'contact';
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  petId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  order: number;
}

const API_URL = 'http://localhost:5001/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pets' | 'admins' | 'forms' | 'donations' | 'team'>('overview');
  const [pets, setPets] = useState<Pet[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({
    totalPets: 0,
    adoptedPets: 0,
    pendingForms: 0,
    totalAdmins: 0,
    totalDonations: 0
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    age: '',
    gender: '',
    description: '',
    image: '',
    health: '',
    character: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    role: '',
    image: '',
    description: '',
    order: 0
  });
  const [formType, setFormType] = useState<'all' | 'volunteer' | 'adoption' | 'contact'>('all');
  const [formStatus, setFormStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const query = new URLSearchParams();
      if (formType !== 'all') query.set('type', formType);
      if (formStatus !== 'all') query.set('status', formStatus);
      
      const response = await fetch(`${API_URL}/admin/forms?${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPets();
    fetchAdmins();
    fetchForms();
    fetchDonations();
    fetchTeam();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'pets') {
      fetchPets();
    } else if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'forms') {
      fetchForms();
    } else if (activeTab === 'donations') {
      fetchDonations();
    } else if (activeTab === 'team') {
      fetchTeam();
    }
  }, [activeTab]);

  useEffect(() => {
    setStats({
      totalPets: pets.length,
      adoptedPets: pets.filter(pet => pet.isAdopted).length,
      pendingForms: forms.filter(form => form.status === 'pending').length,
      totalAdmins: admins.length,
      totalDonations: donations.filter(d => d.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)
    });
  }, [pets, forms, admins, donations]);

  useEffect(() => {
    if (activeTab === 'forms') {
      fetchForms();
    }
  }, [activeTab, formType, formStatus]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminFormData)
      });

      if (response.ok) {
        setIsAddAdminModalOpen(false);
        setAdminFormData({
          username: '',
          email: '',
          password: ''
        });
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/users/${currentAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminFormData)
      });

      if (response.ok) {
        setIsEditAdminModalOpen(false);
        setCurrentAdmin(null);
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm('Bu admin kullanıcısını silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAdmins();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/pets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          isAdopted: false
        })
      });

      if (response.ok) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          type: '',
          age: '',
          gender: '',
          description: '',
          image: '',
          health: '',
          character: ''
        });
        fetchPets();
      }
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  const handleEditPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/pets/${currentPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setCurrentPet(null);
        setFormData({
          name: '',
          type: '',
          age: '',
          gender: '',
          description: '',
          image: '',
          health: '',
          character: ''
        });
        fetchPets();
      }
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm('Bu hayvanı silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleToggleAdoption = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAdopted: !currentStatus })
      });

      if (response.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error('Error updating adoption status:', error);
    }
  };

  const openEditModal = (pet: Pet) => {
    setCurrentPet(pet);
    setFormData(pet);
    setIsEditModalOpen(true);
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/donations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleDonationStatus = async (donationId: string, action: DonationStatus) => {
    try {
      const response = await fetch(`${API_URL}/donations/${donationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: action })
      });

      if (!response.ok) {
        throw new Error('Bağış durumu güncellenirken bir hata oluştu');
      }

      // Update the local state
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation._id === donationId
            ? { ...donation, status: action }
            : donation
        )
      );

      toast.success(`Bağış başarıyla ${action === 'approved' ? 'onaylandı' : 'reddedildi'}`);
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error('Bağış durumu güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm('Bu bağış kaydını silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/donations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDonations();
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  const handleFormStatus = async (formId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${API_URL}/admin/forms/${formId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchForms();
      }
    } catch (error) {
      console.error('Error updating form status:', error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!window.confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        fetchForms();
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

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

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamFormData)
      });

      if (response.ok) {
        setIsAddTeamModalOpen(false);
        setTeamFormData({
          name: '',
          role: '',
          image: '',
          description: '',
          order: 0
        });
        fetchTeam();
      }
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleEditTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeamMember) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/team/${currentTeamMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamFormData)
      });

      if (response.ok) {
        setIsEditTeamModalOpen(false);
        setCurrentTeamMember(null);
        fetchTeam();
      }
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/admin/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTeam();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const renderForms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFormType('all')}
            className={`px-4 py-2 rounded-md ${
              formType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tüm Başvurular
          </button>
          <button
            onClick={() => setFormType('volunteer')}
            className={`px-4 py-2 rounded-md ${
              formType === 'volunteer'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Gönüllü Başvuruları
          </button>
          <button
            onClick={() => setFormType('adoption')}
            className={`px-4 py-2 rounded-md ${
              formType === 'adoption'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sahiplendirme Başvuruları
          </button>
          <button
            onClick={() => setFormType('contact')}
            className={`px-4 py-2 rounded-md ${
              formType === 'contact'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            İletişim Mesajları
          </button>
        </div>
        <div>
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyen</option>
            <option value="approved">Onaylanan</option>
            <option value="rejected">Reddedilen</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {forms
          .filter(form => formType === 'all' || form.type === formType)
          .filter(form => formStatus === 'all' || form.status === formStatus)
          .map((form) => (
            <div key={form._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">
                      {form.type === 'volunteer' && 'Gönüllü Başvurusu'}
                      {form.type === 'adoption' && 'Sahiplendirme Başvurusu'}
                      {form.type === 'contact' && 'İletişim Mesajı'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      form.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : form.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {form.status === 'pending' ? 'Beklemede' : form.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Başvuru Tarihi: {new Date(form.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {form.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleFormStatus(form._id, 'approved')}
                        className="text-green-600 hover:text-green-700"
                        title="Onayla"
                      >
                        <CheckCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleFormStatus(form._id, 'rejected')}
                        className="text-red-600 hover:text-red-700"
                        title="Reddet"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteForm(form._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Sil"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                {form.type === 'volunteer' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                      <p className="mt-1">{form.data.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p className="mt-1">{form.data.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p className="mt-1">{form.data.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Deneyim</p>
                      <p className="mt-1">{form.data.experience}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Müsait Zamanlar</p>
                      <p className="mt-1">{form.data.availability}</p>
                    </div>
                  </div>
                )}

                {form.type === 'adoption' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                      <p className="mt-1">{form.data.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p className="mt-1">{form.data.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p className="mt-1">{form.data.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hayvan Deneyimi</p>
                      <p className="mt-1">{form.data.hasExperience ? 'Var' : 'Yok'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Adres</p>
                      <p className="mt-1">{form.data.address}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Yaşam Koşulları</p>
                      <p className="mt-1">{form.data.livingConditions}</p>
                    </div>
                    {form.data.additionalNotes && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Ek Notlar</p>
                        <p className="mt-1">{form.data.additionalNotes}</p>
                      </div>
                    )}
                    {form.petId && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Başvurulan Hayvan</p>
                        <p className="mt-1 font-medium text-emerald-600">{form.petId.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {form.type === 'contact' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                      <p className="mt-1">{form.data.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p className="mt-1">{form.data.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Konu</p>
                      <p className="mt-1">{form.data.subject}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Mesaj</p>
                      <p className="mt-1">{form.data.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <div className="lg:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-gray-500 hover:text-gray-600 focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black opacity-25" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Genel Bakış
              </button>
              <button
                onClick={() => {
                  setActiveTab('pets');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'pets' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <PawPrint className="w-5 h-5 mr-2" />
                Hayvanlar
              </button>
              <button
                onClick={() => {
                  setActiveTab('admins');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'admins' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Adminler
              </button>
              <button
                onClick={() => {
                  setActiveTab('forms');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'forms' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Form Başvuruları
              </button>
              <button
                onClick={() => {
                  setActiveTab('donations');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'donations' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5 mr-2" />
                Bağışlar
              </button>
              <button
                onClick={() => {
                  setActiveTab('team');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'team' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Ekip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopMenu = () => (
    <div className="hidden lg:flex space-x-4">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mr-2" />
        Genel Bakış
      </button>
      <button
        onClick={() => setActiveTab('pets')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'pets' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <PawPrint className="w-5 h-5 mr-2" />
        Hayvanlar
      </button>
      <button
        onClick={() => setActiveTab('admins')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'admins' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Users className="w-5 h-5 mr-2" />
        Adminler
      </button>
      <button
        onClick={() => setActiveTab('forms')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'forms' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FileText className="w-5 h-5 mr-2" />
        Form Başvuruları
      </button>
      <button
        onClick={() => setActiveTab('donations')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'donations' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Heart className="w-5 h-5 mr-2" />
        Bağışlar
      </button>
      <button
        onClick={() => setActiveTab('team')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'team' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Ekip
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Panel</h1>
            {renderMobileMenu()}
            {renderDesktopMenu()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <PawPrint className="w-10 h-10 text-emerald-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-600">Toplam Hayvan</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPets}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-600">Sahiplendirilen</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.adoptedPets}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="w-10 h-10 text-emerald-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-600">Bekleyen Başvuru</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingForms}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-10 h-10 text-emerald-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-600">Admin Sayısı</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Heart className="w-10 h-10 text-emerald-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-600">Toplam Bağış</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalDonations.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('pets')}
                className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                    <PawPrint className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hayvan Yönetimi</h3>
                    <p className="text-sm text-gray-600">Hayvanları ekle, düzenle ve yönet</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('forms')}
                className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Başvuru Yönetimi</h3>
                    <p className="text-sm text-gray-600">Sahiplendirme başvurularını değerlendir</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Admin Yönetimi</h3>
                    <p className="text-sm text-gray-600">Admin kullanıcılarını yönet</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Son Başvurular</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {forms.slice(0, 5).map((form) => (
                  <div key={form._id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{form.data.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {form.type === 'adoption' ? form.petId?.name : form.type === 'volunteer' ? 'Gönüllü Başvurusu' : 'İletişim Mesajı'}
                        </p>
                      </div>
                      <span className={`mt-2 sm:mt-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        form.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : form.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {form.status === 'pending' ? 'Beklemede' : form.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'pets' ? (
          <>
            <div className="mb-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Hayvan Ekle
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İsim
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Tür
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Yaş
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Cinsiyet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pets.map((pet) => (
                      <tr key={pet._id} className={pet.isAdopted ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">{pet.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">{pet.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-500">{pet.gender}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pet.isAdopted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pet.isAdopted ? 'Sahiplendirildi' : 'Bekliyor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleToggleAdoption(pet._id, pet.isAdopted)}
                              className={`${
                                pet.isAdopted ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                              }`}
                              title={pet.isAdopted ? 'Sahiplendirmeyi İptal Et' : 'Sahiplendirildi'}
                            >
                              {pet.isAdopted ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => openEditModal(pet)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Düzenle"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePet(pet._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'admins' ? (
          <>
            <div className="mb-4">
              <button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Admin Ekle
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{admin.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">
                            {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setCurrentAdmin(admin);
                                setAdminFormData({
                                  username: admin.username,
                                  email: admin.email,
                                  password: ''
                                });
                                setIsEditAdminModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Düzenle"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'team' ? (
          <>
            <div className="mb-4">
              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Ekip Üyesi Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <div key={member._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{member.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Sıralama: {member.order}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setCurrentTeamMember(member);
                          setTeamFormData({
                            name: member.name,
                            role: member.role,
                            image: member.image,
                            description: member.description,
                            order: member.order
                          });
                          setIsEditTeamModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'donations' ? (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bağışçı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefon
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miktar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mesaj
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {donation.fullName}
                            </span>
                            {donation.isAnonymous && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Anonim
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{donation.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-emerald-600">
                            {donation.amount.toLocaleString('tr-TR')} ₺
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{donation.message || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : donation.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.status === 'approved' && 'Onaylandı'}
                            {donation.status === 'rejected' && 'Reddedildi'}
                            {donation.status === 'pending' && 'Beklemede'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {donation.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDonationStatus(donation._id, 'approved')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Onayla
                              </button>
                              <button
                                onClick={() => handleDonationStatus(donation._id, 'rejected')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reddet
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {donations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Henüz bağış bulunmuyor.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          renderForms()
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yeni Hayvan Ekle</h2>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tür</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Kedi">Kedi</option>
                  <option value="Köpek">Köpek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Yaş</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  placeholder="Örn: 2 yaş"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Dişi">Dişi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={3}
                  placeholder="Hayvan hakkında genel bilgi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resim URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sağlık Durumu</label>
                <textarea
                  value={formData.health}
                  onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={2}
                  placeholder="Aşı, kısırlaştırma vb. bilgiler"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Karakter</label>
                <textarea
                  value={formData.character}
                  onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={2}
                  placeholder="Hayvanın karakteri hakkında bilgi"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Hayvan Düzenle</h2>
            <form onSubmit={handleEditPet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tür</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Kedi">Kedi</option>
                  <option value="Köpek">Köpek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Yaş</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  placeholder="Örn: 2 yaş"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Dişi">Dişi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={3}
                  placeholder="Hayvan hakkında genel bilgi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resim URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sağlık Durumu</label>
                <textarea
                  value={formData.health}
                  onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={2}
                  placeholder="Aşı, kısırlaştırma vb. bilgiler"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Karakter</label>
                <textarea
                  value={formData.character}
                  onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  rows={2}
                  placeholder="Hayvanın karakteri hakkında bilgi"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yeni Admin Ekle</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={adminFormData.username}
                  onChange={(e) => setAdminFormData({ ...adminFormData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Şifre</label>
                <input
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {isEditAdminModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Admin Düzenle</h2>
            <form onSubmit={handleEditAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={adminFormData.username}
                  onChange={(e) => setAdminFormData({ ...adminFormData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Şifre (Boş bırakılabilir)
                </label>
                <input
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditAdminModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Add Modal */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yeni Ekip Üyesi Ekle</h2>
            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <input
                  type="text"
                  value={teamFormData.role}
                  onChange={(e) => setTeamFormData({ ...teamFormData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fotoğraf URL</label>
                <input
                  type="url"
                  value={teamFormData.image}
                  onChange={(e) => setTeamFormData({ ...teamFormData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={teamFormData.description}
                  onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sıralama</label>
                <input
                  type="number"
                  value={teamFormData.order}
                  onChange={(e) => setTeamFormData({ ...teamFormData, order: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Edit Modal */}
      {isEditTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Ekip Üyesini Düzenle</h2>
            <form onSubmit={handleEditTeamMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <input
                  type="text"
                  value={teamFormData.role}
                  onChange={(e) => setTeamFormData({ ...teamFormData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fotoğraf URL</label>
                <input
                  type="url"
                  value={teamFormData.image}
                  onChange={(e) => setTeamFormData({ ...teamFormData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={teamFormData.description}
                  onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sıralama</label>
                <input
                  type="number"
                  value={teamFormData.order}
                  onChange={(e) => setTeamFormData({ ...teamFormData, order: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditTeamModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 