// Category and Disease interfaces
export interface Category {
  id: number;
  name: string;
  slug: string;
  // ...other fields as needed
}

export interface Disease {
  id: number;
  name: string;
  slug: string;
  // ...other fields as needed
}
// Drug API service
import axios from '../axios.js';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return { Authorization: `Bearer ${token}` };
}

export async function addDrug(formData: FormData) {
  const response = await axios.post('/api/drugs', formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Fetch all drug categories
export async function fetchDrugCategories(): Promise<{ data: Category[] }> {
  const response = await axios.get('/api/drugs/categories', { headers: getAuthHeaders() });
  if (Array.isArray(response.data)) {
    return { data: response.data };
  }
  return response.data;
}

// Fetch all diseases
export async function fetchDiseases(): Promise<{ disease: Disease[] }> {
  const response = await axios.get('/api/diseases', { headers: getAuthHeaders() });
  if (Array.isArray(response.data?.disease)) {
    return { disease: response.data.disease };
  }
  // fallback for legacy or unexpected structure
  if (Array.isArray(response.data)) {
    return { disease: response.data };
  }
  return { disease: [] };
}

// Fetch all disease categories (not used in Add Drug form, but available)
export async function fetchDiseaseCategories(): Promise<Category[]> {
  const response = await axios.get('/api/diseases/categories', { headers: getAuthHeaders() });
  return response.data as Category[];
}
