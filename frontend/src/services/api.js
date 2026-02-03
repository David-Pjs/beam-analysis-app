import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeBeam = async (beamData) => {
  try {
    const response = await api.post('/analyze', beamData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Analysis failed');
  }
};

export const validateInput = async (beamData) => {
  try {
    const response = await api.post('/validate', beamData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Validation failed');
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API is not available');
  }
};

export default api;
