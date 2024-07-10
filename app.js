import { cryptQuiz, decryptQuiz, displayQuiz } from "./quizProcess.js";
const quizStage = document.querySelector(".question");
const answerStage = document.querySelector(".answer");
const submitBtn = document.querySelector("button.submit");
const arrInput = Array.from(answerStage.children);
function checkAnswer(userInput, trueAnswer) {
  let isValid = true;
  let inputIndex = 0;
  for (let num in trueAnswer) {
    if (num.toString() != userInput[inputIndex]) isValid = false;

    inputIndex++;
  }
  return isValid;
}

function playGame() {
  const { cryptedQuiz, chars } = cryptQuiz();
  let index = 0;
  for (const key in chars) {
    arrInput[index].children[0].innerText = `${chars[key]}:`;
    console.log(arrInput[index].children[0]);
    index++;
  }

  arrInput.forEach((e, i, arr) => {
    e.children[1].addEventListener("input", (event) => {
      if (i <= arr.length - 2 && event.target.value.length == 1) {
        event.target.blur();
        arr[i + 1].children[1].focus();
        console.log(event.target.value);
      }
    });
  });
  submitBtn.addEventListener("click", () => {
    let userInput = arrInput.map((e) => e.children[1].value);
    if (!userInput.includes("")) {
      let textNumQuestion = Array.from(quizStage.querySelectorAll("h2 span"));
      let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, userInput);
      let alternateAnswer =
        parseInt(decryptedQuiz[0]) + parseInt(decryptedQuiz[1]) ==
        parseInt(decryptedQuiz[2]);
      let isTrue = checkAnswer(userInput, chars) || alternateAnswer;
      if (isTrue) {
        displayQuiz(decryptedQuiz);
        textNumQuestion.forEach((e) => (e.style.color = "blue"));
      } else {
        textNumQuestion.forEach((e) => (e.style.color = "red"));
      }
    }
  });
}

playGame();
