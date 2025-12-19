import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Blog block - displays blog post with date, title, abstract, image, and link
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Check if there's a second row with a footer link
  let footerLink = null;
  if (rows.length > 1) {
    const secondRow = rows[1];
    const secondRowCells = secondRow.querySelectorAll(':scope > div');
    // Footer link row has a link in the first cell, rest are empty
    if (secondRowCells.length >= 1) {
      const firstCell = secondRowCells[0];
      const link = firstCell.querySelector('a');
      // Check if first cell has a link and no picture (not a blog card row)
      if (link && !firstCell.querySelector('picture')) {
        footerLink = link.cloneNode(true);
      }
    }
  }

  // Process the first row (blog content)
  const row = rows[0];
  const cells = row.querySelectorAll(':scope > div');
  if (cells.length < 5) return;

  const [dateCell, titleCell, abstractCell, imageCell, linkCell] = cells;

  // Add heading directly to block
  const heading = document.createElement('h2');
  heading.textContent = 'Blog';

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

  // Add content div with abstract
  const contentDiv = document.createElement('div');
  contentDiv.className = 'blog-content';

  // Add abstract
  if (abstractCell && abstractCell.textContent.trim()) {
    const abstract = document.createElement('p');
    abstract.className = 'blog-abstract';
    abstract.textContent = abstractCell.textContent.trim();
    contentDiv.appendChild(abstract);
  }

  contentWrapper.appendChild(contentDiv);
  card.appendChild(contentWrapper);

  // Get the link URL
  let blogUrl = '#';
  if (linkCell) {
    const linkText = linkCell.textContent.trim();
    // Check if it's a URL (starts with http or /)
    if (linkText.startsWith('http') || linkText.startsWith('/')) {
      blogUrl = linkText;
    } else {
      // Try to find an anchor tag
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        blogUrl = anchor.getAttribute('href') || '#';
      }
    }
  }

  // Wrap the entire card in a link
  const cardLink = document.createElement('a');
  cardLink.href = blogUrl;
  cardLink.className = 'blog-card-link';
  cardLink.appendChild(card);

  block.textContent = '';
  block.appendChild(heading);
  block.appendChild(cardLink);

  // Add footer link if present
  if (footerLink) {
    const footer = document.createElement('div');
    footer.className = 'blog-footer';
    footer.appendChild(footerLink);
    block.appendChild(footer);
  }
}
