import random
import math
import time

# --- CONFIGURATION ---
WIDTH = 1200
HEIGHT = 630
BG_COLOR = "#FFFFFF"     # Pure white background
TRIANGLE_SIZE = 45       # Slightly larger for a cleaner, less "noisy" look

# --- COLOR ENGINE ---

def hsv_to_rgb_hex(h, s, v):
    """ Converts HSV to a hex string for SVG. """
    c = v * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = v - c
    if 0 <= h < 60: r, g, b = c, x, 0
    elif 60 <= h < 120: r, g, b = x, c, 0
    elif 120 <= h < 180: r, g, b = 0, c, x
    elif 180 <= h < 240: r, g, b = 0, x, c
    elif 240 <= h < 300: r, g, b = x, 0, c
    else: r, g, b = c, 0, x
    r, g, b = int((r + m) * 255), int((g + m) * 255), int((b + m) * 255)
    return f"#{r:02x}{g:02x}{b:02x}"

def get_vibrant_color(x, y, grad_props, rng):
    """ Calculates vibrant color based on global position gradient. """
    angle, h_start, h_end = grad_props
    dx, dy = math.cos(angle), math.sin(angle)
    cx, cy = WIDTH / 2, HEIGHT / 2
    
    # Project onto gradient vector
    proj = (x - cx) * dx + (y - cy) * dy
    max_dist = 800
    t = (proj + max_dist) / (2 * max_dist)
    t = max(0.0, min(1.0, t))
    
    # Interpolate hue
    h = h_start + (h_end - h_start) * t
    
    # Vibrant Settings
    s = 0.65 + (rng.random() * 0.15) 
    v = 0.90 + (rng.random() * 0.10)
    h += rng.uniform(-10, 10) 
    return hsv_to_rgb_hex(h % 360, s, v)

def get_stripe_color(rng):
    """ Ultra-light gray for subtle background texture. """
    v = rng.uniform(0.94, 0.98) # Very bright
    return hsv_to_rgb_hex(0, 0, v)

# --- GLOBAL MESH GENERATOR ---

def generate_global_mesh(width, height, rng):
    """
    Generates ONE single grid of triangles covering the whole canvas.
    This ensures that when we clip it later, everything aligns perfectly.
    """
    # Add padding so triangles don't disappear at edges
    pad = 50
    start_x, start_y = -pad, -pad
    end_w, end_h = width + pad*2, height + pad*2
    
    cols = int(end_w / TRIANGLE_SIZE)
    rows = int(end_h / TRIANGLE_SIZE)
    
    cell_w = end_w / cols
    cell_h = end_h / rows
    
    # Reduced jitter for a "cleaner" look
    jitter_x = cell_w * 0.30
    jitter_y = cell_h * 0.30
    
    # 1. Generate Vertices
    grid = []
    for r in range(rows + 1):
        row_pts = []
        for c in range(cols + 1):
            px = start_x + c * cell_w
            py = start_y + r * cell_h
            
            # Jitter
            if 0 < c < cols: px += rng.uniform(-jitter_x, jitter_x)
            if 0 < r < rows: py += rng.uniform(-jitter_y, jitter_y)
            
            row_pts.append((px, py))
        grid.append(row_pts)
        
    # 2. Triangulate
    # We store triangles as simple lists of points [(x,y), (x,y), (x,y)]
    # We also pre-calculate the centroid for coloring later
    triangles = []
    for r in range(rows):
        for c in range(cols):
            p00 = grid[r][c]
            p10 = grid[r][c+1]
            p01 = grid[r+1][c]
            p11 = grid[r+1][c+1]
            
            if rng.random() < 0.5:
                tris = [(p00, p10, p11), (p00, p11, p01)]
            else:
                tris = [(p00, p10, p01), (p10, p11, p01)]
            
            for tri in tris:
                cx = sum(p[0] for p in tri) / 3
                cy = sum(p[1] for p in tri) / 3
                triangles.append({'pts': tri, 'cx': cx, 'cy': cy})
                
    return triangles

# --- MAIN GENERATOR ---

# --- MAIN GENERATOR ---

import hashlib

def generate_blog_cover(seed=None, filename="blog.svg", unique_id=None):
    if seed is None: seed = int(time.time())
    
    # Generate a short, stable unique ID if one wasn't properly provided or if it's long
    # If unique_id is the slug, we hash it to keep it short and consistent
    if unique_id is None: 
        unique_id = str(seed)
    
    # Create a stable, short alphanumeric ID from the unique_id (slug)
    # This avoids issues with extremely long IDs from long slugs
    short_uid = hashlib.md5(str(unique_id).encode('utf-8')).hexdigest()[:8]
    
    print(f"Generating clean mesh with Seed: {seed}, UID: {short_uid}")
    rng = random.Random(seed)
    
    # 1. Setup Colors
    grad_angle = math.radians(rng.randint(0, 360))
    hue_start = rng.randint(0, 360)
    hue_end = hue_start + rng.choice([-80, -60, 60, 80])
    grad_props = (grad_angle, hue_start, hue_end)
    
    svg = []
    # Add unique ID to the top-level SVG
    # Set width/height to 100% and use preserveAspectRatio="xMidYMid slice" to fill container
    svg.append(f'<svg id="svg-{short_uid}" width="100%" height="100%" viewBox="0 0 {WIDTH} {HEIGHT}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">')
    svg.append(f'<rect width="100%" height="100%" fill="{BG_COLOR}"/>')

    # --- CSS ANIMATION ---
    # Scope keyframes and class selectors to this specific SVG instance
    anim_name = f"orbit-{short_uid}"
    group_class = f"orbit-group-{short_uid}"
    
    svg.append('<style>')
    svg.append(f'@keyframes {anim_name} {{ from {{ transform: rotate(0deg); }} to {{ transform: rotate(360deg); }} }}')
    svg.append(f'.{group_class} {{ transform-origin: {WIDTH/2}px {HEIGHT/2}px; }}')
    # Scope hover trigger to this specific SVG's ID
    # svg.append(f'#svg-{short_uid}:hover .{group_class} {{ animation: {anim_name} 20s linear infinite; }}')
    svg.append('</style>')
    
    # --- 2. DEFINE SHAPES (CLIPPING MASKS) ---
    svg.append('<defs>')
    
    # Group A: The Stripes (Rotated Rectangles)
    stripe_rotation = rng.randint(0, 360)
    num_stripes = rng.randint(3, 5)
    diag = math.hypot(WIDTH, HEIGHT) * 1.5
    
    # Scope clip paths as well
    clip_stripes_id = f"clip_stripes_{short_uid}"
    mask_circles_id = f"mask_circles_{short_uid}"
    
    svg.append(f'<clipPath id="{clip_stripes_id}">')
    for i in range(num_stripes):
        sh = rng.randint(25, 55) # Thin lines
        offset = rng.uniform(-HEIGHT/1.8, HEIGHT/1.8)
        cx, cy = WIDTH/2, HEIGHT/2
        svg.append(f'<rect x="{cx - diag/2}" y="{cy + offset - sh/2}" width="{diag}" height="{sh}" transform="rotate({stripe_rotation} {cx} {cy})" />')
    svg.append('</clipPath>')
    
    # Group B: The Circles (MASK)
    circles = []
    # Hero Circle (Static Center)
    hero_circle = {'x': WIDTH/2 + rng.randint(-40,40), 'y': HEIGHT/2 + rng.randint(-20,20), 'r': rng.randint(220, 260)}
    
    # Satellites (Orbiting)
    orbit_circles = []
    for _ in range(10):
        if len(orbit_circles) > 5: break
        r = rng.randint(50, 100)
        x = rng.randint(r, WIDTH-r)
        y = rng.randint(r, HEIGHT-r)
        
        # Collision
        hit = False
        if math.hypot(x-hero_circle['x'], y-hero_circle['y']) < (r + hero_circle['r'] + 30): hit = True
        for c in orbit_circles:
            if math.hypot(x-c['x'], y-c['y']) < (r + c['r'] + 30): hit = True; break
        if not hit: orbit_circles.append({'x':x, 'y':y, 'r':r})
            
    svg.append(f'<mask id="{mask_circles_id}">')
    # 1. Start with black (hidden)
    svg.append(f'<rect width="100%" height="100%" fill="black" />')
    
    # 2. Add White Circles (Visible)
    # Hero circle is static (outside the orbit group)
    svg.append(f'<circle cx="{hero_circle["x"]}" cy="{hero_circle["y"]}" r="{hero_circle["r"]}" fill="white" />')
    
    # Orbiting satellites
    # Added helper class usually accessible via DOM
    svg.append(f'<g class="{group_class} js-orbit-group">')
    for c in orbit_circles:
        svg.append(f'<circle cx="{c["x"]}" cy="{c["y"]}" r="{c["r"]}" fill="white" />')
    svg.append('</g>')
    
    svg.append('</mask>')
    
    svg.append('</defs>')
    
    # --- 3. GENERATE THE ONE GLOBAL MESH ---
    global_triangles = generate_global_mesh(WIDTH, HEIGHT, rng)
    
    # --- 4. RENDER PASS 1: STRIPES (Light Gray) ---
    # We draw the *entire* mesh, but clipped to the stripe shapes.
    
    svg.append(f'<g clip-path="url(#{clip_stripes_id})">')
    for tri in global_triangles:
        color = get_stripe_color(rng)
        pts = " ".join([f"{p[0]:.1f},{p[1]:.1f}" for p in tri['pts']])
        svg.append(f'<polygon points="{pts}" fill="{color}" stroke="{color}" stroke-width="1" stroke-linejoin="round" />')
    svg.append('</g>')
    
    # --- 5. RENDER PASS 2: CIRCLES (Vibrant) ---
    # Draw the exact same mesh, masked by the circles.
    
    svg.append(f'<g mask="url(#{mask_circles_id})">')
    for tri in global_triangles:
        color = get_vibrant_color(tri['cx'], tri['cy'], grad_props, rng)
        pts = " ".join([f"{p[0]:.1f},{p[1]:.1f}" for p in tri['pts']])
        svg.append(f'<polygon points="{pts}" fill="{color}" stroke="{color}" stroke-width="1" stroke-linejoin="round" />')
    svg.append('</g>')
    
    svg.append('</svg>')
    
    with open(filename, 'w') as f:
        f.write("\n".join(svg))
    print(f"Saved {filename}")

if __name__ == "__main__":
    generate_blog_cover(seed=None)