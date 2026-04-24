import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const snapshot = await get(ref(db, 'settings/password'));
      const correctPassword = snapshot.exists() ? snapshot.val() : 'admin123';
      
      if (password === correctPassword) {
        onLogin();
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      fontFamily: 'var(--font-family)',
      color: 'var(--text-light)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <Lock size={32} color="var(--primary-blue)" />
        </div>
        
        <h2 style={{ marginBottom: '8px', fontSize: '1.5rem' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          Please enter the security password to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{ padding: '12px 16px', fontSize: '1rem' }}
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
