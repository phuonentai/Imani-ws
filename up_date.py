import os
import json

# --- Configuration ---
# Data for the new pages we want to create
NEW_PAGES = [
    {
        "name": "FP&A Outsourcing",
        "slug": "fpa-outsourcing",
        "description": "Leverage our expert team for your financial planning and analysis without the overhead of a full-time hire."
    },
    {
        "name": "Power BI Dashboards",
        "slug": "power-bi-dashboards",
        "description": "Transform your raw data into interactive, real-time business insights with custom-built Power BI dashboards."
    },
    {
        "name": "Data Integration",
        "slug": "data-integration",
        "description": "Consolidate your disparate data sources into a single source of truth for reliable and consistent reporting."
    }
]

SOLUTIONS_JSON_PATH = 'data/menu/solutions.json'
CONTENT_DIR = 'content/solutions'

# --- Main Script Logic ---

def update_menu_data():
    """Updates the URLs in the solutions.json data file."""
    print(f"Updating menu data in '{SOLUTIONS_JSON_PATH}'...")
    try:
        with open(SOLUTIONS_JSON_PATH, 'r') as f:
            menu_data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Could not find '{SOLUTIONS_JSON_PATH}'. Aborting.")
        return False

    # Create a mapping of page names to their new URLs
    url_map = {page['name']: f"/solutions/{page['slug']}/" for page in NEW_PAGES}

    # Update the URL for each matching entry in the menu data
    for item in menu_data:
        if item['name'] in url_map:
            item['url'] = url_map[item['name']]
            print(f"  - Set URL for '{item['name']}' to '{item['url']}'")

    with open(SOLUTIONS_JSON_PATH, 'w') as f:
        json.dump(menu_data, f, indent=2)
    
    return True

def create_content_files():
    """Creates the new markdown files for the solution detail pages."""
    print(f"\nCreating content files in '{CONTENT_DIR}'...")
    os.makedirs(CONTENT_DIR, exist_ok=True)

    for page in NEW_PAGES:
        # Define the content for the markdown file using an f-string
        md_content = f"""---
title: "{page['name']}"
description: "{page['description']}"
---

This is the detail page for **{page['name']}**. You can add more detailed content, case studies, or technical specifications here.
"""
        # Define the file path
        file_path = os.path.join(CONTENT_DIR, f"{page['slug']}.md")

        # Write the content to the file
        with open(file_path, 'w') as f:
            f.write(md_content)
        print(f"  - Created '{file_path}'")

def main():
    """Main function to run the script."""
    if update_menu_data():
        create_content_files()
        print("\n✅ Script finished successfully!")
        print("Run 'hugo server' to see your new pages.")

if __name__ == '__main__':
    main()