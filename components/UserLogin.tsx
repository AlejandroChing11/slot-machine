'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, User, Lock, UserPlus, Users, ChevronLeft, Mail } from 'lucide-react';
import { useGame } from './GameContext';

interface UserLoginProps {
  onUserLogin: (userId: string, name: string, credits?: number) => void;
  onContinueAsGuest?: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
}

type AuthMode = 'login' | 'register';

//COMMENT THE COMPONENT HERE AS A COMMENT TO UNDERSTAND THE COMPONENT
const UserLogin: React.FC<UserLoginProps> = ({ onUserLogin, onContinueAsGuest }) => {
  const { state } = useGame();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [password, setPassword] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/user');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegistering(true);

    try {
      if (!name || !email) {
        setError('Name and email are required');
        return;
      }

      const response = await axios.post('/api/user', { name, email });
      const newUser = response.data;

      setUsers([...users, newUser]);
      setShowRegister(false);
      setName('');
      setEmail('');

      onUserLogin(newUser.id, newUser.name, newUser.credits);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to register user');
      console.error('Error registering user:', error);
    } finally {
      setRegistering(false);
    }
  };

  const selectUser = (user: User) => {
    onUserLogin(user.id, user.name, user.credits);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        currentSessionId: state.sessionId
      });

      const userData = response.data;

      onUserLogin(userData.id, userData.name, userData.credits);

      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });

      const userData = response.data;

      onUserLogin(userData.id, userData.name, userData.credits);

      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="w-full max-w-md relative overflow-hidden">
      {/* Casino style gold frame */}
      <div className="absolute inset-0 animate-pulse-gold z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 opacity-50"></div>
      </div>

      {/* Main content with a playing card / casino table feel */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-2xl p-8 border-4 border-yellow-500 relative z-10">
        {/* Casino lights effect */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>

        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-yellow-400 mr-2" size={28} />
          <h2 className="text-3xl font-bold text-center text-white">
            Lucky <span className="text-red-500">Casino</span>
          </h2>
          <Sparkles className="text-yellow-400 ml-2" size={28} />
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 text-white p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <User size={18} className="mr-2 text-yellow-400" />
              Sign In
            </h3>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-yellow-300 flex items-center">
                  <Mail size={16} className="mr-1" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 text-yellow-300 flex items-center">
                  <Lock size={16} className="mr-1" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-200"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center mt-4 text-sm">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Need an account? Register
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600">
            <div className="flex items-center mb-4">
              <button
                onClick={toggleMode}
                className="text-yellow-400 hover:text-yellow-300 mr-2"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-bold text-white flex items-center">
                <UserPlus size={18} className="mr-2 text-yellow-400" />
                Register New Player
              </h3>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-yellow-300 flex items-center">
                  <User size={16} className="mr-1" /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-email" className="block mb-1 text-yellow-300 flex items-center">
                  <Mail size={16} className="mr-1" /> Email
                </label>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block mb-1 text-yellow-300 flex items-center">
                  <Lock size={16} className="mr-1" /> Password
                </label>
                <input
                  type="password"
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-200"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Join the Casino'}
              </button>
            </form>
          </div>
        )}

        {/* Guest option */}
        {onContinueAsGuest && (
          <button
            onClick={onContinueAsGuest}
            className="mt-4 w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-2 px-4 rounded shadow-lg flex items-center justify-center"
          >
            Play as Guest
          </button>
        )}

        {/* Decorative casino elements */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-black border-2 border-white"></div>
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-black border-2 border-white"></div>
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin; 