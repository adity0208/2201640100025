import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  createShortUrl: (data) => axios.post(`${API_BASE_URL}/shorturls`, data),
  getStats: (shortcode) => axios.get(`${API_BASE_URL}/shorturls/${shortcode}/stats`)
};