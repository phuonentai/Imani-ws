import os
import re

# --- Configuration ---
BASE_LANG_DIR = 'content/en'
TARGET_LANG_DIR = 'content/nl'

# --- Main Script Logic ---

def create_placeholders():
    """
    Recursively scans the base language directory and creates placeholder 
    files in the target language directory if they don't exist.
    """
    print(f"Syncing content from '{BASE_LANG_DIR}' to '{TARGET_LANG_DIR}'...")
    created_count = 0

    for root, _, files in os.walk(BASE_LANG_DIR):
        for filename in files:
            if not filename.endswith('.md'):
                continue

            # Determine paths
            base_filepath = os.path.join(root, filename)
            relative_path = os.path.relpath(base_filepath, BASE_LANG_DIR)
            target_filepath = os.path.join(TARGET_LANG_DIR, relative_path)

            # Create target directory if it doesn't exist
            os.makedirs(os.path.dirname(target_filepath), exist_ok=True)

            # Check if the target file needs to be created
            if not os.path.exists(target_filepath):
                with open(base_filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Create placeholder content
                front_matter_match = re.match(r'---\s*$.*?---\s*$', content, re.DOTALL | re.MULTILINE)
                if front_matter_match:
                    front_matter = front_matter_match.group(0)
                    placeholder_body = "\nDit is een placeholder-pagina. Voeg hier de vertaalde inhoud toe.\n"
                    target_content = front_matter + placeholder_body

                    with open(target_filepath, 'w', encoding='utf-8') as f:
                        f.write(target_content)
                    print(f"  - Created: {target_filepath}")
                    created_count += 1

    if created_count == 0:
        print("✅ Content is already in sync. No new files needed.")
    else:
        print(f"\n✅ Finished. Created {created_count} placeholder files.")

if __name__ == '__main__':
    create_placeholders()