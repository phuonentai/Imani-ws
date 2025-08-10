import yaml
from pathlib import Path
import re

# --- Configuration ---
MENU_FILE = Path("data/menu.yaml")
CONTENT_DIR = Path("content")
LANGUAGES = ["en", "nl", "es"]
SECTION = "solutions"

def get_key_mapping(menu_data):
    """Parses the menu data and creates a mapping from filename to translationKey."""
    mapping = {}
    for group in menu_data.get("solutions", []):
        for item in group.get("items", []):
            if "file" in item and "translationKey" in item:
                mapping[item["file"]] = item["translationKey"]
    return mapping

def update_front_matter(file_path: Path, translation_key: str):
    """Reads a markdown file, adds/updates the translationKey, and writes it back."""
    try:
        # Separate front matter from content using regex
        content = file_path.read_text(encoding="utf-8")
        match = re.match(r"(---\s*\n)(.*?)(\n---\s*\n)", content, re.DOTALL)

        if not match:
            print(f"  - ❌ Could not find front matter in {file_path}")
            return

        front_matter_str = match.group(2)
        front_matter_lines = front_matter_str.splitlines()

        # Check if translationKey already exists and update it or add it
        key_exists = False
        updated_lines = []
        for line in front_matter_lines:
            if line.strip().startswith("translationKey:"):
                key_exists = True
                updated_line = f"translationKey: \"{translation_key}\""
                updated_lines.append(updated_line)
                print(f"  - 🔄 Updating key in {file_path}")
            else:
                updated_lines.append(line)

        if not key_exists:
            updated_lines.append(f"translationKey: \"{translation_key}\"")
            print(f"  - ✅ Adding key to {file_path}")

        # Rebuild the file content and write it back
        new_front_matter = "\n".join(updated_lines)
        new_content = match.expand(r"\1" + new_front_matter + r"\3") + content[match.end():]
        file_path.write_text(new_content, encoding="utf-8")

    except Exception as e:
        print(f"  - ❌ Error processing {file_path}: {e}")


def main():
    """Main function to run the update process."""
    if not MENU_FILE.exists():
        print(f"Error: Menu file not found at '{MENU_FILE}'")
        return

    print("Loading menu blueprint...")
    menu_data = yaml.safe_load(MENU_FILE.read_text(encoding="utf-8"))
    key_map = get_key_mapping(menu_data)

    if not key_map:
        print("Error: Could not generate a filename-to-key mapping from the menu file.")
        return

    print("Scanning content files to update translationKeys...\n")
    for lang in LANGUAGES:
        section_path = CONTENT_DIR / lang / SECTION
        if not section_path.is_dir():
            continue

        for md_file in section_path.glob("*.md"):
            # Exclude _index.md files
            if md_file.name == "_index.md":
                continue

            # Get the base filename without extension
            file_key = md_file.stem
            
            if file_key in key_map:
                target_key = key_map[file_key]
                update_front_matter(md_file, target_key)

    print("\nScript finished.")


if __name__ == "__main__":
    main()