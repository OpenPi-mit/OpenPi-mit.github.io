
import os
import sys
import hashlib
from gen import generate_blog_cover

BLOG_DIR = "content/blogs"

def main():
    if not os.path.exists(BLOG_DIR):
        print(f"Error: {BLOG_DIR} not found.")
        return

    count = 0
    for entry in os.scandir(BLOG_DIR):
        if entry.is_dir():
            slug = entry.name
            target_file = os.path.join(entry.path, "blog.svg")
            print(f"Regenerating for {slug}...")
            # Generate new cover for this blog
            # Use stable hash of slug for seed
            hex_hash = hashlib.md5(slug.encode('utf-8')).hexdigest()
            seed = int(hex_hash, 16) % 10000000
            generate_blog_cover(seed=seed, filename=target_file, unique_id=slug)
            count += 1
            
    print(f"Successfully regenerated {count} blog icons.")

if __name__ == "__main__":
    main()
