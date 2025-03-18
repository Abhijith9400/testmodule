import axios from 'axios';

// Retrieve user data from sessionStorage
export const getUser = () =>
  sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user'))
    : null;

// Login and save user data to sessionStorage
export const login = async (email, password) => {
  const { data } = await axios.post('api/users/login', { email, password });
  sessionStorage.setItem('user', JSON.stringify(data)); // Save to sessionStorage
  return data;
};

// Register and save user data to sessionStorage
export const register = async registerData => {
  const { data } = await axios.post('api/users/register', registerData);
  sessionStorage.setItem('user', JSON.stringify(data)); // Save to sessionStorage
  return data;
};

// Logout by clearing sessionStorage
export const logout = () => {
  sessionStorage.removeItem('user');
};

// Update profile and save updated user data to sessionStorage
export const updateProfile = async user => {
  const { data } = await axios.put('/api/users/updateProfile', user);
  sessionStorage.setItem('user', JSON.stringify(data)); // Save to sessionStorage
  return data;
};

// Change user password (logout is handled on the frontend)
export const changePassword = async passwords => {
  await axios.put('/api/users/changePassword', passwords);
};

// Fetch all users (Admin functionality)
export const getAll = async searchTerm => {
  const { data } = await axios.get('/api/users/getAll/' + (searchTerm ?? ''));
  return data;
};

// Toggle user block status (Admin functionality)
export const toggleBlock = async userId => {
  const { data } = await axios.put('/api/users/toggleBlock/' + userId);
  return data;
};

// Get user details by ID (Admin functionality)
export const getById = async userId => {
  const { data } = await axios.get('/api/users/getById/' + userId);
  return data;
};

// Update user information (Admin functionality)
export const updateUser = async userData => {
  const { data } = await axios.put('/api/users/update', userData);
  return data;
};
