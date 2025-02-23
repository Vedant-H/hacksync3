// pages/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Story {
  _id: string;
  context: any;
}

const Dashboard = () => {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      fetchUserStories(userId);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchUserStories = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/story/user_stories?user_id=${userId}`);
      setStories(response.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = () => {
    router.push('/story');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Stories</h1>
      {stories.length > 0 ? (
        <ul className="space-y-2">
          {stories.map((story) => (
            <li
              key={story._id}
              className="border p-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/story?storyId=${story._id}`)}
            >
              Story ID: {story._id}
            </li>
          ))}
        </ul>
        
      ) : (
        <div className="text-center">
          <p>You have no stories yet.</p>
        </div>
      )}
                <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleCreateStory}
          >
            Create New Story
          </button>
    </div>
  );
};

export default Dashboard;