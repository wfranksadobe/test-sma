import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Feature card - single large promotional card with image and content
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const imageCell = row.querySelector('div:first-child');
  const contentCell = row.querySelector('div:last-child');

  // Create container
  const container = document.createElement('div');
  container.className = 'feature-card-container';

  // Add image
  if (imageCell) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'feature-card-image';
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imageDiv.appendChild(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
      }
    }
    container.appendChild(imageDiv);
  }

  // Add content
  if (contentCell) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'feature-card-content';

    // Move all content from contentCell
    while (contentCell.firstChild) {
      contentDiv.appendChild(contentCell.firstChild);
    }

    container.appendChild(contentDiv);
  }

  block.textContent = '';
  block.appendChild(container);
}
