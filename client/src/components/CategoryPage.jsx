import React from 'react';
import { AuthProvider, useAuth } from '../context/auth.jsx';
export default function CategoryPage() {
  const [auth, setAuth] =useAuth();
  return (
    <div>
      <h1>Category Page</h1>
      <p>This is the content for the Category page.</p>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </div>
  );
}
