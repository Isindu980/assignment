import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch('https://securewrap-1621182990b0.herokuapp.com/api/user-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page, limit }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch {
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="p-4">
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">
        Logout
      </button>
      {loading ? <p>Loading...</p> : (
        <ul>
          {users.map((user: any, index: number) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      )}
      <button onClick={() => setPage(page + 1)} className="bg-blue-500 text-white px-4 py-2">
        Next Page
      </button>
    </div>
  );
};

export default Profile;
