import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Feature card - displays promotional card with image, title, and abstract
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Process the first row (feature content)
  const row = rows[0];
  const cells = row.querySelectorAll(':scope > div');
  if (cells.length < 4) return;

  const [imageCell, titleCell, abstractCell, linkCell] = cells;

  // Get link URL from 4th cell
  let cardLink = null;
  if (linkCell) {
    const linkText = linkCell.textContent.trim();
    if (linkText.startsWith('http') || linkText.startsWith('/')) {
      cardLink = linkText;
    } else {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        cardLink = anchor.getAttribute('href');
      }
    }
  }

  // Create card
  const card = document.createElement('div');
  card.className = 'feature-card-card';

  // Add image - full width at top
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
    card.appendChild(imageDiv);
  }

  // Add title - styled like the dark grey heading
  if (titleCell && titleCell.textContent.trim()) {
    const title = document.createElement('h2');
    title.className = 'feature-card-title';
    title.textContent = titleCell.textContent.trim();
    card.appendChild(title);
  }

  // Add abstract
  if (abstractCell && abstractCell.textContent.trim()) {
    const abstract = document.createElement('p');
    abstract.className = 'feature-card-abstract';
    abstract.textContent = abstractCell.textContent.trim();
    card.appendChild(abstract);
  }

  // Wrap card in link if URL provided
  if (cardLink) {
    const linkWrapper = document.createElement('a');
    linkWrapper.href = cardLink;
    linkWrapper.className = 'feature-card-link';
    linkWrapper.appendChild(card);

    block.textContent = '';
    block.appendChild(linkWrapper);
  } else {
    block.textContent = '';
    block.appendChild(card);
  }
}
