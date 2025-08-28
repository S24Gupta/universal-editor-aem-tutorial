import { renderBlock } from '../../scripts/faintly.js';
import { loadScript, loadCSS } from '../../scripts/aem.js';

export default async function decorate(block) {

  await loadScript('https://code.jquery.com/jquery-2.2.4.min.js');

  let imgSrc;
  if (window.matchMedia("(min-width: 768px)").matches) {
    imgSrc = block.children[6]?.querySelector('img')?.getAttribute('src');
  } else {
    imgSrc = block.children[7]?.querySelector('img')?.getAttribute('src');
  }
  const questionnaireFormPath = block.children[3]?.innerText?.trim();

  await renderBlock(block, {
    headline: block.children[0]?.innerText?.trim(),
    title: block.children[1]?.innerText?.trim(),
    description: block.children[2]?.innerText?.trim(),
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

  $(".start-button").click(function () {
    $(".questionnaire--form").addClass("survey--open");
    populateQuestions(0);
    $(".survey--wrapper").show();
  });

  async function populateQuestions(index) {
    if (questionnaireFormPath) {
      const mappingresp = await fetch('/paths.json');
      const mappingData = await mappingresp.json();
      let mapping = questionnaireFormPath;
      for (const [key, value] of Object.entries(mappingData.mappings)) {
        const [before, after] = value.split(':');
        if (before === questionnaireFormPath) {
          mapping = after;
          break;
        }
      }
      const resp = await fetch(mapping);

      if (resp.ok) {
        const respObj = await resp.json();
        const questions = respObj?.data[index];

        if (questions.Type === 'Radio') {

          const questionCategory = document.querySelector('.questionCategory');
          questionCategory.innerHTML = questions.QuestionCategory;

          const question = document.querySelector('.survey--questions div.slide h3');
          question.innerHTML = questions.Question;

          const selectOptions = document.querySelectorAll('.survey--questions div.slide div.select-options');

          const options = Object.keys(questions)
            .filter(key => key.toLowerCase().startsWith("option"))
            .map(key => questions[key])
            .filter(value => value && value.trim() !== "");

// Loop over each .select-options container
          selectOptions.forEach((container, idx) => {
            // Clear old content
            container.innerHTML = "";

            options.forEach((optionValue, optIndex) => {
              const optionDiv = document.createElement("div");

              const input = document.createElement("input");
              input.type = "radio";
              input.name = `q${idx}`; // use idx so name groups stay separate
              input.value = optionValue;

              const label = document.createElement("label");
              label.innerText = optionValue;

              optionDiv.appendChild(input);
              optionDiv.appendChild(label);
              container.appendChild(optionDiv); // append to container
            });
          });


          /* questions.forEach((question, index) => {
             const questionElement = document.createElement('div');
             questionElement.className = 'question';
             questionElement.innerHTML = `
               <h3>${index + 1}. ${question.questionText}</h3>
               <input type="text" name="answer${index}" placeholder="Your answer" required>
             `;
             questionnaireContainer.appendChild(questionElement);
           });*/
        } else {
          console.error('Failed to fetch questionnaire data:', resp.statusText);
        }
      } else {
        console.error('Questionnaire form path is not defined.');
      }
    }

  }
}
