import json
import os
import re
import requests

# List of files to process

# List of files to process
FILES = [
    'parse_result_2026-02-01.json',
    'parse_result_2026-02-01 (1).json',
    'parse_result_2026-02-01 (2).json',
    'parse_result_2026-02-01 (3).json',
    'parse_result_2026-02-01 (4).json'
]

OUTPUT_DIR = "markdown_blogs"

def slugify(text):
    """
    Converts text to a slug suitable for directory names.
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def download_image(url, assets_dir, image_count):
    """
    Downloads an image from a URL and saves it to the assets directory.
    Returns the local filename if successful, else None.
    """
    try:
        # Determine filename
        img_filename = f"image_{image_count}.png" # Default to png
        if '?' in url:
            clean_url = url.split('?')[0]
            ext = os.path.splitext(clean_url)[1]
            if ext:
                img_filename = f"image_{image_count}{ext}"
        
        img_path = os.path.join(assets_dir, img_filename)
        
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(img_path, 'wb') as img_f:
                img_f.write(response.content)
            print(f"  Downloaded asset: {img_filename}")
            return img_filename
        else:
            print(f"  Failed to download image: {url} (Status: {response.status_code})")
            return None
    except Exception as e:
        print(f"  Error downloading image: {e}")
        return None

def process_file(filename):
    """
    Processes a single JSON file to extract blog content and assets using 'blocks'.
    """
    if not os.path.exists(filename):
        print(f"Error: File not found - {filename}")
        return

    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return



    result = data.get('result', {})
    chunks = result.get('chunks', [])
    blocks = []
    for chunk in chunks:
        if 'blocks' in chunk:
            blocks.extend(chunk['blocks'])

    if not blocks:
        print(f"Warning: No blocks found in {filename} (checked inside chunks)")
        return


    # Extract Title first to create directory
    title = "Untitled Blog"
    found_title = False
    
    # helper to find title in blocks
    for block in blocks:
        if block.get('type') == 'Title':
            title = block.get('content', '').strip()
            if title:
                found_title = True
                break
    
    # Fallback if no Title block
    if not found_title:
        # Look for first header or text
        for block in blocks:
            b_type = block.get('type')
            content = block.get('content', '').strip()
            if not content: continue
            
            if b_type in ['Section Header', 'Text']:
                first_line = content.split('\n')[0]
                if len(first_line) < 100:
                    title = first_line.lstrip('#').strip()
                    break
    
    # Create Directories
    slug = slugify(title)
    if not slug or slug == "untitled-blog":
         slug = f"blog-{os.path.basename(filename).replace('.json', '')}"

    blog_dir = os.path.join(OUTPUT_DIR, slug)
    assets_dir = os.path.join(blog_dir, 'assets')
    os.makedirs(assets_dir, exist_ok=True)

    # Reconstruct Content from Blocks
    markdown_lines = []
    image_count = 0
    
    for block in blocks:
        b_type = block.get('type')
        content = block.get('content', '')
        image_url = block.get('image_url')

        if not content and not image_url:
            continue

        if image_url:
            # Handle Image/Figure
            local_filename = download_image(image_url, assets_dir, image_count)
            if local_filename:
                # Use content as alt text, truncated
                alt_text = content.replace('\n', ' ')[:100] if content else f"Image {image_count}"
                markdown_lines.append(f"\n![{alt_text}](assets/{local_filename})\n")
                
                # Optionally add caption if it's a Figure with long content? 
                # For now just the image is usually safer to avoid duplicating OCR'd text of charts.
                image_count += 1
            else:
                # Fallback if download fails: keep content if meaningful?
                pass
        
        elif b_type == 'Title':
            markdown_lines.append(f"# {content}\n")
        
        elif b_type == 'Section Header':
             markdown_lines.append(f"## {content}\n")
             
        elif b_type == 'List Item':
            markdown_lines.append(f"{content}\n")
            
        elif b_type == 'Footer' or b_type == 'Page Number':
            pass # Skip footers/page numbers
            
        else:
            # Standard Text and other types
            markdown_lines.append(f"{content}\n")

    full_content = "\n".join(markdown_lines)

    # Write blog.md
    with open(os.path.join(blog_dir, 'blog.md'), 'w', encoding='utf-8') as f:
        f.write(full_content)

    print(f"Successfully created blog: {slug} (from {filename})")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"Processing {len(FILES)} files...")
    
    for filename in FILES:
        process_file(filename)
        
    print("Done.")

if __name__ == "__main__":
    main()
