const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const uploadToImgBB = async (imagePath) => {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Dosya bulunamadı: ${imagePath}`);
    }

    const formData = new FormData();
    const imageStream = fs.createReadStream(imagePath);
    formData.append('image', imageStream);

    console.log('ImgBB API isteği gönderiliyor...');
    console.log('API Key:', process.env.IMGBB_API_KEY);
    
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    console.log('ImgBB yanıtı:', response.data);

    if (!response.data.data?.url) {
      throw new Error('ImgBB yanıtında URL bulunamadı');
    }

    return response.data.data.url;
  } catch (error) {
    console.error('ImgBB yükleme hatası:', error.response?.data || error.message);
    throw new Error(`Resim yükleme başarısız: ${error.message}`);
  }
};

module.exports = { uploadToImgBB }; 