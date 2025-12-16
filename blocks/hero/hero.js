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

    // Add links
    if (rows[2]) {
      contentWrapper.appendChild(rows[2].cloneNode(true));
      rows[2].remove();
    }

    block.appendChild(contentWrapper);
  }
}
