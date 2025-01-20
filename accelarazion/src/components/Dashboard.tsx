import React from "react";
//List all stories with a filter for user’s own stories.
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

const Dashboard: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      const response = await axios.get("/api/stories", { withCredentials: true });
      setStories(response.data);
    };

    fetchStories();
  }, []);

  const userStories = stories.filter((story) => story.author_id === user?.id);

  return (
    <div>
      <h2>All Stories</h2>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.content}</p>
            <p>Author: {story.author}</p>
          </li>
        ))}
      </ul>

      <h2>Your Stories</h2>
      <ul>
        {userStories.map((story) => (
          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
