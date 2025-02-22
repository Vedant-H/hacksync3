import google.generativeai as genai
import json
from IPython.display import display, Markdown

genai.configure(api_key="AIzaSyDYz6fwf8fQuQa_sKoLhSDyS3PRP5FQHfM")

model = genai.GenerativeModel("gemini-pro")


# File to save/load story context
context_file = "story2_context.json"

# Function to load the story context from file
def load_story_context():
    try:
        with open(context_file, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}  # Return an empty dictionary if no context exists

# Function to save the story context to file
def save_story_context(context):
    try:
        with open(context_file, "w") as f:
            json.dump(context, f, indent=4)
    except Exception as e:
        print(f"Error saving context: {e}")

# Function to generate story ideas while maintaining context
def generate_ideas(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        full_prompt = f"Previous idea: {previous_idea}\nNow, expand or refine it: {prompt}"
        response = model.generate_content([full_prompt])
        context["idea"] = response.text
        save_story_context(context)
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        print(f"Gemini API Error: {e}")
        return "Error generating ideas. Please check your API key or prompt."
    except Exception as e:
        print(f"Error generating ideas: {e}")
        return "An unexpected error occurred."

# Function to generate plot structure while keeping context
def generate_plot_structure(prompt, context):
    try:
        previous_idea = context.get("idea", "")
        previous_plot = context.get("plot", "")
        full_prompt = f"Story Idea: {previous_idea}\nExisting Plot: {previous_plot}\nNow, refine the plot: {prompt}"
        response = model.generate_content([full_prompt])
        context["plot"] = response.text
        save_story_context(context)
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        print(f"Gemini API Error: {e}")
        return "Error generating plot. Please check your API key or prompt."
    except Exception as e:
        print(f"Error generating plot structure: {e}")
        return "An unexpected error occurred."

# Function to generate character profiles with story continuity
def generate_character_profile(prompt, context):
    try:
        previous_plot = context.get("plot", "")
        previous_characters = context.get("characters", "")
        full_prompt = f"Plot Summary: {previous_plot}\nExisting Characters: {previous_characters}\nNow, refine the characters: {prompt}"
        response = model.generate_content([full_prompt])
        context["characters"] = response.text
        save_story_context(context)
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        print(f"Gemini API Error: {e}")
        return "Error generating characters. Please check your API key or prompt."
    except Exception as e:
        print(f"Error generating character profile: {e}")
        return "An unexpected error occurred."

# Function to generate dialogues that match the characters and story
def generate_dialogue(prompt, context):
    try:
        previous_characters = context.get("characters", "")
        previous_dialogue = context.get("dialogue", "")
        full_prompt = f"Characters: {previous_characters}\nExisting Dialogue: {previous_dialogue}\nNow, refine the dialogue: {prompt}"
        response = model.generate_content([full_prompt])
        context["dialogue"] = response.text
        save_story_context(context)
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        print(f"Gemini API Error: {e}")
        return "Error generating dialogue. Please check your API key or prompt."
    except Exception as e:
        print(f"Error generating dialogue: {e}")
        return "An unexpected error occurred."

# Function to provide real-time editing feedback while considering previous context
def generate_feedback(prompt, context):
    try:
        previous_dialogue = context.get("dialogue", "")
        previous_feedback = context.get("feedback", "")
        full_prompt = f"Dialogue: {previous_dialogue}\nExisting Feedback: {previous_feedback}\nProvide constructive feedback on the current story: {prompt}"
        response = model.generate_content([full_prompt])
        context["feedback"] = response.text
        save_story_context(context)
        return response.text
    except genai.types.generation_types.GenerateContentResponseError as e:
        print(f"Gemini API Error: {e}")
        return "Error generating feedback. Please check your API key or prompt."
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return "An unexpected error occurred."

# Function to format and display the story in a well-structured way
def display_markdown(title, content):
    formatted_content = f"### {title}\n\n{content}"
    display(Markdown(formatted_content))

#Enhanced Edit Function
def edit_part(part_name, context):
    existing_content = context.get(part_name.lower())
    if not existing_content:
        print(f"No existing {part_name} found.")
        return

    display_markdown(part_name, existing_content)
    edit_instructions = input(f"Enter instructions to edit the {part_name}: ")

    if part_name.lower() == "idea":
      context["idea"] = generate_ideas(edit_instructions, context)
    elif part_name.lower() == "plot":
      context["plot"] = generate_plot_structure(edit_instructions, context)
    elif part_name.lower() == "characters":
      context["characters"] = generate_character_profile(edit_instructions, context)
    elif part_name.lower() == "dialogue":
      context["dialogue"] = generate_dialogue(edit_instructions, context)
    elif part_name.lower() == "feedback":
      context["feedback"] = generate_feedback(edit_instructions, context)

    display_markdown(f"Updated {part_name}", context[part_name.lower()])
    save_story_context(context)

# Main function to assist with full story development
def full_story_assistance():
    print("📖 Welcome to the Story Generator! 🚀")
    context = load_story_context()

    if context:
        print("\n🔄 Resuming from saved context...\n")
        # Display each part of the context using Markdown
        for key, value in context.items():
            display_markdown(key.capitalize(), value)
        user_choice = input("\nWould you like to (C)Close, (E)Edit a part, or (S)Start fresh? (C/E/S): ").strip().lower()

        if user_choice == 'c':
            print("\nExiting the story generator. Goodbye!\n")
            return
        elif user_choice == 'e':
            while True:
                part_to_edit = input("Which part would you like to edit? (Idea/Plot/Characters/Dialogue/Feedback/Close): ").strip().lower()
                if part_to_edit == 'close':
                    print("\nExiting the editor. Returning to the main menu.\n")
                    break
                elif part_to_edit in ['idea', 'plot', 'characters', 'dialogue', 'feedback']:
                    edit_part(part_to_edit.capitalize(), context)
                else:
                    print("Invalid choice. Please choose a valid part to edit.")

                save_choice = input("\nDo you want to save these changes? (Y/N): ").strip().lower()
                if save_choice == 'n':
                    print("\nChanges discarded. Returning to previous state.\n")
                    break
                elif save_choice == 'y':
                    print("\nChanges saved!\n")
                else:
                    print("\nInvalid input. Continuing the editing process.")
            save_story_context(context)
            print("\nThe story has been updated and saved!")
        elif user_choice == 's':
            print("\nStarting a fresh new story...\n")
            context = {}
    else:
        print("\nNo previous story found. Let's create a new story!")

    idea = context.get("idea", None)
    if not idea:
        idea_prompt = input("📝 Enter a prompt to generate a unique story idea: ")
        idea = generate_ideas(idea_prompt, context)
        if idea:
            display_markdown("Story Idea", idea)

    plot = context.get("plot", None)
    if not plot:
        plot_prompt = input("📜 Enter a prompt to refine the plot structure: ")
        plot = generate_plot_structure(plot_prompt, context)
        if plot:
            display_markdown("Plot Structure", plot)

    characters = context.get("characters", None)
    if not characters:
        character_prompt = input("🎭 Enter a prompt to develop characters based on the plot: ")
        characters = generate_character_profile(character_prompt, context)
        if characters:
            display_markdown("Character Profiles", characters)

    dialogue = context.get("dialogue", None)
    if not dialogue:
        dialogue_prompt = input("💬 Enter a prompt to generate dialogue: ")
        dialogue = generate_dialogue(dialogue_prompt, context)
        if dialogue:
            display_markdown("Dialogue", dialogue)

    feedback = context.get("feedback", None)
    if not feedback:
        feedback_prompt = input("📝 Enter a prompt to provide constructive feedback on the story: ")
        feedback = generate_feedback(feedback_prompt, context)
        if feedback:
            display_markdown("Real-Time Feedback", feedback)

    save_story_context(context)
    print("\nThe story has been saved successfully!")

# Run the full story assistance
if __name__ == "__main__":
    full_story_assistance()