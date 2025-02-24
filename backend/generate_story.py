from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth import decode_access_token
from database import users_collection, stories_collection
import google.generativeai as genai
import json
from bson import ObjectId

router = APIRouter()

genai.configure(api_key="") # Replace with your actual API Key
model = genai.GenerativeModel("gemini-pro")

context_file = "story2_context.json"

def load_story_context(user_id: str):
    try:
        context_data = stories_collection.find_one({"user_id": ObjectId(user_id)})
        if context_data and "context" in context_data:
            return context_data["context"]
        else:
            return {}
    except Exception as e:
        print(f"Error loading story context: {e}")
        return {}

def save_story_context(user_id: str, context: dict):
    try:
        existing_story = stories_collection.find_one({"user_id": ObjectId(user_id)})
        if existing_story:
            stories_collection.update_one({"user_id": ObjectId(user_id)}, {"$set": {"context": context}})
        else:
            stories_collection.insert_one({"user_id": ObjectId(user_id), "context": context})
    except Exception as e:
        print(f"Error saving context: {e}")

def generate_ideas(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        full_prompt = f"Previous idea: {previous_idea}\nNow, expand or refine it: {prompt}"
        response = model.generate_content([full_prompt])
        context["idea"] = response.text
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        return f"Gemini API Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_plot_structure(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        previous_plot = context.get("plot", "")
        full_prompt = f"Story Idea: {previous_idea}\nExisting Plot: {previous_plot}\nNow, refine the plot: {prompt}"
        response = model.generate_content([full_prompt])
        context["plot"] = response.text
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        return f"Gemini API Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_character_profile(prompt, context):
    try:
        previous_plot = context.get("plot", "")
        previous_characters = context.get("characters", "")
        full_prompt = f"Plot Summary: {previous_plot}\nExisting Characters: {previous_characters}\nNow, refine the characters: {prompt}"
        response = model.generate_content([full_prompt])
        context["characters"] = response.text
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        return f"Gemini API Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_dialogue(prompt, context):
    try:
        previous_characters = context.get("characters", "")
        previous_dialogue = context.get("dialogue", "")
        full_prompt = f"Characters: {previous_characters}\nExisting Dialogue: {previous_dialogue}\nNow, refine the dialogue: {prompt}"
        response = model.generate_content([full_prompt])
        context["dialogue"] = response.text
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        return f"Gemini API Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_feedback(prompt, context):
    try:
        previous_dialogue = context.get("dialogue", "")
        previous_feedback = context.get("feedback", "")
        full_prompt = f"Dialogue: {previous_dialogue}\nExisting Feedback: {previous_feedback}\nProvide constructive feedback on the current story: {prompt}"
        response = model.generate_content([full_prompt])
        context["feedback"] = response.text
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        return f"Gemini API Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def edit_part(part_name, edit_instructions, context):
    if part_name.lower() == "idea":
        context["idea"] = generate_ideas(edit_instructions, context)
        return context["idea"]
    elif part_name.lower() == "plot":
        context["plot"] = generate_plot_structure(edit_instructions, context)
        return context["plot"]
    elif part_name.lower() == "characters":
        context["characters"] = generate_character_profile(edit_instructions, context)
        return context["characters"]
    elif part_name.lower() == "dialogue":
        context["dialogue"] = generate_dialogue(edit_instructions, context)
        return context["dialogue"]
    elif part_name.lower() == "feedback":
        context["feedback"] = generate_feedback(edit_instructions, context)
        return context["feedback"]

class StoryRequest(BaseModel):
    idea_prompt: str = ""
    plot_prompt: str = ""
    character_prompt: str = ""
    dialogue_prompt: str = ""
    feedback_prompt: str = ""
    edit_part_name: str = ""
    edit_instructions: str = ""
    start_fresh: bool = False
    edit_save: bool = False
    token: str

@router.post("/generate_story")
async def generate_story(request: StoryRequest):
    try:
        payload = decode_access_token(request.token)
        user_email = payload.get("sub")
        user = users_collection.find_one({"email": user_email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = str(user["_id"])
        context = load_story_context(user_id)

        if request.start_fresh:
            context = {}
        elif context and request.edit_part_name and request.edit_instructions:
            edited_content = edit_part(request.edit_part_name, request.edit_instructions, context)
            if request.edit_save:
                save_story_context(user_id, context)

        idea = context.get("idea", "")
        plot = context.get("plot", "")
        characters = context.get("characters", "")
        dialogue = context.get("dialogue", "")
        feedback = context.get("feedback", "")

        if request.idea_prompt and not idea:
            idea = generate_ideas(request.idea_prompt, context)
        if request.plot_prompt and not plot:
            plot = generate_plot_structure(request.plot_prompt, context)
        if request.character_prompt and not characters:
            characters = generate_character_profile(request.character_prompt, context)
        if request.dialogue_prompt and not dialogue:
            dialogue = generate_dialogue(request.dialogue_prompt, context)
        if request.feedback_prompt and not feedback:
            feedback = generate_feedback(request.feedback_prompt, context)

        save_story_context(user_id, context)

        return {
            "idea": idea,
            "plot": plot,
            "characters": characters,
            "dialogue": dialogue,
            "feedback": feedback,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
