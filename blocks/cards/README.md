# Cards Block - Configuration Guide

## Overview
The Cards block displays content in a responsive grid layout. You can control the number of columns, rows, and container width.

---

## 1. Controlling Number of Columns

Use **block variants** in your markdown to specify column count. The variant name goes in parentheses after the block name.

### Default (4 columns on desktop)
```markdown
| Cards |  |
| --- | --- |
| ![Image](./image.jpg) | **Title**<br><br>Description<br><br>[Link](/path) |
| ![Image](./image.jpg) | **Title**<br><br>Description<br><br>[Link](/path) |
```

### 2-Column Layout
```markdown
| Cards (2-columns) |  |
| --- | --- |
| ![Image](./image.jpg) | **Title**<br><br>Description<br><br>[Link](/path) |
| ![Image](./image.jpg) | **Title**<br><br>Description<br><br>[Link](/path) |
```

### 3-Column Layout (to add this variant)
```markdown
| Cards (3-columns) |  |
| --- | --- |
| ![Image](./image.jpg) | **Title**<br><br>Description<br><br>[Link](/path) |
```

To add a 3-column variant, add this to `cards.css`:

```css
/* 3-columns variant */
.cards.3-columns > ul {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (width >= 768px) {
  .cards.3-columns > ul {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1024px) {
  .cards.3-columns > ul {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 2. Controlling Number of Rows

The number of rows is determined by **how many card items you add** to the markdown table. Each table row becomes one card.

### Example: 2 columns × 4 cards = 2 rows
```markdown
| Cards (2-columns) |  |
| --- | --- |
| ![Card 1](./image1.jpg) | **Title 1**<br><br>Content 1<br><br>[Link](/path) |
| ![Card 2](./image2.jpg) | **Title 2**<br><br>Content 2<br><br>[Link](/path) |
| ![Card 3](./image3.jpg) | **Title 3**<br><br>Content 3<br><br>[Link](/path) |
| ![Card 4](./image4.jpg) | **Title 4**<br><br>Content 4<br><br>[Link](/path) |
```

This displays as:
- **Row 1:** Card 1, Card 2
- **Row 2:** Card 3, Card 4

### Example: 2 columns × 6 cards = 3 rows
Just add more table rows! Each `| image | content |` line creates one card.

---

## 3. Controlling Container Width (50% width)

### Option A: Side-by-Side Layout (Recommended)

To make two Cards blocks sit side-by-side (each taking 50% width on desktop):

1. **Remove the `---` separator** between the two Cards blocks
2. **Add section metadata** at the end with `Style: two-column-layout`

```markdown
---

| Cards (2-columns) |  |
| --- | --- |
| ![Featured 1](./image.jpg) | **Featured Item 1**<br><br>Description<br><br>[Link](/path) |
| ![Featured 2](./image.jpg) | **Featured Item 2**<br><br>Description<br><br>[Link](/path) |

[More](/more-link/)

| Cards (2-columns) |  |
| --- | --- |
| ![Media 1](./image.jpg) | **Media Release 1**<br><br>Description<br><br>[Link](/path) |
| ![Media 2](./image.jpg) | **Media Release 2**<br><br>Description<br><br>[Link](/path) |

[More](/media-link/)

---
| Section Metadata |  |
| --- | --- |
| Style | two-column-layout |
---
```

**Key Points:**
- No `---` between the two Cards blocks = they're in the same section
- Section metadata with `Style: two-column-layout` = side-by-side layout
- On mobile, blocks stack vertically
- On desktop (≥900px), blocks appear side-by-side at 50% width each

### Option B: Full-Width Layout (Default)

To keep Cards blocks full-width (stacked vertically):

```markdown
---

| Cards (2-columns) |  |
| --- | --- |
| ![Card](./image.jpg) | Content |

---

| Cards (2-columns) |  |
| --- | --- |
| ![Card](./image.jpg) | Content |

---
```

Each Cards block is in its own section (`---` separators) = full width, stacked vertically.

---

## 4. Complete Example: DOC Website Layout

Here's how to recreate the DOC website's Featured/Media layout (50% width each):

```markdown
---

| Cards (2-columns) |  |
| --- | --- |
| ![New marine protections](./images/marine.jpg) | **Featured**<br><br>**New marine protections in the Hauraki Gulf/Tīkapa Moana**<br><br>Conservation action is supporting and restoring the waters, sea life and ecosystem of the Hauraki Gulf/Tīkapa Moana.<br><br>[Learn more](/our-work/revitalising-the-gulf/new-marine-protections-in-the-hauraki-gulf/) |
| ![Volunteer for conservation](./images/volunteer.jpg) | **Volunteer for conservation**<br><br>Get involved in volunteer activities around the country.<br><br>[Learn more](/get-involved/volunteer/) |
| ![Donate to nature](./images/donate.jpg) | **Donate to nature**<br><br>New Zealand's special wildlife and ecosystems are facing serious threats, and more action is needed to save it.<br><br>[Learn more](/get-involved/donate-to-nature/) |
| ![Do your bit for nature](./images/bit.jpg) | **Do your bit for nature**<br><br>Discover small ways you can make a big difference for nature.<br><br>[Learn more](/always-be-naturing/do-your-bit-for-nature/) |

[More](/footer-links/new-on-the-site/)

| Cards (2-columns) |  |
| --- | --- |
| ![Aoraki swing bridge](./images/aoraki.jpg) | **Media releases**<br><br>**DOC reveals first pictures of massive new Aoraki/Mount Cook swing bridge**<br><br>Touted as the longest in New Zealand, the new swing bridge being built in Aoraki/Mount Cook National Park has been giving everyone a bit of a headache.<br><br>[Read more](/news/media-releases/2025-media-releases/doc-reveals-first-pictures-of-massive-new-aorakimount-cook-swing-bridge/) |
| ![Fur seals study](./images/seals.jpg) | **Study to reveal the secret lives of fur seals at sea**<br><br>Researchers were in Kaikōura last week to learn more about the behaviour of kekeno/New Zealand fur seals at sea.<br><br>[Read more](/news/media-releases/2025-media-releases/study-to-reveal-the-secret-lives-of-fur-seals-at-sea/) |
| ![Marine reserve decisions](./images/marine-reserve.jpg) | **DOC welcomes resolution of judicial review of marine reserve decisions**<br><br>DOC welcomes the resolution of the judicial review of decisions for six new marine reserves on the southeast South Island, confirmed by the High Court on Friday.<br><br>[Read more](/news/media-releases/2025-media-releases/doc-welcomes-resolution-of-judicial-review-of-marine-reserve-decisions/) |
| ![Whites Bay reopening](./images/whites-bay.png) | **Pukatea/Whites Bay reopening for Christmas**<br><br>The popular Pukatea/Whites Bay site will reopen to the public at midday on December 22 – just in time for Christmas – after extensive storm damage repairs.<br><br>[Read more](/news/media-releases/2025-media-releases/pukateawhites-bay-reopening-for-christmas/) |

[More](/news/media-releases/2025-media-releases/)

---
| Section Metadata |  |
| --- | --- |
| Style | two-column-layout |
---
```

---

## 5. Card Content Structure

Each card row has three columns:
1. **Column 1:** Image (use `![Alt text](./path/to/image.jpg)`)
2. **Column 2:** Content (use `<br><br>` for line breaks)
3. **Column 3:** Card link (the entire card becomes clickable)

### Content Format:
```markdown
| ![Alt](./image.jpg) | **Category Label**<br><br>**Main Heading**<br><br>Body text description. | [/path/to/page/](/path/to/page/) |
```

**Important:** The third column makes the entire card clickable. Do NOT include "Learn more" or "Read more" links in the content (column 2) - just put the URL in column 3.

### Example:
```markdown
| ![Marine life](./marine.jpg) | **Featured**<br><br>**Protecting Marine Life**<br><br>New initiatives to protect our oceans and marine ecosystems. | [/marine-protection/](/marine-protection/) |
```

This renders as:
- **FEATURED** (uppercase label)
- **Protecting Marine Life** (heading)
- Body text
- The entire card is clickable and links to `/marine-protection/`

---

## 6. Summary of Available Variants

| Variant | Mobile | Tablet (≥768px) | Desktop (≥1024px) |
|---------|--------|-----------------|-------------------|
| Default | 1 column | auto-fill (responsive) | 4 columns |
| `(2-columns)` | 1 column | 2 columns | 2 columns |
| `(3-columns)*` | 1 column | 3 columns | 3 columns |

*Need to add CSS for 3-columns variant (see section 1)

---

## 7. Styling Customization

### Card Appearance
- **Box shadow:** Defined in `cards.css` lines 13-14
- **Hover effect:** Defined in `cards.css` lines 18-20
- **Image aspect ratio:** `16:9` (line 69)
- **Gap between cards:** `24px` (line 7)

### Typography
- **Category labels:** Uppercase, smaller font, dark gray
- **Card headings:** Uses `--heading-font-size-s` from global styles
- **Body text:** Standard body font size
- **Links:** Blue color with underline on hover

---

## 8. File References

- **Block CSS:** `/workspace/blocks/cards/cards.css`
- **Block JS:** `/workspace/blocks/cards/cards.js`
- **Global styles:** `/workspace/styles/styles.css` (contains `.two-column-layout`)

---

## 9. Common Use Cases

### Use Case 1: Four equal-width cards
```markdown
| Cards |  |
| --- | --- |
| card 1... |
| card 2... |
| card 3... |
| card 4... |
```

### Use Case 2: Two columns of cards (Featured/Media layout)
```markdown
| Cards (2-columns) |  |
| --- | --- |
| card 1... |
| card 2... |
| card 3... |
| card 4... |
```

### Use Case 3: Side-by-side sections (50% width each)
See Section 4 for complete example.

---

## 10. Troubleshooting

### Cards not displaying in grid
- ✅ Check that you have `| --- | --- |` (TWO column separators)
- ✅ Check that block name has empty second column: `| Cards (2-columns) |  |`
- ✅ Ensure blocks are separated by `---` section dividers

### Side-by-side layout not working
- ✅ Remove `---` between the two Cards blocks
- ✅ Add Section Metadata with `Style: two-column-layout` at the end
- ✅ Check viewport width (layout only applies ≥900px)

### Images not showing
- ✅ Verify image paths are correct (relative to markdown file)
- ✅ Check image files exist in the specified location
- ✅ Use `![Alt text](./images/filename.jpg)` format

---

## Need Help?

- Review the complete example in Section 4
- Check existing cards in `/workspace/content/index.md`
- Refer to AEM Edge Delivery Services documentation for block authoring
