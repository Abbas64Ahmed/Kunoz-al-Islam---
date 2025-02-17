let category = document.querySelector(".header .category span");
let questionsCount = document.querySelector(".header .count span");
let theQuestion = document.querySelector(".quiz-box .the-question");
let theAnswers = document.querySelector(".quiz-box .the-answers");
let theBtn = document.querySelector(".quiz-box .submit-btn");
let theProgDots = document.querySelector(".footer .the-prog-dots");
let theTimer = document.querySelector(".footer .timer");

let theRightAnswers = 0;
let theWrongAnswers = 0;
let theCurrentQuestion = 0;

let numberOfQuestion = 10;
questionsCount.innerHTML = numberOfQuestion;


fetch("questions_islam.json") // URL of the API
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse the JSON response
  })
  .then((data) => {
    console.log(data); // Handle the data from the API
    // console.log(data.questions[0].question);  // test using obj
    // console.log(data.questions.length);  // test using obj

    // select random 10 questions
    let emptyArr = new Array(data.questions.length).fill(""); // make arr of ""
    let randomArr = emptyArr.map((e) =>
      Math.floor(Math.random() * data.questions.length)
    ); // make the values random
    randomArr.length = numberOfQuestion; // select only the first 10 number

    // make questions dots
    for (i = 0; i < randomArr.length; i++) {
      let span = document.createElement("span");
      theProgDots.appendChild(span);
      theProgDots.firstChild.classList.add("done")
    }
    let theDotsList = document.querySelectorAll(".the-prog-dots span")

    showQuestion();

    let theAnswersList = document.querySelectorAll(".the-answers .answer");
    // add clicking functionality

    addEventListener("click", (a) => {
      if (a.target.classList.contains("answer")) {
        let theAnswersList = document.querySelectorAll(".the-answers .answer");
        theAnswersList.forEach((e) => {
            e.classList.remove("empty-alert");
            console.log("nnn")
        });
        theAnswersList.forEach((e) => e.classList.remove("selected"));
        a.target.classList.add("selected");
      }
    });

    theBtn.addEventListener("click", function () {
      let theSelectedAnswer = document.querySelector(".the-answers .answer.selected");
      if (theSelectedAnswer) {
        if (theSelectedAnswer.classList.contains(data.questions[theCurrentQuestion].correct)) {
          theCurrentQuestion++
          if (theCurrentQuestion < numberOfQuestion) {
            theRightAnswers++
            showQuestion()
          } else {
            endGame()
          }
        } else {
          theCurrentQuestion++
          if (theCurrentQuestion < numberOfQuestion) {
            theWrongAnswers++
            showQuestion()
          } else {
            endGame()
          }
        }
        changeTheStatus()
      } else {
        // alert using bootstrap
        let theAnswersList = document.querySelectorAll(".the-answers .answer");
        theAnswersList.forEach((e) => {
            e.classList.add("empty-alert");
        });
      }
    });

    // functions area
    function showQuestion() {

      // if (theCurrentQuestion < numberOfQuestion) {
      //   theRightAnswers++
      // } else {
      //   endGame()
      // }


      let question = data.questions[theCurrentQuestion].question;
      theQuestion.innerHTML = ""
      theQuestion.appendChild(document.createTextNode(question));

      theAnswers.innerHTML = ""
      let numberOFAnswers = data.questions[theCurrentQuestion].answers.length;
      for (let i = 0; i < numberOFAnswers; i++) {
        let answer = data.questions[theCurrentQuestion].answers[i];
        let div = document.createElement("div");
        div.classList.add("answer");
        div.classList.add(`${i}`);
        let span = document.createElement("span");
        div.appendChild(span);
        div.appendChild(document.createTextNode(answer));
        theAnswers.appendChild(div);
      }
    }
    function changeTheStatus() {
      if (questionsCount >= numberOfQuestion ) return
      if (questionsCount >= 0) {
        questionsCount.innerHTML = questionsCount.innerHTML - 1
      }
      for (let i = 0; i <= theCurrentQuestion; i++) {
        theDotsList[i].classList.add("done")
      }
    }
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

