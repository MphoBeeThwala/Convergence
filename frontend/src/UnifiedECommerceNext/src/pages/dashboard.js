import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
