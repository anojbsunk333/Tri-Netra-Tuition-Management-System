import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <section>
          <h2 className="text-lg font-semibold">Users</h2>
          <ul className="mt-2">
            {users.map((u) => (
              <li key={u.id} className="border p-2 rounded mb-2">
                <div className="font-bold">{u.name}</div>
                <div className="text-sm text-gray-600">
                  {u.email} • {u.role}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
