import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Blog block - displays blog post with date, title, abstract, image, and link
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = row.querySelectorAll(':scope > div');
  if (cells.length < 5) return;

  const [dateCell, titleCell, abstractCell, imageCell, linkCell] = cells;

  // Create container
  const container = document.createElement('div');
  container.className = 'blog-container';

  // Add heading
  const heading = document.createElement('h2');
  heading.textContent = 'Blog';
  container.appendChild(heading);

  // Create card
  const card = document.createElement('div');
  card.className = 'blog-card';

  // Add date - full width at top
  if (dateCell && dateCell.textContent.trim()) {
    const date = document.createElement('p');
    date.className = 'blog-date';
    date.textContent = dateCell.textContent.trim();
    card.appendChild(date);
  }

  // Add title - full width below date
  if (titleCell && titleCell.textContent.trim()) {
    const title = document.createElement('h3');
    title.className = 'blog-title';
    title.textContent = titleCell.textContent.trim();
    card.appendChild(title);
  }

  // Create wrapper for image and content side by side
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'blog-content-wrapper';

  // Add image
  if (imageCell) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'blog-image';
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imageDiv.appendChild(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
      }
    }
    contentWrapper.appendChild(imageDiv);
  }

  // Add content div with abstract and link
  const contentDiv = document.createElement('div');
  contentDiv.className = 'blog-content';

  // Add abstract
  if (abstractCell && abstractCell.textContent.trim()) {
    const abstract = document.createElement('p');
    abstract.className = 'blog-abstract';
    abstract.textContent = abstractCell.textContent.trim();
    contentDiv.appendChild(abstract);
  }

  // Add link
  if (linkCell) {
    const link = linkCell.querySelector('a');
    if (link) {
      link.classList.add('blog-cta');
      contentDiv.appendChild(link);
    }
  }

  contentWrapper.appendChild(contentDiv);
  card.appendChild(contentWrapper);
  container.appendChild(card);

  block.textContent = '';
  block.appendChild(container);
}
