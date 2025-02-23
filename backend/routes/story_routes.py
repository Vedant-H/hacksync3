# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel
# from auth import decode_access_token
# from database import users_collection, stories_collection
# import google.generativeai as genai
# import json
# from bson import ObjectId

# router = APIRouter()

# genai.configure(api_key="AIzaSyDYz6fwf8fQuQa_sKoLhSDyS3PRP5FQHfM") # Replace with your actual API Key
# model = genai.GenerativeModel("gemini-pro")

# context_file = "story2_context.json"

# def load_story_context(user_id: str):
#     try:
#         context_data = stories_collection.find_one({"user_id": ObjectId(user_id)})
#         if context_data and "context" in context_data:
#             return context_data["context"]
#         else:
#             return {}
#     except Exception as e:
#         print(f"Error loading story context: {e}")
#         return {}

# def save_story_context(user_id: str, context: dict):
#     try:
#         existing_story = stories_collection.find_one({"user_id": ObjectId(user_id)})
#         if existing_story:
#             stories_collection.update_one({"user_id": ObjectId(user_id)}, {"$set": {"context": context}})
#         else:
#             stories_collection.insert_one({"user_id": ObjectId(user_id), "context": context})
#     except Exception as e:
#         print(f"Error saving context: {e}")

# def generate_ideas(prompt, context):
#     try:
#         previous_idea = context.get("idea", "")
#         full_prompt = f"Previous idea: {previous_idea}\nNow, expand or refine it: {prompt}"
#         response = model.generate_content([full_prompt])
#         context["idea"] = response.text
#         return response.text
#     except genai.types.generation_types.GenerateContentResponseError as e:
#         return f"Gemini API Error: {e}"
#     except Exception as e:
#         return f"An unexpected error occurred: {e}"

# def generate_plot_structure(prompt, context):
#     try:
#         previous_idea = context.get("idea", "")
#         previous_plot = context.get("plot", "")
#         full_prompt = f"Story Idea: {previous_idea}\nExisting Plot: {previous_plot}\nNow, refine the plot: {prompt}"
#         response = model.generate_content([full_prompt])
#         context["plot"] = response.text
#         return response.text
#     except genai.types.generation_types.GenerateContentResponseError as e:
#         return f"Gemini API Error: {e}"
#     except Exception as e:
#         return f"An unexpected error occurred: {e}"

# def generate_character_profile(prompt, context):
#     try:
#         previous_plot = context.get("plot", "")
#         previous_characters = context.get("characters", "")
#         full_prompt = f"Plot Summary: {previous_plot}\nExisting Characters: {previous_characters}\nNow, refine the characters: {prompt}"
#         response = model.generate_content([full_prompt])
#         context["characters"] = response.text
#         return response.text
#     except genai.types.generation_types.GenerateContentResponseError as e:
#         return f"Gemini API Error: {e}"
#     except Exception as e:
#         return f"An unexpected error occurred: {e}"

# def generate_dialogue(prompt, context):
#     try:
#         previous_characters = context.get("characters", "")
#         previous_dialogue = context.get("dialogue", "")
#         full_prompt = f"Characters: {previous_characters}\nExisting Dialogue: {previous_dialogue}\nNow, refine the dialogue: {prompt}"
#         response = model.generate_content([full_prompt])
#         context["dialogue"] = response.text
#         return response.text
#     except genai.types.generation_types.GenerateContentResponseError as e:
#         return f"Gemini API Error: {e}"
#     except Exception as e:
#         return f"An unexpected error occurred: {e}"

# def generate_feedback(prompt, context):
#     try:
#         previous_dialogue = context.get("dialogue", "")
#         previous_feedback = context.get("feedback", "")
#         full_prompt = f"Dialogue: {previous_dialogue}\nExisting Feedback: {previous_feedback}\nProvide constructive feedback on the current story: {prompt}"
#         response = model.generate_content([full_prompt])
#         context["feedback"] = response.text
#         return response.text
#     except genai.types.generation_types.GenerateContentResponseError as e:
#         return f"Gemini API Error: {e}"
#     except Exception as e:
#         return f"An unexpected error occurred: {e}"

# def edit_part(part_name, edit_instructions, context):
#     if part_name.lower() == "idea":
#         context["idea"] = generate_ideas(edit_instructions, context)
#         return context["idea"]
#     elif part_name.lower() == "plot":
#         context["plot"] = generate_plot_structure(edit_instructions, context)
#         return context["plot"]
#     elif part_name.lower() == "characters":
#         context["characters"] = generate_character_profile(edit_instructions, context)
#         return context["characters"]
#     elif part_name.lower() == "dialogue":
#         context["dialogue"] = generate_dialogue(edit_instructions, context)
#         return context["dialogue"]
#     elif part_name.lower() == "feedback":
#         context["feedback"] = generate_feedback(edit_instructions, context)
#         return context["feedback"]

# class StoryRequest(BaseModel):
#     idea_prompt: str = ""
#     plot_prompt: str = ""
#     character_prompt: str = ""
#     dialogue_prompt: str = ""
#     feedback_prompt: str = ""
#     edit_part_name: str = ""
#     edit_instructions: str = ""
#     start_fresh: bool = False
#     edit_save: bool = False
#     token: str

# @router.post("/generate_story")
# async def generate_story(request: StoryRequest):
#     try:
#         payload = decode_access_token(request.token)
#         user_email = payload.get("sub")
#         user = users_collection.find_one({"email": user_email})
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         user_id = str(user["_id"])
#         context = load_story_context(user_id)

#         if request.start_fresh:
#             context = {}
#         elif context and request.edit_part_name and request.edit_instructions:
#             edited_content = edit_part(request.edit_part_name, request.edit_instructions, context)
#             if request.edit_save:
#                 save_story_context(user_id, context)

#         idea = context.get("idea", "")
#         plot = context.get("plot", "")
#         characters = context.get("characters", "")
#         dialogue = context.get("dialogue", "")
#         feedback = context.get("feedback", "")

#         if request.idea_prompt and not idea:
#             idea = generate_ideas(request.idea_prompt, context)
#         if request.plot_prompt and not plot:
#             plot = generate_plot_structure(request.plot_prompt, context)
#         if request.character_prompt and not characters:
#             characters = generate_character_profile(request.character_prompt, context)
#         if request.dialogue_prompt and not dialogue:
#             dialogue = generate_dialogue(request.dialogue_prompt, context)
#         if request.feedback_prompt and not feedback:
#             feedback = generate_feedback(request.feedback_prompt, context)

#         save_story_context(user_id, context)

#         return {
#             "idea": idea,
#             "plot": plot,
#             "characters": characters,
#             "dialogue": dialogue,
#             "feedback": feedback,
#         }
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
import logging
import os
from pdf_generator import json_to_pdf, load_json 
from fastapi import APIRouter, HTTPException, Depends, Header, Query, Response
from pydantic import BaseModel
from auth import decode_access_token
from database import users_collection, stories_collection
import google.generativeai as genai
from bson import ObjectId

logging.basicConfig(level=logging.INFO)

router = APIRouter()
genai.configure(api_key="AIzaSyDYz6fwf8fQuQa_sKoLhSDyS3PRP5FQHfM")  # Replace with your API key
model = genai.GenerativeModel("gemini-pro")

user_contexts = {}

def get_user_context(user_email: str):
    if user_email not in user_contexts:
        user_contexts[user_email] = {}
    print(user_contexts[user_email])
    return user_contexts[user_email]

def save_user_context(user_email: str, context: dict):
    user_contexts[user_email] = context

# def store_final_story(user_email: str, context: dict):
#     user = users_collection.find_one({"email": user_email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_id = str(user["_id"])
#     try:
#         existing_story = stories_collection.find_one({"user_id": ObjectId(user_id)})
#         if existing_story:
#             stories_collection.update_one(
#                 {"user_id": ObjectId(user_id)}, {"$set": {"context": context}}
#             )
#         else:
#             stories_collection.insert_one({"user_id": ObjectId(user_id), "context": context})
#     except Exception as e:
#         print(f"Error saving to MongoDB: {e}")
#         raise HTTPException(status_code=500, detail="Error saving story")

def store_final_story(user_email: str, context: dict , storyId : str):
    user = users_collection.find_one({"email": user_email})
    print(f"user: {user}")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    print(f"user_id: {user_id}, type:{type(user_id)}")
    # print(f"context: {context}")

    try:
        if storyId != "":
            existing_story = stories_collection.find_one({"_id": ObjectId(storyId)})
            print(f"existing_story: {existing_story}")
            if existing_story:
                result = stories_collection.update_one(
                    {"_id": ObjectId(storyId)}, {"$set": {"context": context}}
                )
                print(f"update result: {result.modified_count}")
        else:
            result = stories_collection.insert_one({"user_id": ObjectId(user_id), "context": context})
            print(f"insert result: {result.inserted_id}")

    except Exception as e:
        print(f"Error saving to MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Error saving story")

def generate_ideas(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        full_prompt = f"Previous idea: {previous_idea}\nNow, expand or refine it: {prompt}"
        response = model.generate_content([full_prompt])
        context["idea"] = response.text
        return response.text
    except Exception as e:
        print(f"Error in gemini call: {e}")
        return f"An error occurred: {e}"

def generate_plot_structure(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        previous_plot = context.get("plot", "")
        full_prompt = f"Story Idea: {previous_idea}\nExisting Plot: {previous_plot}\nNow, refine the plot: {prompt}"
        response = model.generate_content([full_prompt])
        context["plot"] = response.text
        return response.text
    except Exception as e:
        print(f"Error in gemini call: {e}")
        return f"An error occurred: {e}"

def generate_character_profile(prompt, context):
    try:
        previous_plot = context.get("plot", "")
        previous_characters = context.get("characters", "")
        full_prompt = f"Plot Summary: {previous_plot}\nExisting Characters: {previous_characters}\nNow, refine the characters: {prompt}"
        response = model.generate_content([full_prompt])
        context["characters"] = response.text
        return response.text
    except Exception as e:
        print(f"Error in gemini call: {e}")
        return f"An error occurred: {e}"

def generate_dialogue(prompt, context):
    try:
        previous_characters = context.get("characters", "")
        previous_dialogue = context.get("dialogue", "")
        full_prompt = f"Characters: {previous_characters}\nExisting Dialogue: {previous_dialogue}\nNow, refine the dialogue: {prompt}"
        response = model.generate_content([full_prompt])
        context["dialogue"] = response.text
        return response.text
    except Exception as e:
        print(f"Error in gemini call: {e}")
        return f"An error occurred: {e}"

def generate_feedback(prompt, context):
    try:
        previous_dialogue = context.get("dialogue", "")
        previous_feedback = context.get("feedback", "")
        full_prompt = f"Dialogue: {previous_dialogue}\nExisting Feedback: {previous_feedback}\nProvide constructive feedback on the current story: {prompt}"
        response = model.generate_content([full_prompt])
        context["feedback"] = response.text
        return response.text
    except Exception as e:
        print(f"Error in gemini call: {e}")
        return f"An error occurred: {e}"

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
    done: bool = False
    newStry: str

@router.post("/generate_story")
async def generate_story(request: StoryRequest):
    try:
        payload = decode_access_token(request.token)
        user_email = payload.get("sub")
        user_context = get_user_context(user_email)
# some new code
        # if request.newStry == "" :
        #     user = users_collection.find_one({"email": user_email})
        #     user_id = str(user["_id"])
        #     print(request.newStry," new Id")
        #     print(f"user_id: {user_id}, type:{type(user_id)}")
        #     result = stories_collection.insert_one({"user_id": ObjectId(user_id), "context": user_context})
        #     print(f"insert result: {result.inserted_id}")

        if request.start_fresh:
            user_context = {}
            save_user_context(user_email, {})

        if request.edit_part_name and request.edit_instructions:
            edited_content = edit_part(
                request.edit_part_name, request.edit_instructions, user_context
            )
            if request.edit_save:
                save_user_context(user_email, user_context)

        idea = user_context.get("idea", "")
        plot = user_context.get("plot", "")
        characters = user_context.get("characters", "")
        dialogue = user_context.get("dialogue", "")
        feedback = user_context.get("feedback", "")

        if request.idea_prompt and not idea:
            idea = generate_ideas(request.idea_prompt, user_context)
        if request.plot_prompt and not plot:
            plot = generate_plot_structure(request.plot_prompt, user_context)
        if request.character_prompt and not characters:
            characters = generate_character_profile(
                request.character_prompt, user_context
            )
        if request.dialogue_prompt and not dialogue:
            dialogue = generate_dialogue(request.dialogue_prompt, user_context)
        if request.feedback_prompt and not feedback:
            feedback = generate_feedback(request.feedback_prompt, user_context)

        save_user_context(user_email, user_context)

        if request.done and request.newStry == "" :
            store_final_story(user_email, user_context , request.newStry)
            del user_contexts[user_email]

        if request.done :
            store_final_story(user_email, user_context , request.newStry)
            del user_contexts[user_email]

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
    

@router.get("/user_stories")
async def get_user_stories(user_id: str = Query(...)):
    try:
        stories = list(stories_collection.find({"user_id": ObjectId(user_id)}))
        for story in stories:
            story["_id"] = str(story["_id"])  # Convert _id to string
            story["user_id"] = str(story["user_id"]) #convert user_id to string

        return {"stories": stories}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{story_id}")
async def get_story_by_id(story_id: str):
    try:
        story = stories_collection.find_one({"_id": ObjectId(story_id)})
        if story:
            # Convert ObjectId to string
            story["_id"] = str(story["_id"])
            story["user_id"] = str(story["user_id"])

            return {"story": story}
        else:
            raise HTTPException(status_code=404, detail="Story not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/generate_pdf/{story_id}")
async def generate_pdf(story_id: str):
    try:
        logging.info(f"Generating PDF for story ID: {story_id}")

        # Fetch the story using get_story_by_id
        stry = await get_story_by_id(story_id)
        if not stry or not stry.get("story") or not stry["story"].get("context"):
            logging.warning(f"Story context not found for story ID: {story_id}")
            raise HTTPException(status_code=404, detail="Story context not found.")

        story_context = stry["story"]["context"]

        # Generate the PDF directly from the story context using pdf_generator.py function
        pdf_filename = f"story_summary_{story_id}.pdf"
        json_to_pdf(story_context, pdf_filename)

        # Check if the PDF file was created
        if not os.path.exists(pdf_filename):
            logging.error(f"PDF file not created: {pdf_filename}")
            raise HTTPException(status_code=500, detail="Failed to generate PDF.")

        with open(pdf_filename, "rb") as pdf_file:
            pdf_content = pdf_file.read()

      

        headers = {
            "Content-Disposition": f"attachment; filename=story_summary_{story_id}.pdf"
        }
        return Response(content=pdf_content, media_type="application/pdf", headers=headers)

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.exception(f"Error generating PDF for story ID: {story_id}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")