REQ_HEADERS = {
  headers: {
    Accept: "application/json",
  },
};

const jokeModal = document.querySelector("#joke-modal");
const jokeSubtitle = document.querySelector("#joke-subtitle");
const jokeText = document.querySelector("#joke-text");
const saveBtn = document.querySelector("#save-btn");
const savedJokes = document.querySelector("#saved-jokes");
const jokeList = document.querySelector("#joke-list");

// initial setup

let wantsCodingJoke = true; // false denotes dad joke
let currentJoke = {};
let jokeArr = JSON.parse(localStorage.getItem("jokeArr"));
if (jokeArr == null) {
  jokeArr = [];
  localStorage.setItem("jokeArr", JSON.stringify(jokeArr));
}
if (jokeArr?.length > 0) {
  reRenderSavedJokes();
}

function openModal() {
  jokeModal.classList.add("is-active");
}

function closeModal() {
  jokeSubtitle.innerText = "";
  jokeText.innerText = "";
  currentJoke = {};
  jokeModal.classList.remove("is-active");
}

function changeJokeSubtitle() {
  if (wantsCodingJoke) {
    jokeSubtitle.innerText = "Coding Joke";
  } else {
    jokeSubtitle.innerText = "Dad Joke";
  }
}

async function seeNewJoke(preference) {
  if (preference != null) {
    wantsCodingJoke = preference;
    changeJokeSubtitle();
  }
  openModal();
  saveBtn.classList.add("is-loading");
  await fetchJoke();
  jokeText.innerText = currentJoke.msg;
  saveBtn.classList.remove("is-loading");
}

async function fetchJoke() {
  if (wantsCodingJoke) {
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/programming/random",
      REQ_HEADERS
    );
    let resData = await response.json();
    resData = resData[0];
    currentJoke.id = resData.id.toString();
    currentJoke.msg = resData.setup + "\n" + resData.punchline;
    return;
  }
  const response = await fetch("https://icanhazdadjoke.com/", REQ_HEADERS);
  const resData = await response.json();
  currentJoke.id = resData.id;
  currentJoke.msg = resData.joke;
  return;
}

function reRenderSavedJokes() {
  if (jokeArr.length === 0) {
    savedJokes.classList.add("is-hidden");
    return;
  }

  savedJokes.classList.remove("is-hidden");

  const listItems = jokeArr
    .map(
      (joke) =>
        "<li>" +
        joke.msg +
        `<button class="delete m-1" onclick="deleteJoke('${joke.id}')"></button>` +
        "</li>"
    )
    .join("");
  jokeList.innerHTML = listItems;
}

function saveJoke() {
  const alreadyExists = jokeArr.some((j) => j.id === currentJoke.id);
  if (alreadyExists) {
    alert("You already saved that joke");
    return;
  }
  jokeArr.push(currentJoke);
  localStorage.setItem("jokeArr", JSON.stringify(jokeArr));
  reRenderSavedJokes();
  closeModal();
}

function deleteJoke(id) {
  jokeArr = jokeArr.filter((j) => j.id != id);
  localStorage.setItem("jokeArr", JSON.stringify(jokeArr));
  reRenderSavedJokes();
}
