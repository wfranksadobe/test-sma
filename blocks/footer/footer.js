import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  // Simple fragment load without decoration to avoid infinite loops
  const resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load footer:', resp.status);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const fragment = doc.body;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Restructure: wrap Logo, Primary, Secondary in a bottom-row container
  const footerInner = footer.querySelector('.footer');
  if (footerInner) {
    const rows = Array.from(footerInner.children);
    // rows[0] = Social, rows[1] = Logo, rows[2] = Primary, rows[3] = Secondary

    if (rows.length >= 4) {
      const socialRow = rows[0];
      const logoRow = rows[1];
      const primaryRow = rows[2];
      const secondaryRow = rows[3];

      // Add classes for styling
      socialRow.classList.add('footer-social');
      logoRow.classList.add('footer-logo');
      primaryRow.classList.add('footer-primary');
      secondaryRow.classList.add('footer-secondary');

      // Create bottom row container
      const bottomRow = document.createElement('div');
      bottomRow.classList.add('footer-bottom');

      // Create links container for all links
      const linksContainer = document.createElement('div');
      linksContainer.classList.add('footer-links');

      // Get the actual link containers (last child of each row)
      const primaryLinks = primaryRow.querySelector('div:last-child');
      const secondaryLinks = secondaryRow.querySelector('div:last-child');

      // Move all primary links to footer-links
      if (primaryLinks) {
        while (primaryLinks.firstChild) {
          linksContainer.appendChild(primaryLinks.firstChild);
        }
      }

      // Add separator pipe
      const separator = document.createElement('span');
      separator.classList.add('footer-separator');
      separator.textContent = '|';
      linksContainer.appendChild(separator);

      // Move all secondary links to footer-links
      if (secondaryLinks) {
        while (secondaryLinks.firstChild) {
          linksContainer.appendChild(secondaryLinks.firstChild);
        }
      }

      // Move logo and links container into bottom row
      bottomRow.appendChild(logoRow);
      bottomRow.appendChild(linksContainer);

      // Append bottom row after social
      footerInner.appendChild(bottomRow);
    }
  }

  block.append(footer);

  // Fix logo image - remove hardcoded width/height so CSS can control sizing
  const logoImg = block.querySelector('.footer-logo img');
  if (logoImg) {
    logoImg.removeAttribute('width');
    logoImg.removeAttribute('height');
  }
}
