export default function decorate(block) {
  const variant = block.querySelector('[data-aue-prop="bannerVariant"]');
  const bannerVariant = variant?.innerText.trim() || 'lirt';

  const imgEl = block.querySelector('img[data-aue-prop="bannerImage"]');
  const imageUrl = imgEl?.src || block.dataset.bannerImage || '';
  const imageAlt = imgEl?.alt || block.dataset.bannerImageAlt || '';

  const textEl = block.querySelector('[data-aue-prop="text"]');
  const description = textEl?.innerHTML || block.dataset.bannerText || '';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = imageAlt;
  img.className = 'banner-image';

  const textDiv = document.createElement('div');
  textDiv.className = 'banner-text';
  textDiv.innerHTML = description;

  block.textContent = '';
  if (bannerVariant === 'lirt') {
    block.append(img, textDiv);
  } else {
    block.append(textDiv, img);
  }
}
