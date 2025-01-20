//Display story details and contributors. Add comments section.
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const StoryViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<any>(null);
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    const fetchStory = async () => {
      const storyResponse = await axios.get(`/api/stories/${id}`, { withCredentials: true });
      setStory(storyResponse.data);
    };

    const fetchContributors = async () => {
      const contributorsResponse = await axios.get(`/api/contributors/${id}`, { withCredentials: true });
      setContributors(contributorsResponse.data);
    };

    fetchStory();
    fetchContributors();
  }, [id]);

  if (!story) return <p>Loading story...</p>;

  return (
    <div>
      <h2>{story.title}</h2>
      <p>{story.content}</p>
      <h3>Contributors</h3>
      <ul>
        {contributors.map((contributor) => (
          <li key={contributor.id}>{contributor.username}</li>
        ))}
      </ul>
      <h3>Comments</h3>
      <p>Comments section coming soon...</p>
    </div>
  );
};

export default StoryViewer;
