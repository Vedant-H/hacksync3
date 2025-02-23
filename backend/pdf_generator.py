import json
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def markdown_to_pdf_format(text):
    """
    Convert markdown-like formatting to PDF styling.
    - Bold text: **text**
    - Italic text: *text*
    - Headers: ## header text
    - Lists: * list item
    """
    # Convert bold text (using **text**)
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)

    # Convert italic text (using *text*)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)

    # Convert headers (## header text)
    text = re.sub(r'^(## .*)', r'<b>\1</b>', text, flags=re.MULTILINE)

    # Convert list items (* or - list item)
    text = re.sub(r'^[*-]\s+(.*)', r'<li>\1</li>', text, flags=re.MULTILINE)

    return text


def json_to_pdf(json_data, pdf_filename="story_summary.pdf"):
    try:
        styles = getSampleStyleSheet()
        style_normal = styles["Normal"]
        style_heading = styles["Heading1"]
        style_normal_spaced = ParagraphStyle(
            'NormalSpaced',
            parent=style_normal,
            spaceAfter=0.2 * inch,
            leading=14,
        )
        style_list_item = ParagraphStyle(
            'ListItem',
            parent=style_normal_spaced,
            leftIndent=0.25 * inch,
        )

        # Specify a custom title for the PDF
        doc = SimpleDocTemplate(pdf_filename, pagesize=letter, title="Story Summary PDF")
        elements = []

        for key, value in json_data.items():
            # Capitalize the key and add it as a section title
            elements.append(Paragraph(f"<b>{key.upper()}</b>", style_heading))
            elements.append(Spacer(1, 0.2 * inch))  # Add space after each section header

            # Split the content into lines
            lines = value.split('\n')

            # Process each line using markdown_to_pdf_format
            for line in lines:
                line = line.strip()  # Clean up leading/trailing spaces

                if line:  # Only process non-empty lines
                    # Apply markdown formatting
                    formatted_line = markdown_to_pdf_format(line)
                    elements.append(Paragraph(formatted_line, style_normal_spaced))

            elements.append(Spacer(1, 0.5 * inch))  # Add space after each section

        # Build the document
        doc.build(elements)
        print(f"PDF '{pdf_filename}' created successfully.")

    except Exception as e:
        print(f"Error creating PDF: {e}")


def load_json(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        print(f"Error: File '{filepath}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{filepath}'.")
        return None


if __name__ == "__main__":
    json_file = "story2_context.json"  # Replace with your json filename.
    json_data = load_json(json_file)

    if json_data:
        json_to_pdf(json_data)
