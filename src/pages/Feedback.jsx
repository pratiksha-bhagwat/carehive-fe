import { useState } from "react";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Feedback & Ratings</h2>
      <form onSubmit={handleSubmit}>
        <textarea className="border p-2 w-full mb-2" placeholder="Write your feedback..." onChange={(e) => setFeedback(e.target.value)}></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}