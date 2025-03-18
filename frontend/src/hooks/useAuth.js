import { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear sessionStorage on reload or rebuild
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      sessionStorage.removeItem('user');
    }

    const existingUser = JSON.parse(sessionStorage.getItem('user'));

    if (existingUser && existingUser.token) {
      console.log("Existing User from sessionStorage:", existingUser);
      setUser(existingUser);
    }
    
    setLoading(false); // Mark loading as false after checking

    // Automatically logout when the window is closed
    const handleLogout = () => {
      sessionStorage.removeItem('user');
      userService.logout();
      setUser(null);
    };

    window.addEventListener('beforeunload', handleLogout);

    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      console.log("User after login:", user);

      if (!user || typeof user.isAdmin === 'undefined') {
        toast.error('Login Failed. Please try again.');
        return;
      }

      setUser(user);
      sessionStorage.setItem('user', JSON.stringify(user));
      toast.success('Login Successful');

      // Redirecting both admin and user to the same homepage after login
      navigate('/');
    } catch (err) {
      console.error('Error during login:', err);
      toast.error(err.response?.data || 'Login Failed');
    }
  };

  const register = async data => {
    try {
      const user = await userService.register(data);
      console.log("User after registration:", user);

      if (!user || typeof user.isAdmin === 'undefined') {
        toast.error('Registration Failed. Please try again.');
        return;
      }

      setUser(user);
      sessionStorage.setItem('user', JSON.stringify(user));
      toast.success('Register Successful');
      
      navigate('/'); // Redirect to homepage after successful registration
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error(err.response?.data || 'Registration Failed');
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    sessionStorage.removeItem('user');
    toast.success('Logout Successful');
    navigate('/login');
  };

  const updateProfile = async userData => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      console.log("User after profile update:", updatedUser);

      if (updatedUser) {
        const newUser = { ...user, ...updatedUser }; // Merge new data with existing user data
        setUser(newUser);
        sessionStorage.setItem('user', JSON.stringify(newUser));
        toast.success('Profile Update Was Successful');
      }
    } catch (err) {
      console.error('Error during profile update:', err);
      toast.error('Profile Update Failed');
    }
  };

  const changePassword = async passwords => {
    try {
      await userService.changePassword(passwords);
      logout();
      toast.success('Password Changed Successfully, Please Login Again!');
    } catch (err) {
      console.error('Error during password change:', err);
      toast.error('Password Change Failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
