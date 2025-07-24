import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const bannerVariant = block?.children[2]?.innerText?.trim();

  const imgEl = block.children[0];
  const img = document.createElement('img');
  img.src = imgEl?.querySelector('img')?.getAttribute('src');
  img.alt = imgEl?.querySelector('img')?.getAttribute('alt');
  img.className = 'banner-image';

  const text = block.children[1].innerText.trim();

  const textDiv = document.createElement('div');
  textDiv.className = 'banner-text';
  textDiv.innerHTML = text;

  block.textContent = '';
  if (bannerVariant === 'lirt') {
    block.append(img, textDiv);
  } else {
    block.append(textDiv, img);
  }

  const language = getMetadata('language');
  const placeholders = await fetchPlaceholders(language);
  const { name } = placeholders;

  const placeholderDiv = document.createElement('p');
  placeholderDiv.className = 'placeholder-text';
  placeholderDiv.innerHTML = `<p>${name}</p>`;

  textDiv.appendChild(placeholderDiv);
}
