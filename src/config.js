const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-vercel-app-url.vercel.app/api'
    : 'http://localhost:5001/api'
};

export default config; 