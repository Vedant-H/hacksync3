// 'use client'
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface StoryData {
//   idea: string;
//   plot: string;
//   characters: string;
//   dialogue: string;
//   feedback: string;
// }

// const StoryGenerator: React.FC = () => {
//   const [ideaPrompt, setIdeaPrompt] = useState<string>('');
//   const [plotPrompt, setPlotPrompt] = useState<string>('');
//   const [characterPrompt, setCharacterPrompt] = useState<string>('');
//   const [dialoguePrompt, setDialoguePrompt] = useState<string>('');
//   const [feedbackPrompt, setFeedbackPrompt] = useState<string>('');
//   const [editPartName, setEditPartName] = useState<string>('');
//   const [editInstructions, setEditInstructions] = useState<string>('');
//   const [startFresh, setStartFresh] = useState<boolean>(false);
//   const [editSave, setEditSave] = useState<boolean>(false);
//   const [storyData, setStoryData] = useState<StoryData>({
//     idea: '',
//     plot: '',
//     characters: '',
//     dialogue: '',
//     feedback: '',
//   });
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     // Get token from local storage or cookies
//     const storedToken = localStorage.getItem('access_token');
//     if (storedToken) {
//       setToken(storedToken);
//     }
//   }, []);

//   const generateStory = async (done = false) => {
//     if (!token) {
//       console.error('No token available. Please log in.');
//       return;
//     }

//     try {
//       const response = await axios.post<StoryData>(
//         'http://localhost:8000/story/generate_story',
//         {
//           idea_prompt: ideaPrompt,
//           plot_prompt: plotPrompt,
//           character_prompt: characterPrompt,
//           dialogue_prompt: dialoguePrompt,
//           feedback_prompt: feedbackPrompt,
//           edit_part_name: editPartName,
//           edit_instructions: editInstructions,
//           start_fresh: startFresh,
//           edit_save: editSave,
//           token: token,
//           done: done, // Include done flag
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       setStoryData(response.data);
//     } catch (error) {
//       console.error('Error generating story:', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Story Generator</h1>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Idea Prompt</label>
//         <textarea
//           value={ideaPrompt}
//           onChange={(e) => setIdeaPrompt(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Plot Prompt</label>
//         <textarea
//           value={plotPrompt}
//           onChange={(e) => setPlotPrompt(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Character Prompt</label>
//         <textarea
//           value={characterPrompt}
//           onChange={(e) => setCharacterPrompt(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Dialogue Prompt</label>
//         <textarea
//           value={dialoguePrompt}
//           onChange={(e) => setDialoguePrompt(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Feedback Prompt</label>
//         <textarea
//           value={feedbackPrompt}
//           onChange={(e) => setFeedbackPrompt(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Edit Part</label>
//         <select
//           value={editPartName}
//           onChange={(e) => setEditPartName(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         >
//           <option value="">Select Part</option>
//           <option value="idea">Idea</option>
//           <option value="plot">Plot</option>
//           <option value="characters">Characters</option>
//           <option value="dialogue">Dialogue</option>
//           <option value="feedback">Feedback</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Edit Instructions</label>
//         <textarea
//           value={editInstructions}
//           onChange={(e) => setEditInstructions(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="inline-flex items-center">
//           <input type="checkbox" checked={startFresh} onChange={() => setStartFresh(!startFresh)} className="form-checkbox" />
//           <span className="ml-2">Start Fresh</span>
//         </label>
//       </div>

//       <div className="mb-4">
//         <label className="inline-flex items-center">
//           <input type="checkbox" checked={editSave} onChange={() => setEditSave(!editSave)} className="form-checkbox" />
//           <span className="ml-2">Save Edit</span>
//         </label>
//       </div>

//       <button onClick={()=>generateStory(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//         Generate Story
//       </button>
//       <button onClick={() => generateStory(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
//         Save Story
//       </button>

//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-2">Generated Story</h2>
//         <div className="mb-2">
//           <h3 className="font-semibold">Idea:</h3>
//           <p>{storyData.idea}</p>
//         </div>
//         <div className="mb-2">
//           <h3 className="font-semibold">Plot:</h3>
//           <p>{storyData.plot}</p>
//         </div>
//         <div className="mb-2">
//           <h3 className="font-semibold">Characters:</h3>
//           <p>{storyData.characters}</p>
//         </div>
//         <div className="mb-2">
//           <h3 className="font-semibold">Dialogue:</h3>
//           <p>{storyData.dialogue}</p>
//         </div>
//         <div className="mb-2">
//           <h3 className="font-semibold">Feedback:</h3>
//           <p>{storyData.feedback}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoryGenerator;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface StoryData {
//   idea: string;
//   plot: string;
//   characters: string;
//   dialogue: string;
//   feedback: string;
// }

// const StoryGenerator: React.FC = () => {
//   const [ideaPrompt, setIdeaPrompt] = useState<string>('');
//   const [plotPrompt, setPlotPrompt] = useState<string>('');
//   const [characterPrompt, setCharacterPrompt] = useState<string>('');
//   const [dialoguePrompt, setDialoguePrompt] = useState<string>('');
//   const [feedbackPrompt, setFeedbackPrompt] = useState<string>('');
//   const [editPartName, setEditPartName] = useState<string>('');
//   const [editInstructions, setEditInstructions] = useState<string>('');
//   const [startFresh, setStartFresh] = useState<boolean>(false);
//   const [editSave, setEditSave] = useState<boolean>(false);
//   const [storyData, setStoryData] = useState<StoryData>({
//     idea: '',
//     plot: '',
//     characters: '',
//     dialogue: '',
//     feedback: '',
//   });
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('access_token');
//     if (storedToken) {
//       setToken(storedToken);
//     }
//   }, []);

//   const generateStory = async (done = false) => {
//     if (!token) {
//       console.error('No token available. Please log in.');
//       return;
//     }

//     try {
//       const response = await axios.post<StoryData>(
//         'http://localhost:8000/story/generate_story',
//         {
//           idea_prompt: ideaPrompt,
//           plot_prompt: plotPrompt,
//           character_prompt: characterPrompt,
//           dialogue_prompt: dialoguePrompt,
//           feedback_prompt: feedbackPrompt,
//           edit_part_name: editPartName,
//           edit_instructions: editInstructions,
//           start_fresh: startFresh,
//           edit_save: editSave,
//           token: token,
//           done: done,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       setStoryData(response.data);
//     } catch (error) {
//       console.error('Error generating story:', error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
//       <h1 className="text-3xl font-semibold text-center mb-6 text-indigo-600">Story Generator</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Idea Prompt</label>
//           <textarea
//             value={ideaPrompt}
//             onChange={(e) => setIdeaPrompt(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Plot Prompt</label>
//           <textarea
//             value={plotPrompt}
//             onChange={(e) => setPlotPrompt(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Character Prompt</label>
//           <textarea
//             value={characterPrompt}
//             onChange={(e) => setCharacterPrompt(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Dialogue Prompt</label>
//           <textarea
//             value={dialoguePrompt}
//             onChange={(e) => setDialoguePrompt(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Feedback Prompt</label>
//           <textarea
//             value={feedbackPrompt}
//             onChange={(e) => setFeedbackPrompt(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Edit Part</label>
//           <select
//             value={editPartName}
//             onChange={(e) => setEditPartName(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           >
//             <option value="">Select Part</option>
//             <option value="idea">Idea</option>
//             <option value="plot">Plot</option>
//             <option value="characters">Characters</option>
//             <option value="dialogue">Dialogue</option>
//             <option value="feedback">Feedback</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Edit Instructions</label>
//           <textarea
//             value={editInstructions}
//             onChange={(e) => setEditInstructions(e.target.value)}
//             className="mt-2 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div className="mb-4 flex items-center">
//           <label className="inline-flex items-center">
//             <input type="checkbox" checked={startFresh} onChange={() => setStartFresh(!startFresh)} className="form-checkbox text-indigo-600" />
//             <span className="ml-2 text-gray-700">Start Fresh</span>
//           </label>
//         </div>

//         <div className="mb-6 flex items-center">
//           <label className="inline-flex items-center">
//             <input type="checkbox" checked={editSave} onChange={() => setEditSave(!editSave)} className="form-checkbox text-indigo-600" />
//             <span className="ml-2 text-gray-700">Save Edit</span>
//           </label>
//         </div>

//         <div className="flex space-x-4 justify-center">
//           <button onClick={() => generateStory(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-200">
//             Generate Story
//           </button>
//           <button onClick={() => generateStory(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-200">
//             Save Story
//           </button>
//         </div>
//       </div>

//       <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Generated Story</h2>
//         <div className="space-y-4">
//           <div>
//             <h3 className="font-semibold text-gray-800">Idea:</h3>
//             <p className="text-gray-700">{storyData.idea}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800">Plot:</h3>
//             <p className="text-gray-700">{storyData.plot}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800">Characters:</h3>
//             <p className="text-gray-700">{storyData.characters}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800">Dialogue:</h3>
//             <p className="text-gray-700">{storyData.dialogue}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800">Feedback:</h3>
//             <p className="text-gray-700">{storyData.feedback}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoryGenerator;

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { useSearchParams } from 'next/navigation';
import { usePollinationsImage } from '@pollinations/react';

interface StoryData {
  idea: string;
  plot: string;
  characters: string;
  dialogue: string;
  feedback: string;
}

const StoryGenerator: React.FC = () => {
  const searchParams = useSearchParams();
  console.log(searchParams)
  const storyId = searchParams.get('storyId');
  const userId = searchParams.get('user_id');
  const [ideaPrompt, setIdeaPrompt] = useState<string>('');
  const [plotPrompt, setPlotPrompt] = useState<string>('');
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [dialoguePrompt, setDialoguePrompt] = useState<string>('');
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>('');
  const [editPartName, setEditPartName] = useState<string>('');
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [startFresh, setStartFresh] = useState<boolean>(false);
  const [editSave, setEditSave] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  console.log(userId);
  console.log(storyId);

    const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {

  // }, []);


  useEffect(() => {

    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storyId) {
      console.log(userId);
      fetchStory(storyId);
    } else {
      setLoading(false);
    }
  }, [storyId]);


  const fetchStory = async (id: string) => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:8000/story/${id}`);
      if (response.data && response.data.story && response.data.story.context) {
        setStoryData(response.data.story.context);
        console.log(response.data.story._id); // Now a string
        console.log(response.data.story.user_id); // Now a string
      } else {
        setError('Story data not found.');
      }
    } catch (error: any) {
      console.error('Error fetching story:', error);
      setError('Failed to load story. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const generateStory = async (done = false ) => {
    console.log(storyId);

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
          done: done,
          newStry : storyId == null ? "" : storyId , 
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

  const cleanText = (text: string): string => {
    if (!text) return '';
  
    let formattedText = text
      // Convert **bold headers** to consistent <h3> headings
      .replace(/\n\n\*\*(.*?)\*\*\n\n/g, '<h3 class="font-semibold text-gray-800 mt-4">$1</h3>')
  
      // Convert **bold inline** text to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
      // Convert *italic* text to <em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  
      // Convert list items (* item) into <ul><li>...</li></ul>
      .replace(/\n\* (.*?)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
  
      // Convert double newlines into paragraph breaks
      .replace(/\n{2,}/g, '</p><p>')
  
      // Single newline inside paragraphs becomes a line break
      .replace(/\n/g, '<br/>');
  
    return formattedText;
  };
  
  const parseMarkdown = (text: string): string => {
    // If the text can have HTML, you may also want to sanitize it for safety
    return marked(text || '');
  };

  // const handleDownloadPdf  = async (storyId: string | null) => {
  //   console.log(storyId)
  //   const response = await axios.get(`http://localhost:8000/story/generate_pdf/${storyId}`);

 
  // };


const handleDownloadPdf = async (storyId: string | null) => {
  console.log(storyId);

  try {
      const response = await axios.get(
          `http://localhost:8000/story/generate_pdf/${storyId}`,
          {
              responseType: 'blob', // Important: tell axios to expect a blob
          }
      );

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `story_summary_${storyId}.docx`;
      document.body.appendChild(a);
      a.click();
      const b = document.createElement('a');
      b.href = url;
      b.download = `story_summary_${storyId}.pdf`;
      document.body.appendChild(b);
      b.click();
      window.URL.revokeObjectURL(url);
      window.URL.revokeObjectURL(url);
      document.body.removeChild(b);


      // const url = window.URL.createObjectURL(response.data);
      // const b = document.createElement('a');
      // b.href = url;
      // b.download = `story_summary_${storyId}.docx`;
      // document.body.appendChild(b);
      // b.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(b);
  } catch (error) {
      console.error("Error downloading PDF:", error);
      // Add more specific error handling here
  }
};


const imageUrl = usePollinationsImage("Sketch style image A young journalist with a keen eye for underreported stories, Oliver leverages The Agora's Citizen Journalism Hub to empower individuals to report on issues that matter. His mentorship and guidance ensure the quality and impact of citizen journalism submissions.", {
  width: 1024,
  height: 1024,
  seed: 42,
  model: 'flux',
  nologo: false,
});


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Story Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Input Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Idea Prompt</label>
              <textarea
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Plot Prompt</label>
              <textarea
                value={plotPrompt}
                onChange={(e) => setPlotPrompt(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Character Prompt</label>
              <textarea
                value={characterPrompt}
                onChange={(e) => setCharacterPrompt(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dialogue Prompt</label>
              <textarea
                value={dialoguePrompt}
                onChange={(e) => setDialoguePrompt(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Feedback Prompt</label>
              <textarea
                value={feedbackPrompt}
                onChange={(e) => setFeedbackPrompt(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>
          </div>

          {/* Edit and Control Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Edit Part</label>
              <select
                value={editPartName}
                onChange={(e) => setEditPartName(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              >
                <option value="">Select Part</option>
                <option value="idea">Idea</option>
                <option value="plot">Plot</option>
                <option value="characters">Characters</option>
                <option value="dialogue">Dialogue</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Edit Instructions</label>
              <textarea
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={startFresh}
                onChange={() => setStartFresh(!startFresh)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <label className="text-sm font-medium text-gray-700">Start Fresh</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editSave}
                onChange={() => setEditSave(!editSave)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <label className="text-sm font-medium text-gray-700">Save Edit</label>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => generateStory(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Generate Story
              </button>
              <button
                onClick={() => generateStory(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >Save Story
              </button>
            </div>
          </div>
        </div>

        {storyData && (
  <>
    <div>
      <h3 className="font-semibold text-gray-800">Idea:</h3>
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(storyData.idea || '') }} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">Plot:</h3>
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(storyData.plot || '') }} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">Characters:</h3>
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(storyData.characters || '') }} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">Dialogue:</h3>
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(storyData.dialogue || '') }} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">Feedback:</h3>
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(storyData.feedback || '') }} />
    </div>

    <button onClick={()=>handleDownloadPdf(storyId)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Download PDF
                        </button>


                        <div>
      {imageUrl ? <img src={imageUrl} alt="Generated Image" /> : <p>Loading...</p>}
    </div>
  </>
)}
{!storyData && <p>No story data available.</p>}

      </div>
    </div>
  );
};

export default StoryGenerator;