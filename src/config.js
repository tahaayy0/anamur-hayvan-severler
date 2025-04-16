const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://anamurhayvanseverler-aroozsapy-taha-yerdekalmazers-projects.vercel.app/api'
    : 'http://localhost:5001/api'
};

export default config; 