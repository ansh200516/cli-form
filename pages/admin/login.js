// pages/admin/login.js

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminLogin = () => {
  const router = useRouter();
  const [kerberosId, setKerberosId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { kerberosId, password });
      const { token, isAdmin } = res.data;

      if (!isAdmin) {
        setError('Access denied: Not an admin user.');
        return;
      }

      localStorage.setItem('token', token);
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1">Kerberos ID</label>
        <input
          type="text"
          value={kerberosId}
          onChange={(e) => setKerberosId(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        Login as Admin
      </button>
    </form>
  );
};

export default AdminLogin;