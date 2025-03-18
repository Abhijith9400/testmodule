import axios from 'axios';

const API_URL = '/api/foods';

// Fetch all foods
export const getAll = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Search foods by name
export const search = async (searchTerm) => {
  const { data } = await axios.get(`${API_URL}/search/${searchTerm}`);
  return data;
};

// Fetch all tags
export const getAllTags = async () => {
  const { data } = await axios.get(`${API_URL}/tags`);
  return data;
};

// Fetch foods by tag
export const getAllByTag = async (tag) => {
  if (tag === 'All') return getAll();
  const { data } = await axios.get(`${API_URL}/tag/${tag}`);
  return data;
};

// Fetch food by ID
export const getById = async (foodId) => {
  const { data } = await axios.get(`${API_URL}/${foodId}`);
  return data;
};

// Delete food by ID
export const deleteById = async (foodId) => {
  await axios.delete(`${API_URL}/${foodId}`);
};

// Update food by ID
export const update = async (food) => {
  const { data } = await axios.put(`${API_URL}/${food.id}`, food);  // `axios.put` instead of fetch
  return data;
};

// Add new food
export const add = async (food) => {
  const { data } = await axios.post(API_URL, food);
  return data;
};
