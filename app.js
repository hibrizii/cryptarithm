import {
  cryptQuiz,
  decryptQuiz,
  displayQuiz,
  generateNumQuiz,
} from "./quizProcess.js";
const dialogOption = document.querySelector(".dialog-option");
const optionsBTn = Array.from(dialogOption.getElementsByTagName("button"));
const mainStage = document.querySelector("main");
const quizStage = document.querySelector(".question");
const answerStage = document.querySelector(".answer");
const submitBtn = document.querySelector("button.submit");
const reloadBtn = document.querySelector(".reload");
const vbFeatureBtn = document.querySelector(".visible-feature");
dialogOption.showModal();
let arrInput = Array.from(answerStage.children);
let isVFAllowed = false;
arrInput.forEach((e, i, arr) => {
  e.children[1].addEventListener("input", (event) => {
    if (i < arr.length - 1 && event.target.value.length == 1) {
      event.target.blur();
      arr[i + 1].children[1].focus();
    }
  });
});

function checkAnswer(userInput, trueAnswer) {
  let isValid = true;
  let inputIndex = 0;
  for (let num in trueAnswer) {
    if (num.toString() != userInput[inputIndex]) isValid = false;

    inputIndex++;
  }
  return isValid;
}

function playTheGame(arithmType) {
  return () => {
    submitBtn.innerText = "SUBMIT";
    mainStage.style.backgroundColor = "#3f2af752";
    isVFAllowed = false;
    vbFeatureBtn.innerHTML = "<i class='fa-solid fa-eye-slash char'></i>";
    const objArrNSet = generateNumQuiz(arithmType);
    const { cryptedQuiz, chars } = cryptQuiz(objArrNSet);
    console.log(cryptedQuiz, chars);
    displayQuiz(cryptedQuiz, arithmType);
    arrInput.forEach((e) => {
      e.children[1].oninput = null;
      e.children[1].value = "";
    });
    let index = 0;
    for (const key in chars) {
      arrInput[index].children[0].innerText = `${chars[key]}:`;
      index++;
    }
    function vbFeature() {
      let tempValue = arrInput.map((e) => e.children[1].value);
      let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, tempValue);
      displayQuiz(decryptedQuiz, arithmType);
    }
    vbFeatureBtn.onclick = () => {
      isVFAllowed = !isVFAllowed;
      if (isVFAllowed) {
        vbFeatureBtn.innerHTML = "<i class='fa-regular fa-eye'></i>";
        vbFeature();
        arrInput.forEach((e) => {
          e.children[1].oninput = vbFeature;
        });
      } else {
        vbFeatureBtn.innerHTML = "<i class='fa-solid fa-eye-slash char'></i>";
        displayQuiz(cryptedQuiz, arithmType);
        arrInput.forEach((e) => {
          e.children[1].oninput = null;
        });
      }
    };
    const submit = submitAnswer(cryptedQuiz, chars, arithmType);
    submitBtn.onclick = submit;
  };
}

function submitAnswer(cryptedQuiz, chars, tipe) {
  return () => {
    let userInput = arrInput.map((e) => e.children[1].value);
    if (!userInput.includes("")) {
      let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, userInput);
      let textNumQuestion = Array.from(quizStage.querySelectorAll("h2 span"));
      let userSubArr = decryptedQuiz.map((e) => parseInt(e));
      let alternate =
        tipe == "sum"
          ? userSubArr[0] + userSubArr[1]
          : userSubArr[0] - userSubArr[1];
      let isTrue = checkAnswer(userInput, chars) || alternate == userSubArr[2];
      if (isTrue) {
        submitBtn.innerText = "Main Lagi";
        submitBtn.onclick = playTheGame(tipe);
        mainStage.style.backgroundColor = "#0080008a";
        displayQuiz(decryptedQuiz, tipe);
      } else {
        textNumQuestion.forEach((e) => (e.style.color = "red"));
      }
    }
  };
}

optionsBTn.forEach((e, i) => {
  const type = i == 0 ? "sum" : "sub";
  const playGame = playTheGame(type);
  e.onclick = () => {
    playGame();
    dialogOption.close();
    reloadBtn.onclick = playGame;
  };
});

document.querySelector(".option").addEventListener("click", () => {
  dialogOption.showModal();
});
