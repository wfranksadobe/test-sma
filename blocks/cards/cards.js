import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  let footerLink = null;

  [...block.children].forEach((row, index) => {
    const columns = [...row.children];

    // Check if this row is a footer link
    // Footer link: has button-container but NO image (picture element)
    // Regular card row: has image + content + link in third column
    const hasButtonContainer = row.querySelector('.button-container');
    const hasImage = row.querySelector('picture');
    const link = hasButtonContainer ? hasButtonContainer.querySelector('a') : null;

    if (hasButtonContainer && link && !hasImage) {
      // This is a footer link row - store it and skip adding to cards
      footerLink = link.cloneNode(true);
      return;
    }

    const li = document.createElement('li');

    // Extract card link if present (third column)
    let cardLink = null;
    if (columns.length >= 3) {
      const linkColumn = columns[2];
      const link = linkColumn.querySelector('a');
      if (link) {
        cardLink = link.href;
      }
    }

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, index) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else if (index < 2) div.className = 'cards-card-body'; // Only first two columns
      else div.remove(); // Remove third column (link column)
    });

    // If we found a card link, wrap the entire card content in an anchor
    if (cardLink) {
      const anchor = document.createElement('a');
      anchor.href = cardLink;
      anchor.className = 'cards-card-link';
      // Move all li children into the anchor
      while (li.firstElementChild) {
        anchor.append(li.firstElementChild);
      }
      li.append(anchor);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);

  // If we found a footer link, add it after the cards list
  if (footerLink) {
    const footer = document.createElement('div');
    footer.className = 'cards-footer';
    footer.append(footerLink);
    block.append(footer);
  }
}
