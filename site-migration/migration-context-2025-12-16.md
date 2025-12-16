# DOC Website Migration Context - December 16, 2025

## Project Overview
Cloning the New Zealand Department of Conservation (DOC) website using AEM Edge Delivery Services with a block-based architecture.

## Current Status: Navigation System Complete ✅

### Latest Session Completed (Evening)
Successfully implemented dynamic, content-managed navigation with color theming.

## Navigation System Architecture

### Key Components

1. **Custom HTML File**: `/workspace/nav-custom.html` (also copied to `/workspace/content/nav-custom.html`)
   - Static HTML file with color specifications and HR separators
   - Used instead of dynamically-generated `.plain.html` to work around AEM server transformation issues

2. **Header JavaScript**: `/workspace/blocks/header/header.js`
   - Fetches `nav-custom.html` (with fallback to `nav.plain.html`)
   - Extracts RGB color values from section titles
   - Strips color specifications from displayed text
   - Restructures flat list into subnav/popular sections based on `<hr>` separators

3. **Header CSS**: `/workspace/blocks/header/header.css`
   - Uses CSS custom properties (`--subnav-color`) for dynamic theming
   - Styled subnav links as colored buttons
   - Styled popular links as white bordered buttons
   - Added 14px font size to match original site

### Navigation Structure

Each dropdown has two sections:
- **Subnav Section**: Main navigation links styled as colored buttons
- **Popular Section**: Secondary links styled as white bordered buttons

### Color Scheme (Content-Managed)

Colors specified in `nav-custom.html` format: `Section Name (rgb(r, g, b))`

- **Parks & recreation**: Blue - rgb(21, 121, 183)
- **Nature**: Green - rgb(80, 127, 57)
- **Get involved**: Purple - rgb(76, 54, 87)
- **Our work**: Brown - rgb(128, 51, 26)

### Technical Implementation Details

#### Problem: AEM Server Flattening HTML
The AEM dev server dynamically generates `.plain.html` from `.md` files and transforms/flattens nested structures:
- Removes HR elements from nested lists
- Strips color specifications from text
- Flattens 3-level list nesting to 2 levels

#### Solution: Custom HTML Bypass
1. Created static `nav-custom.html` with exact structure needed
2. Modified header.js to fetch custom file first, fallback to plain.html
3. Used `<li><hr></li>` as separator between subnav and popular links
4. JavaScript detects HR and restructures DOM client-side

#### Color Extraction Logic (header.js:147-175)
```javascript
// The title might be in a <p> tag or as a direct text node
let titleElement = navSection.querySelector('p');
if (titleElement) {
  const text = titleElement.textContent.trim();
  const colorMatch = text.match(/\(rgb\([\d,\s]+\)\)/);
  if (colorMatch) {
    const color = colorMatch[0].slice(1, -1); // Remove outer parentheses
    navSection.style.setProperty('--subnav-color', color);
    titleElement.textContent = text.replace(/\s*\(rgb\([\d,\s]+\)\)/, '');
  }
} else {
  // Check for direct text node (our case)
  for (const node of navSection.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const text = node.textContent.trim();
      const colorMatch = text.match(/\(rgb\([\d,\s]+\)\)/);
      if (colorMatch) {
        const color = colorMatch[0].slice(1, -1);
        navSection.style.setProperty('--subnav-color', color);
        node.textContent = text.replace(/\s*\(rgb\([\d,\s]+\)\)/, '');
      }
      break;
    }
  }
}
```

#### List Restructuring Logic (header.js:177-224)
```javascript
const items = Array.from(subUL.children);
const separatorIndex = items.findIndex(item => item.querySelector('hr'));

if (separatorIndex > 0) {
  // Create two wrapper list items for subnav and popular
  const subnavWrapper = document.createElement('li');
  subnavWrapper.classList.add('nav-subnav-section');
  const subnavUL = document.createElement('ul');

  const popularWrapper = document.createElement('li');
  popularWrapper.classList.add('nav-popular-section');
  const popularHeading = document.createTextNode('Popular');
  const popularUL = document.createElement('ul');

  // Move items before separator to subnav, after to popular
  // Remove separator, rebuild structure
}
```

### CSS Styling Details (header.css:300-366)

**Subnav Section (Colored Buttons)**:
```css
header nav .nav-sections .nav-subnav-section ul li a {
  display: block;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: var(--subnav-color, #2C5234);
  color: white;
  transition: background-color 0.2s;
  text-decoration: none;
}

header nav .nav-sections .nav-subnav-section ul li a:hover {
  background-color: color-mix(in srgb, var(--subnav-color, #2C5234) 80%, black);
  text-decoration: none;
}
```

**Popular Section (White Bordered Buttons)**:
```css
header nav .nav-sections .nav-popular-section ul li a {
  display: block;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  transition: border-color 0.2s, background-color 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
```

## File Structure

```
/workspace/
├── blocks/
│   ├── header/
│   │   ├── header.js (✅ Complete - color extraction, list restructuring)
│   │   └── header.css (✅ Complete - subnav/popular styling, 14px font)
│   ├── footer/
│   │   └── footer.js
│   └── [other blocks...]
├── content/
│   ├── index.md (homepage)
│   ├── nav.md (original markdown - not used due to server flattening)
│   ├── nav-custom.html (✅ Custom HTML with colors and HR separators)
│   ├── footer.md
│   └── images/
│       ├── doc-logo.svg (DOC branding)
│       └── nz-govt-logo.svg (NZ Govt logo)
├── nav-custom.html (✅ Root copy - this is what header.js fetches)
├── styles/
│   └── styles.css
├── migration-work/ (temp files from migration iterations)
└── site-migration/
    └── migration-context-2025-12-16.md (this file)
```

## Git Status - Ready to Commit

### Modified Files:
- `blocks/header/header.js` - Added color extraction, list restructuring, custom HTML fetch
- `blocks/header/header.css` - Added subnav/popular section styling, 14px font size
- `content/nav.md` - Updated with color specs (not actively used)
- `content/nav.html` - Auto-generated

### New Files:
- `nav-custom.html` (root) - ✅ Primary navigation HTML with structure
- `content/nav-custom.html` - Copy in content directory

### Deleted Files:
- `content/nav.plain.html` - Removed to force custom HTML usage

### Untracked (Not committing):
- `migration-work/` - Temporary migration iteration files

## Commit Plan

```bash
# Stage the navigation system files
git add blocks/header/header.js
git add blocks/header/header.css
git add nav-custom.html
git add content/nav-custom.html
git add content/nav.md
git add content/nav.html

# Stage this documentation
git add site-migration/migration-context-2025-12-16.md

# Commit with descriptive message
git commit -m "Implement content-managed navigation with dynamic color theming

- Add color extraction from nav section titles (rgb format)
- Implement two-section dropdown: subnav (colored) + popular (bordered)
- Create nav-custom.html to bypass AEM server HTML flattening
- Add CSS custom properties for per-section color theming
- Split navigation links using HR separator detection
- Update font size to 14px to match original DOC site

Colors managed in content:
- Parks & recreation: Blue rgb(21, 121, 183)
- Nature: Green rgb(80, 127, 57)
- Get involved: Purple rgb(76, 54, 87)
- Our work: Brown rgb(128, 51, 26)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Session Recovery Checklist

When starting next session:

1. ✅ Read this file: `/workspace/site-migration/migration-context-2025-12-16.md`
2. ✅ Check git status: `git status`
3. ✅ Review if commit was made: `git log -1`
4. ✅ Navigate to `http://localhost:3000/content/index.html`
5. ✅ Test navigation dropdowns - verify colors working
6. 📋 Next priorities:
   - Review footer implementation
   - Sync latest content files from original site
   - Continue with other page migrations

## Key Learnings / Technical Notes

### AEM Server Behavior
- Dev server dynamically generates `.plain.html` from `.md` files
- Server transforms/flattens HTML structure on-the-fly
- Nested markdown lists with HR separators get flattened
- Static `.html` files can be served by placing them in root directory
- Server prefers static files over dynamic generation

### Workarounds Implemented
- Use static HTML (`nav-custom.html`) instead of markdown for complex structures
- Client-side JavaScript restructuring for layouts that need nesting
- CSS custom properties for content-managed theming
- Text node manipulation for extracting metadata from content

### Font Specifications
- Original DOC site nav: 14px "Clear Sans" font, 400 weight
- Implemented: 14px size (header.css:23)
- Font family: Using var(--body-font-family)

## Preview Server

Local preview: `http://localhost:3000`
- Homepage: `http://localhost:3000/content/index.html`
- Live reload for CSS/JS changes

## Important Patterns Established

### Content-Managed Styling
Format: `Section Name (rgb(r, g, b))`
- JavaScript extracts RGB values
- Applies as CSS custom property `--subnav-color`
- Strips color spec from displayed text

### HR Separator Pattern
```html
<li><hr></li>
```
- Marks boundary between subnav and popular sections
- JavaScript detects and restructures DOM
- Separator element removed after processing

### CSS Variable Theming
```css
background-color: var(--subnav-color, #2C5234);
```
- Per-section color injection
- Fallback to default green if not set
- Works with color-mix for hover states

## Previous Session Work (Earlier Today)

- Header and footer path configuration
- SVG logo creation (DOC and NZ Government)
- Metadata hiding
- Basic navigation structure
- Homepage content blocks

## Contact Information

- Original site: Department of Conservation New Zealand (doc.govt.nz)
- Migration approach: Block-based AEM Edge Delivery Services
- Content authoring: Hybrid (Markdown + Custom HTML where needed)
