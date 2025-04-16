require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pet = require('./models/Pet');
const Admin = require('./models/Admin');
const AdoptionForm = require('./models/AdoptionForm');
const Donation = require('./models/Donation');
const auth = require('./middleware/auth');
const Form = require('./models/Form');
const Team = require('./models/Team');
const upload = require('./config/multer');
const { uploadToImgBB } = require('./services/uploadService');
const fs = require('fs').promises;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Admin Management Routes
app.get('/api/admin/users', auth, async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // şifreleri hariç tüm bilgileri getir
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/users/:id', auth, async (req, res) => {
  try {
    // Son admin kullanıcısının silinmesini engelle
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Son admin kullanıcısı silinemez' });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin kullanıcısı başarıyla silindi' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/admin/users/:id', auth, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = { username, email };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: '-password' }
    );
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin Authentication Routes
app.post('/api/admin/register', auth, async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pet Routes
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await Pet.find({ isAdopted: false });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet bulunamadı' });
    }
    res.json(pet);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Geçersiz ID formatı' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/pets', auth, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/pets/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/pets/:id', auth, async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Adoption Form Routes
app.get('/api/adoption-forms', auth, async (req, res) => {
  try {
    const forms = await AdoptionForm.find().populate('petId', 'name type');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/adoption-forms', async (req, res) => {
  try {
    const form = new Form({
      type: 'adoption',
      data: req.body,
      petId: req.body.petId
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/adoption-forms/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const form = await AdoptionForm.findById(req.params.id).populate('petId');

    if (!form) {
      return res.status(404).json({ message: 'Form bulunamadı' });
    }

    // Form onaylandığında hayvanı sahiplendirildi olarak işaretle
    if (status === 'Onaylandı') {
      await Pet.findByIdAndUpdate(form.petId._id, { isAdopted: true });
    } else if (status === 'Reddedildi' && form.status === 'Onaylandı') {
      // Eğer onaylı bir form reddedilirse, hayvanı tekrar sahiplendirilmedi olarak işaretle
      await Pet.findByIdAndUpdate(form.petId._id, { isAdopted: false });
    }

    form.status = status;
    await form.save();

    const updatedForm = await AdoptionForm.findById(form._id).populate('petId', 'name type');
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/adoption-forms/:id', auth, async (req, res) => {
  try {
    await AdoptionForm.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form başvurusu başarıyla silindi' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin paneli için tüm hayvanları getir (sahiplendirilmiş olanlar dahil)
app.get('/api/admin/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Donation Routes
app.post('/api/donations', async (req, res) => {
  try {
    const { fullName, phone, amount, message, isAnonymous } = req.body;
    const donation = new Donation({
      fullName,
      phone,
      amount: parseFloat(amount),
      message,
      isAnonymous: Boolean(isAnonymous),
      status: 'pending'
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all donations (admin only)
app.get('/api/admin/donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get approved donations (public)
app.get('/api/donations/approved', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donation status (admin only)
app.put('/api/donations/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Bağış bulunamadı' });
    }

    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete donation (admin only)
app.delete('/api/admin/donations/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Bağış bulunamadı' });
    }
    res.json({ message: 'Bağış başarıyla silindi' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Form routes
app.get('/api/admin/forms', auth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .populate('petId', 'name');
      
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/forms/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const form = await Form.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('petId', 'name');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // If it's an adoption form and it's approved, mark the pet as adopted
    if (form.type === 'adoption' && status === 'approved' && form.petId) {
      await Pet.findByIdAndUpdate(form.petId._id, { isAdopted: true });
    }
    // If it's an adoption form and it's rejected/pending, make sure pet is not marked as adopted
    else if (form.type === 'adoption' && status !== 'approved' && form.petId) {
      await Pet.findByIdAndUpdate(form.petId._id, { isAdopted: false });
    }

    res.json(form);
  } catch (error) {
    console.error('Error updating form status:', error);
    res.status(500).json({ message: 'Error updating form status' });
  }
});

// Delete form endpoint
app.delete('/api/admin/forms/:id', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // If it's an approved adoption form, make sure to un-adopt the pet
    if (form.type === 'adoption' && form.status === 'approved' && form.petId) {
      await Pet.findByIdAndUpdate(form.petId, { isAdopted: false });
    }

    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form successfully deleted' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Error deleting form' });
  }
});

app.post('/api/volunteer-forms', async (req, res) => {
  try {
    const form = new Form({
      type: 'volunteer',
      data: req.body
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/contact-forms', async (req, res) => {
  try {
    const form = new Form({
      type: 'contact',
      data: req.body
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Team Management Routes
app.get('/api/team', async (req, res) => {
  try {
    const team = await Team.find().sort('order');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/team', auth, async (req, res) => {
  try {
    const teamMember = new Team(req.body);
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/admin/team/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/admin/team/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' });
    }
    return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
  }
  next(err);
});

// Image Upload Route
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      if (err) {
        console.error('Multer hatası:', err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Lütfen bir resim dosyası seçin' });
      }

      console.log('Dosya başarıyla yüklendi:', req.file);

      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(req.file.path);
      console.log('ImgBB URL:', imageUrl);

      // Delete the local file after upload
      await fs.unlink(req.file.path);
      console.log('Geçici dosya silindi');

      res.json({ imageUrl });
    } catch (error) {
      console.error('Yükleme hatası:', error);
      // Temizlik: Hata durumunda geçici dosyayı sil
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Geçici dosya silinirken hata:', unlinkError);
        }
      }
      res.status(500).json({ 
        message: 'Resim yükleme başarısız',
        error: error.message 
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 