import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Story {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
}

interface StoryState {
  stories: Story[];
}

const initialState: StoryState = {
  stories: [],
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.push(action.payload);
    },
    updateStory: (state, action: PayloadAction<Story>) => {
      const index = state.stories.findIndex((story) => story.id === action.payload.id);
      if (index >= 0) {
        state.stories[index] = action.payload;
      }
    },
  },
});

export const { addStory, updateStory } = storySlice.actions;
export default storySlice.reducer;