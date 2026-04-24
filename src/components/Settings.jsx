import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { Key } from 'lucide-react';

export default function Settings({ addToast }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      addToast('Error', 'Password cannot be empty', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Error', 'Passwords do not match', 'error');
      return;
    }

    try {
      await set(ref(db, 'settings/password'), newPassword);
      addToast('Success', 'Password updated successfully', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      addToast('Error', 'Failed to update password', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--primary-blue)' }}>
            <Key size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>Security Settings</h2>
        </div>

        <form onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new admin password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password" 
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
