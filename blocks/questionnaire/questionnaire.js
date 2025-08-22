import { renderBlock } from '../../scripts/faintly.js';
import { loadScript, loadCSS } from '../../scripts/aem.js';

export default async function decorate(block) {

  await loadScript('https://code.jquery.com/jquery-2.2.4.min.js');
  loadCSS('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
  let imgSrc;
  if (window.matchMedia("(min-width: 768px)").matches) {
    imgSrc = block.children[6]?.querySelector('img')?.getAttribute('src');
  } else {
    imgSrc = block.children[7]?.querySelector('img')?.getAttribute('src');
  }
  await renderBlock(block,{
    headline: block.children[0]?.innerText?.trim(),
    title: block.children[1]?.innerText?.trim(),
    description: block.children[2]?.innerText?.trim(),
   // question: block.children[2]?.innerText?.trim(),
   // options: Array.from(block.children[3]?.children || []).map(option => option.innerText.trim()),
    submitText: block.children[4]?.innerText?.trim(),
    footer: block.children[5]?.innerText?.trim(),

  });

  setBackgroundImage();

  function setBackgroundImage() {
    const bgElement = document.querySelector(".questionnaire--form .questionnaire--bg");
    if (imgSrc) {
      bgElement.style.backgroundImage = `url('${imgSrc}')`;
    }
  }

  $(".start-button").click(function() {
    $(".questionnaire--form").addClass("survey--open");
    $(".survey--wrapper").show();

  });
}
