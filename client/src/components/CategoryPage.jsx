import React from 'react';
import { AuthProvider, useAuth } from '../context/auth.jsx';
export default function CategoryPage() {
  const [auth, setAuth] =useAuth();
  return (
    <div>
      <h1>Category Page</h1>
      <p>This is the content for the Category page.</p>
      <div>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {auth?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {auth?.email || 'N/A'}</p>
        {/* Avoid displaying the password */}
      </div>
    </div>
  );
}
