let questions = JSON.parse(localStorage.getItem("questions")) || [];

function renderQuestions(filteredQuestions = questions) {
  const questionsContainer = document.getElementById("questionView");
  questionsContainer.innerHTML = "";

  if (filteredQuestions.length === 0) {
    questionsContainer.innerHTML = "<p>No matching questions found.</p>";
    return;
  }

  filteredQuestions.forEach((question, index) => {
    const questionElement = document.createElement("div");
    questionElement.id = "question-" + (index + 1);
    questionElement.className = "question-card bg-white p-3 rounded mb-3";
    questionElement.innerHTML = `
            <p>${question.title}</p>
            <p class="badge bg-dark">${question.subject || "General"}</p>
        `;
    questionElement.onclick = () => displayQuestion(index);
    questionsContainer.appendChild(questionElement);
  });

  localStorage.setItem("questions", JSON.stringify(questions));
}

function showQuestionForm() {
  const rightPane = document.getElementById("right-pane");
  rightPane.style.display = "block";
  rightPane.innerHTML = `
        <div class="question-form">
            <h3>Ask a Question</h3>
            <form id="questionForm">
                <label for="title">Subject:</label>
                <input type="text" id="title" class="form-control" required />
                <label for="question">Question:</label>
                <textarea id="question" class="form-control" required></textarea>
                <button type="submit" class="btn btn-dark mt-2">Submit Question</button>
            </form>
        </div>
    `;

  const questionForm = document.getElementById("questionForm");
  questionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const questionText = document.getElementById("question").value;

    questions.push({ title, question: questionText, responses: [] });
    renderQuestions();
    questionForm.reset();
  });
}

function displayQuestion(index) {
  const rightPane = document.getElementById("right-pane");
  const selectedQuestion = questions[index];

  rightPane.innerHTML = `
        <h3>${selectedQuestion.title}</h3>
        <p>${selectedQuestion.question}</p>
        <div id="responses" class="rounded-box p-3 mt-4 bg-light">
            <h4>Responses:</h4>
            ${
              selectedQuestion.responses.length > 0
                ? selectedQuestion.responses
                    .map(
                      (r) =>
                        `<div class="response-box mt-2 p-2 bg-white rounded"><strong>${r.name}</strong>: ${r.comment}</div>`
                    )
                    .join("")
                : "<p>No responses yet.</p>"
            }
        </div>
        <form id="responseForm" class="response-form mt-4">
            <label for="name">Name:</label>
            <input type="text" id="name" class="form-control" required />
            <label for="comment">Comment:</label>
            <textarea id="comment" class="form-control" required></textarea>
            <button type="submit" class="btn btn-dark mt-2">Submit Response</button>
        </form>
        <button class="btn btn-danger resolve-btn mt-3" onclick="resolveQuestion(${index})">Resolve</button>
    `;

  const responseForm = document.getElementById("responseForm");
  responseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;

    questions[index].responses.push({ name, comment });
    displayQuestion(index);
    localStorage.setItem("questions", JSON.stringify(questions));
  });
}

function resolveQuestion(index) {
  questions.splice(index, 1);
  renderQuestions();
  localStorage.setItem("questions", JSON.stringify(questions));
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchTerm)
  );
  renderQuestions(filteredQuestions);
}

document.getElementById("searchBar").addEventListener("input", handleSearch);
renderQuestions();
