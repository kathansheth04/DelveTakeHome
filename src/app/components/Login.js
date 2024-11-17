'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/main');
    }
  }, [user, router]);

  const handleLoginButton = async (e) => {
    e.preventDefault();
    if (email != null && email.length > 0 && email.match(/.+@.+/)) {
      if (password.length >= 6) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data) {
          sessionStorage.setItem('user_id', data.session.user.id);
          router.push('/main');
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div>
        <div className="mb-6">
          <img src="/delveLogo.svg" alt="Logo" className="w-32 h-30 mx-auto" />
        </div>

        <div className="bg-black p-8 rounded-lg shadow-md w-[400px] border border-gray-700 ">
          <h2 className="text-2xl text-gray-200 mb-6 text-center">Welcome!</h2>
          <form onSubmit={handleLoginButton}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Password (at least 6 characters)"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-gray-200 font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
