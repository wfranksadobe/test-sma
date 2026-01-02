export default function decorate(block) {
  // Hero block decoration
  const rows = [...block.children];

  // First row is the image
  // Second row is the heading
  // Third row is the quick links

  // Wrap heading and links in a content container for positioning
  if (rows.length >= 2) {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'hero-content';

    // Add heading
    if (rows[1]) {
      contentWrapper.appendChild(rows[1].cloneNode(true));
      rows[1].remove();
    }

    // Check if there are links (third row with actual link content)
    const hasLinks = rows[2] && rows[2].querySelector('a');

    // Add links if they exist
    if (hasLinks) {
      contentWrapper.appendChild(rows[2].cloneNode(true));
      rows[2].remove();
    } else if (rows[2]) {
      // Remove empty links row
      rows[2].remove();
    }

    // Add class when no links present for styling
    if (!hasLinks) {
      block.classList.add('hero-no-links');
    }

    block.appendChild(contentWrapper);
  }
}
