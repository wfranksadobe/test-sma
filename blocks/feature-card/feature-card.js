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

  // Add content with structured extraction
  if (contentCell) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'feature-card-content';

    // Extract label (first <strong> or <em> tag)
    const firstStrong = contentCell.querySelector('strong, em');
    if (firstStrong) {
      const label = document.createElement('span');
      label.className = 'feature-card-label';
      label.textContent = firstStrong.textContent;
      contentDiv.appendChild(label);
      firstStrong.remove();
    }

    // Extract link (last <a> tag) - will be styled as CTA button
    const links = contentCell.querySelectorAll('a');
    const ctaLink = links.length > 0 ? links[links.length - 1] : null;
    if (ctaLink) {
      ctaLink.classList.add('feature-card-cta');
      // Remove from original position, will append at end
      ctaLink.remove();
    }

    // Move remaining content (description text)
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'feature-card-description';
    while (contentCell.firstChild) {
      descriptionDiv.appendChild(contentCell.firstChild);
    }
    contentDiv.appendChild(descriptionDiv);

    // Append CTA link at the end
    if (ctaLink) {
      contentDiv.appendChild(ctaLink);
    }

    container.appendChild(contentDiv);
  }

  block.textContent = '';
  block.appendChild(container);
}
