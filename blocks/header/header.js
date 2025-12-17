import { getMetadata } from '../../scripts/aem.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  const selector = '.nav-sections .default-content-wrapper > ul > li, .nav-sections > ul > li';
  sections.querySelectorAll(selector).forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  // Simple fragment load without decoration to avoid infinite loops
  // Add cache busting for development
  const cacheBuster = window.location.hostname === 'localhost' ? `?t=${Date.now()}` : '';
  // Try custom nav file first (for development), fallback to plain.html
  let resp = await fetch(`${navPath}-custom.html${cacheBuster}`);
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html${cacheBuster}`);
  }
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load nav:', resp.status);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const fragment = doc.body;

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Simple structure - just add basic classes if children exist
  if (nav.children[0]) nav.children[0].classList.add('nav-brand');
  if (nav.children[1]) nav.children[1].classList.add('nav-sections');
  if (nav.children[2]) nav.children[2].classList.add('nav-tools');

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Look for nav items either in default-content-wrapper or directly in nav-sections
    const selector = ':scope .default-content-wrapper > ul > li, :scope > ul > li';
    navSections.querySelectorAll(selector).forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');

        // Find the primary link (either an <a> tag or need to extract from nav.md structure)
        // When a list item has nested lists, markdown wraps the content in a <p> tag
        // We need to find the href from the original markdown and apply it
        let primaryLink = navSection.querySelector(':scope > a');
        const firstP = navSection.querySelector(':scope > p');

        // If we have a <p> tag but no direct <a> child, we need to extract the link info
        // The link should be in the nav.md as [Text](/url/) but markdown processing
        // with nested lists results in just <p>Text</p>
        // Solution: Store the info and create link after HR processing
        if (!primaryLink && firstP) {
          // Get the text and look for color code
          const text = firstP.textContent.trim();
          const colorMatch = text.match(/\(rgb\([\d,\s]+\)\)/);
          let linkText = text;

          if (colorMatch) {
            const color = colorMatch[0].slice(1, -1); // Remove outer parentheses
            navSection.style.setProperty('--subnav-color', color);
            linkText = text.replace(/\s*\(rgb\([\d,\s]+\)\)/, '');
          }

          // Store reference to paragraph and text for processing after HR separator restructuring
          navSection.dataset.needsLink = 'true';
          navSection.dataset.linkText = linkText.trim();
          firstP.textContent = linkText.trim();
        } else if (primaryLink) {
          // We have a direct link, just extract color code from adjacent text
          for (const node of navSection.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent.trim();
              const colorMatch = text.match(/\(rgb\([\d,\s]+\)\)/);
              if (colorMatch) {
                const color = colorMatch[0].slice(1, -1);
                navSection.style.setProperty('--subnav-color', color);
                node.textContent = node.textContent.replace(/\s*\(rgb\([\d,\s]+\)\)/, '');
                break;
              }
            }
          }
        }

        // Split links into subnav and popular sections based on HR separator
        // First, merge all direct child ULs into one (markdown creates separate ULs around HR)
        const allULs = Array.from(navSection.querySelectorAll(':scope > ul'));
        const hr = navSection.querySelector(':scope > hr');

        if (allULs.length > 1 && hr) {
          // Merge all ULs into the first one
          const firstUL = allULs[0];
          for (let i = 1; i < allULs.length; i++) {
            // Add HR as a marker in the list
            if (i === 1) {
              const hrItem = document.createElement('li');
              hrItem.appendChild(document.createElement('hr'));
              firstUL.appendChild(hrItem);
            }
            // Move all children from subsequent ULs to first UL
            while (allULs[i].firstChild) {
              firstUL.appendChild(allULs[i].firstChild);
            }
            allULs[i].remove();
          }
          hr.remove();
        }

        const subUL = navSection.querySelector(':scope > ul');
        if (subUL) {
          const items = Array.from(subUL.children);
          const separatorIndex = items.findIndex(item => item.querySelector('hr'));

          if (separatorIndex > 0) {
            // Create two wrapper list items for subnav and popular
            const subnavWrapper = document.createElement('li');
            subnavWrapper.classList.add('nav-subnav-section');
            const subnavUL = document.createElement('ul');

            const popularWrapper = document.createElement('li');
            popularWrapper.classList.add('nav-popular-section');
            const popularHeading = document.createElement('p');
            popularHeading.textContent = 'Popular';
            const popularUL = document.createElement('ul');

            // Move items before separator to subnav
            for (let i = 0; i < separatorIndex; i++) {
              subnavUL.appendChild(items[i]);
            }

            // Remove the separator item
            items[separatorIndex].remove();

            // Move items after separator to popular
            for (let i = separatorIndex + 1; i < items.length; i++) {
              popularUL.appendChild(items[i]);
            }

            subnavWrapper.appendChild(subnavUL);
            popularWrapper.appendChild(popularHeading);
            popularWrapper.appendChild(popularUL);

            // Clear and rebuild the list
            subUL.innerHTML = '';
            subUL.appendChild(subnavWrapper);
            subUL.appendChild(popularWrapper);
          } else {
            // No separator, treat all as subnav
            const subnavWrapper = document.createElement('li');
            subnavWrapper.classList.add('nav-subnav-section');
            const subnavUL = document.createElement('ul');
            items.forEach(item => subnavUL.appendChild(item));
            subnavWrapper.appendChild(subnavUL);
            subUL.innerHTML = '';
            subUL.appendChild(subnavWrapper);
          }
        }

        // Now create primary link if needed (after HR processing is complete)
        if (navSection.dataset.needsLink === 'true') {
          const linkText = navSection.dataset.linkText;
          const firstP = navSection.querySelector(':scope > p');

          // Find the first subnav link after restructuring
          const firstSubLink = navSection.querySelector(':scope > ul a');
          if (firstSubLink && firstP) {
            const subHref = firstSubLink.getAttribute('href');
            // Extract parent path (e.g., /parks-and-recreation/places-to-go/ -> /parks-and-recreation/)
            const pathParts = subHref.split('/').filter(p => p); // Remove empty strings
            const parentPath = pathParts.length > 0 ? '/' + pathParts[0] + '/' : '/';

            // Create anchor tag and replace the <p>
            const anchor = document.createElement('a');
            anchor.href = parentPath;
            anchor.textContent = linkText;
            firstP.replaceWith(anchor);
          }

          delete navSection.dataset.needsLink;
          delete navSection.dataset.linkText;
        }
      }
      // Desktop: open on hover
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', 'true');
        }
      });

      // Mobile: open on click (but not if clicking a link)
      navSection.addEventListener('click', (e) => {
        // Check if click target is a link or inside a link
        const clickedLink = e.target.closest('a');
        const isDirectChildLink = clickedLink && clickedLink.parentElement === navSection;

        if (!isDesktop.matches) {
          // On mobile, if clicking the primary link (direct child), allow navigation
          if (!isDirectChildLink) {
            e.preventDefault();
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        } else if (isDirectChildLink) {
          // On desktop, allow primary link clicks to navigate (don't expand dropdown)
          // The hover will handle the dropdown
          return;
        }
      });
    });

    // Close dropdown when mouse leaves nav
    nav.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        toggleAllNavSections(navSections, false);
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  if (navSections) {
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  }
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  if (navSections) {
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
