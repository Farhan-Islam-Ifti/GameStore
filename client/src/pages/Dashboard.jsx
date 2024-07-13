import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export default function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}
