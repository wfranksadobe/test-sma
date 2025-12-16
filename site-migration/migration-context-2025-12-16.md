# DOC Website Migration Context - December 16, 2025

## Project Overview
Cloning the New Zealand Department of Conservation (DOC) website using AEM Edge Delivery Services with a block-based architecture.

## Current Status: CRITICAL ISSUE - Header/Footer Not Rendering

### Symptoms
- Header and footer blocks exist in DOM but are empty with `data-block-status="loading"`
- Console shows thousands of errors: "failed to load module for header TypeError: Cannot read properties of null"
- `loadFragment()` is returning null despite files being accessible

### Verified Working
- Direct fetch of `/content/nav.plain.html` returns 200 OK with valid content
- Files exist: `/workspace/content/nav.md`, `/workspace/content/nav.plain.html`
- Files exist: `/workspace/content/footer.md` (footer.plain.html likely needed)
- SVG logos created: `/workspace/content/images/doc-logo.svg`, `/workspace/content/images/nz-govt-logo.svg`

## File Structure

```
/workspace/
├── blocks/
│   ├── header/
│   │   └── header.js (modified - points to /content/nav)
│   ├── footer/
│   │   └── footer.js (modified - points to /content/footer)
│   ├── fragment/
│   │   └── fragment.js (contains loadFragment function)
│   └── [other blocks...]
├── content/
│   ├── index.md (homepage with Hero, Feature-Cards, Media releases)
│   ├── nav.md (header content)
│   ├── nav.plain.html (manually created)
│   ├── footer.md (footer content)
│   └── images/
│       ├── doc-logo.svg (DOC branding with koru)
│       └── nz-govt-logo.svg (NZ Govt crown emblem)
├── styles/
│   └── styles.css (modified - added .metadata-wrapper hiding)
└── site-migration/
    └── [this file]
```

## Key Changes Made This Session

### 1. Header and Footer Path Configuration
**blocks/header/header.js:113**
```javascript
const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
```

**blocks/footer/footer.js:11**
```javascript
const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
```

### 2. SVG Logo Files Created

**content/images/doc-logo.svg**
- Black background with DOC logo
- Blue/green koru symbol design
- "Department of Conservation" text
- "Te Papa Atawhai" subtitle

**content/images/nz-govt-logo.svg**
- Crown emblem
- Bilingual text: "Te Kāwanatanga o Aotearoa / New Zealand Government"

### 3. Navigation Content (content/nav.md)
```markdown
| Header |
|---|
| ![Department of Conservation](./images/doc-logo.svg) |
| [Parks & recreation](/parks-and-recreation/) [Nature](/nature/) [Get involved](/get-involved/) [Our work](/our-work/) |
```

### 4. Footer Content (content/footer.md)
```markdown
| Footer |
|---|
| [Facebook](https://www.facebook.com/docgovtnz) [Blog](https://blog.doc.govt.nz/) [Instagram](https://www.instagram.com/docgovtnz/) [Youtube](https://www.youtube.com/docgovtnz) [Other channels](/news/social-media/) |
| ![New Zealand Government](./images/nz-govt-logo.svg) |
| [Careers](/careers/) [News & events](/news/) [About us](/about-us/) [Contact](/footer-links/contact-us/) |
| [Copyright](/footer-links/copyright/) [About this site](/footer-links/about-this-site/) [Privacy & security](/footer-links/privacy-and-security/) [OIA requests](/footer-links/contact-us/making-an-official-information-act-request/) |
```

### 5. Manual Plain HTML Creation
Created `/workspace/content/nav.plain.html` manually because AEM server wasn't auto-generating it.

### 6. Metadata Hiding (styles/styles.css)
```css
/* Hide page metadata block */
main .metadata-wrapper {
  display: none;
}
```

## Git Status (Uncommitted Changes)

### Modified Files:
- `blocks/footer/footer.js` - Changed path from `/footer` to `/content/footer`
- `blocks/header/header.js` - Changed path from `/nav` to `/content/nav`
- `styles/styles.css` - Added metadata-wrapper hiding rule

### Untracked Directories:
- `content/` - All content files including nav, footer, index, images
- `migration-work/` - May contain migration-related files

## How to Commit This Work

```bash
# Add all content files
git add content/

# Add modified block files
git add blocks/header/header.js blocks/footer/footer.js

# Add CSS changes
git add styles/styles.css

# Add migration documentation
git add site-migration/

# Check migration-work directory before adding
git add migration-work/

# Commit everything
git commit -m "Add DOC site header/footer with SVG logos and content structure

- Create navigation and footer content with DOC branding
- Add DOC logo and NZ Government logo SVGs
- Update header/footer blocks to load from /content directory
- Add metadata hiding CSS rule
- Create site-migration documentation folder"

# Push to remote (if configured)
git push origin main
```

## CRITICAL DEBUGGING NEEDED

### Problem: loadFragment() Returns Null

The `blocks/fragment/fragment.js` file contains the `loadFragment()` function. It's returning null, which means either:

1. The fetch is failing (but we verified it returns 200 OK)
2. `decorateMain(main)` is throwing an error
3. `await loadSections(main)` is throwing an error

### Next Debugging Steps:

1. **Add error handling to loadFragment** (blocks/fragment/fragment.js):
```javascript
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    try {
      console.log('[DEBUG] Loading fragment:', path);
      const resp = await fetch(`${path}.plain.html`);
      console.log('[DEBUG] Fetch response:', resp.status, resp.ok);

      if (resp.ok) {
        const main = document.createElement('main');
        const htmlText = await resp.text();
        console.log('[DEBUG] Fragment HTML length:', htmlText.length);
        main.innerHTML = htmlText;

        // reset base path for media to fragment base
        const resetAttributeBase = (tag, attr) => {
          main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
            elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
          });
        };
        resetAttributeBase('img', 'src');
        resetAttributeBase('source', 'srcset');

        console.log('[DEBUG] About to decorateMain');
        decorateMain(main);
        console.log('[DEBUG] About to loadSections');
        await loadSections(main);
        console.log('[DEBUG] Fragment loaded successfully');
        return main;
      }
    } catch (error) {
      console.error('[ERROR] loadFragment failed:', error);
      return null;
    }
  }
  return null;
}
```

2. **Create footer.plain.html** - Footer might need manual plain.html file like nav does

3. **Check browser console** after adding debug logging to see where exactly the failure occurs

## Previous Session Work Completed

- Made card tiles clickable
- Styled "More" buttons
- Created two-column layouts
- Removed visible page metadata from content area
- Created separate header/footer content files
- Set up block structure for homepage (Hero, Feature-Cards, Media releases)

## Preview Server

Local preview runs at `http://localhost:3000`
- Homepage: `http://localhost:3000/content/index.html`
- Uses live reload for CSS/JS changes

## Testing Workflow

1. Make changes to files
2. Navigate to `http://localhost:3000/content/index.html` in browser
3. Check console for errors
4. Use browser DevTools to inspect DOM structure
5. Check Network tab for failed resource loads

## Important Notes

- Server may not auto-generate `.plain.html` files - may need manual creation
- Browser caching can cause issues - hard refresh (Ctrl+Shift+R) often needed
- Fragment paths are relative to site root, not content directory
- Metadata blocks should be hidden with CSS, not removed from markdown

## Session Recovery Checklist

When starting a new session:

1. ✅ Read this file first: `/workspace/site-migration/migration-context-2025-12-16.md`
2. ✅ Check git status: `git status`
3. ✅ Review modified files: `git diff`
4. ✅ Start preview server if not running: `npm run up` or equivalent
5. ✅ Navigate to `http://localhost:3000/content/index.html` to see current state
6. ✅ Check browser console for errors
7. ✅ Priority: Debug why `loadFragment()` returns null for header/footer
8. ✅ Create `/workspace/content/footer.plain.html` manually if needed

## Contact Information

- Original site: Department of Conservation New Zealand
- Migration approach: Block-based AEM Edge Delivery Services
- Content authoring: Document-based (Markdown)
