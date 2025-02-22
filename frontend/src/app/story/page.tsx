'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StoryData {
  idea: string;
  plot: string;
  characters: string;
  dialogue: string;
  feedback: string;
}

const StoryGenerator: React.FC = () => {
  const [ideaPrompt, setIdeaPrompt] = useState<string>('');
  const [plotPrompt, setPlotPrompt] = useState<string>('');
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [dialoguePrompt, setDialoguePrompt] = useState<string>('');
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>('');
  const [editPartName, setEditPartName] = useState<string>('');
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [startFresh, setStartFresh] = useState<boolean>(false);
  const [editSave, setEditSave] = useState<boolean>(false);
  const [storyData, setStoryData] = useState<StoryData>({
    idea: '',
    plot: '',
    characters: '',
    dialogue: '',
    feedback: '',
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from local storage or cookies
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const generateStory = async (done = false) => {
    if (!token) {
      console.error('No token available. Please log in.');
      return;
    }

    try {
      const response = await axios.post<StoryData>(
        'http://localhost:8000/story/generate_story',
        {
          idea_prompt: ideaPrompt,
          plot_prompt: plotPrompt,
          character_prompt: characterPrompt,
          dialogue_prompt: dialoguePrompt,
          feedback_prompt: feedbackPrompt,
          edit_part_name: editPartName,
          edit_instructions: editInstructions,
          start_fresh: startFresh,
          edit_save: editSave,
          token: token,
          done: done, // Include done flag
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setStoryData(response.data);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Story Generator</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Idea Prompt</label>
        <textarea
          value={ideaPrompt}
          onChange={(e) => setIdeaPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Plot Prompt</label>
        <textarea
          value={plotPrompt}
          onChange={(e) => setPlotPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Character Prompt</label>
        <textarea
          value={characterPrompt}
          onChange={(e) => setCharacterPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Dialogue Prompt</label>
        <textarea
          value={dialoguePrompt}
          onChange={(e) => setDialoguePrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Feedback Prompt</label>
        <textarea
          value={feedbackPrompt}
          onChange={(e) => setFeedbackPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Edit Part</label>
        <select
          value={editPartName}
          onChange={(e) => setEditPartName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select Part</option>
          <option value="idea">Idea</option>
          <option value="plot">Plot</option>
          <option value="characters">Characters</option>
          <option value="dialogue">Dialogue</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Edit Instructions</label>
        <textarea
          value={editInstructions}
          onChange={(e) => setEditInstructions(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={startFresh} onChange={() => setStartFresh(!startFresh)} className="form-checkbox" />
          <span className="ml-2">Start Fresh</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={editSave} onChange={() => setEditSave(!editSave)} className="form-checkbox" />
          <span className="ml-2">Save Edit</span>
        </label>
      </div>

      <button onClick={()=>generateStory(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate Story
      </button>
      <button onClick={() => generateStory(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
        Save Story
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Generated Story</h2>
        <div className="mb-2">
          <h3 className="font-semibold">Idea:</h3>
          <p>{storyData.idea}</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Plot:</h3>
          <p>{storyData.plot}</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Characters:</h3>
          <p>{storyData.characters}</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Dialogue:</h3>
          <p>{storyData.dialogue}</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Feedback:</h3>
          <p>{storyData.feedback}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;