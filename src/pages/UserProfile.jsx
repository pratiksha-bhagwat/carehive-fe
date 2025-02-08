import { useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <input type="text" placeholder="Name" className="border p-2 w-full mb-2" onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      <input type="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
      <input type="tel" placeholder="Phone" className="border p-2 w-full mb-2" onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
    </div>
  );
}