interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://anamurhayvanseverler-eij14i7g2-taha-yerdekalmazers-projects.vercel.app/api'
    : 'http://localhost:5001/api'
};

export default config; 