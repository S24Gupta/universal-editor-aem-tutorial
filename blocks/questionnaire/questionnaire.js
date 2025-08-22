import { renderBlock } from '../../scripts/faintly.js';

export default async function decorate(block) {
  await renderBlock(block,{
    title: block.children[0]?.innerText?.trim(),
    description: block.children[1]?.innerText?.trim(),
    question: block.children[2]?.innerText?.trim(),
    options: Array.from(block.children[3]?.children || []).map(option => option.innerText.trim()),
    submitText: block.children[4]?.innerText?.trim(),
    test: (context) => context.title && context.description && context.question && context.options.length > 0,
  });
}
