import requests
from bs4 import BeautifulSoup
import json
import re
import os

def parse_old_cbcl():
    filename = "old_cbcl.html"
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

    soup = BeautifulSoup(content, 'html.parser')
    publications = []
    
    current_year = ""
    
    content_div = soup.find('div', class_='entry-content') or soup.find('div', class_='field-item') or soup.body
    
    if not content_div:
        return []

    for element in content_div.find_all(['p', 'h3', 'h4', 'div']): 
        text = element.get_text().strip()
        
        if re.match(r'^\d{4}:?$', text):
            current_year = text.replace(':', '').strip()
            continue
            
        if not current_year:
            continue
            
        links = element.find_all('a')
        if not links:
            continue
            
        paper_link = links[0].get('href')
        title = links[0].get_text().strip()
        
        full_text = element.get_text()
        
        if title in full_text:
            parts = full_text.split(title, 1)
            authors = parts[0].strip().rstrip('.,[]')
            venue_info = parts[1].strip() if len(parts) > 1 else ""
        else:
            authors = "Unknown"
            venue_info = full_text
            
        authors = re.sub(r'^\d+\.?\s*', '', authors).strip()
        
        pub = {
            "title": title,
            "authors": authors,
            "venue": venue_info.strip(' .,'),
            "year": current_year,
            "link": paper_link
        }
        publications.append(pub)
        
    return publications

def parse_cbmm_page(page_num):
    filename = f"cbmm_page_{page_num}.html"
    if not os.path.exists(filename):
        print(f"File {filename} not found.")
        return []
        
    print(f"Parsing {filename}...")
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

    soup = BeautifulSoup(content, 'html.parser')
    publications = []
    
    # Logic: find 'biblio-entry' divs
    
    entries = soup.find_all('div', class_='biblio-entry')
    
    for entry in entries:
        try:
            # Title
            title_elem = entry.find(class_='biblio-title')
            title = title_elem.get_text().strip() if title_elem else "Unknown Title"
            
            # Link - check for PDF first, otherwise title link
            pdf_span = entry.find(class_='biblio_file_links')
            link = ""
            if pdf_span:
                pdf_link = pdf_span.find('a', href=True)
                if pdf_link:
                    link = pdf_link['href']
            
            if not link:
                title_link = entry.find('a', href=True)
                if title_link:
                    link = title_link['href']
            
            if link and not link.startswith('http'):
                link = "https://cbmm.mit.edu" + link

            # Check for "at < url >" or "arXiv:..." if no PDF link found or as alternative
            # Using regex on the full text of the entry (before decomposition)
            # Re-read full text since we are iterating
            full_text_for_link = entry.get_text(" ", strip=True)
            
            # Prefer PDF links. If link is already a PDF (ends with .pdf), keep it.
            # If not a PDF, or if it's a wrapper page, look for external links.
            is_pdf = link.lower().endswith('.pdf')
            
            if not is_pdf: 
               # Look for arxiv link
               arxiv_match = re.search(r'(?:at\s*<|arXiv:)\s*(https?://arxiv\.org/abs/[\d\.]+)', full_text_for_link)
               if arxiv_match:
                   link = arxiv_match.group(1)
               else:
                   # Look for general url in brackets < >
                   url_match = re.search(r'<\s*(https?://[^>]+)\s*>', full_text_for_link)
                   if url_match:
                       link = url_match.group(1)

            # Authors
            authors_elem = entry.find(class_='biblio-authors')
            if authors_elem:
                authors = authors_elem.get_text().strip()
                # Clean up multiple spaces/newlines
                authors = re.sub(r'\s+', ' ', authors)
            else:
                authors = "Unknown"
            
            # Remove unwanted elements before getting text (copying first to avoid destroying original if needed, 
            # but here we can modify entry since we extracted info already)
            
            # Decompose file links, Z3988 (citation), and extracted title/authors
            # This ensures they don't appear in the venue text
            for elem in entry.find_all(class_=['biblio_file_links', 'Z3988']):
                elem.decompose()
                
            # We can also decompose title and authors to ensure they are definitely gone from text
            if title_elem:
                # Note: title might be inside an 'a' tag which might be separate or inside
                # Usually title_elem is the span.biblio-title.
                title_elem.decompose()
            
            if authors_elem:
                authors_elem.decompose()
                
            # Venue & Year from text
            # The text inside biblio-entry but outside spans usually contains venue and year
            full_text = entry.get_text(" ", strip=True)
            
            # Year extraction
            year = ""
            # Check context: parent 'biblio-category-section' -> 'biblio-separator-bar'
            section = entry.find_parent(class_='biblio-category-section')
            if section:
                sep = section.find(class_='biblio-separator-bar')
                if sep:
                    year = sep.get_text().strip()
            
            if not year:
                # Fallback to regex in entry text
                match = re.search(r'\((\d{4})\)', full_text)
                if match:
                    year = match.group(1)
                else:
                    match = re.search(r'\b(19|20)\d{2}\b', full_text)
                    if match:
                        year = match.group(0)

            # Venue extraction
            # Try to subtract known parts from full text? Or just take what looks like venue.
            # Usually: Authors Title. Venue. (Year).
            # Easier: Just use "CBMM Publication" if parsing fails, or try to get everything between title end and year.
            
            venue = "CBMM Publication"
            # Attempt to extract venue
            # Remove title and authors from text
            temp_text = full_text.replace(title, "").replace(authors, "")
            # Remove "(Year)"
            if year:
                temp_text = temp_text.replace(f"({year})", "").replace(year, "")
            
            # Clean up
            temp_text = re.sub(r'\s+', ' ', temp_text).strip(' .,')
            
            # Remove "at < url >" from venue text if present
            temp_text = re.sub(r'(?:at\s*<|arXiv:)\s*https?://[^>]+>?', '', temp_text).strip(' .,<')
            
            if len(temp_text) > 2: # reasonable length
                 venue = temp_text

            pub = {
                "title": title,
                "authors": authors,
                "venue": venue, 
                "year": year,
                "link": link
            }
            publications.append(pub)
            
        except Exception as e:
            print(f"Error parsing entry: {e}")
            continue

    return publications

def main():
    all_pubs = []
    
    print("Parsing Old CBCL...")
    old_pubs = parse_old_cbcl()
    print(f"Found {len(old_pubs)} from Old CBCL")
    all_pubs.extend(old_pubs)
    
    print("Parsing CBMM pages...")
    for i in range(8): 
        pubs = parse_cbmm_page(i)
        print(f"Found {len(pubs)} on page {i}")
        all_pubs.extend(pubs)
        
    print(f"Total publications: {len(all_pubs)}")
    
    unique_pubs = list({p['title']: p for p in all_pubs}.values())
    
    # Sort by year descending. Handle empty years.
    def get_year(p):
        y = p['year']
        try:
            # Handle "In Press" or other non-digits if present, otherwise assume int
            return int(re.search(r'\d{4}', str(y)).group(0))
        except:
            return 0
            
    sorted_pubs = sorted(unique_pubs, key=get_year, reverse=True)
    
    with open('app/data/publications.json', 'w') as f:
        json.dump(sorted_pubs, f, indent=2)
        
if __name__ == "__main__":
    main()
