// elementos
const containerText = document.querySelector(".containerText");
const refresh = document.querySelector(".refresh");
const settings = document.querySelector(".settings");
const modal = document.querySelector(".modal");
const time = document.querySelector(".time");
const timeBtns = document.querySelectorAll(".times button");
const textBtns = document.querySelectorAll(".textAlign button");
const results = document.querySelector(".results");
const toggle_effect = document.querySelector(".toggle-effect");
const lengBtns = document.querySelectorAll(".lenguages div button");
const inputWordsNumber = document.getElementById("wordsNumber");
refresh.disabled = true;
refresh.classList.add("disabled");

let pressedKey = [];
let position = 0,
  successful = 0,
  errores = 0,
  timer = null,
  sec,
  currentTime,
  freeMode = false,
  wordsNumber = 50,
  wordLenguage;

// eventos
// handler keydown
document.addEventListener("keydown", handlerKeydown);

// reiniciar juego
refresh.addEventListener("click", () => {
  document.addEventListener("keydown", handlerKeydown);
  clear();
  enableBtns();
  containerText.innerHTML = "";
  getWords(wordLenguage);
  refresh.blur();
  refresh.disabled = true;
  refresh.classList.add("disabled");
  time.textContent = freeMode ? "0" : sec;
  results.style.display = "none";
});

// modal ajustes
settings.addEventListener("click", (e) => {
  modal.style.transform = "translateY(0)";
  document.removeEventListener("keydown", handlerKeydown);
});

// cerrar modal
document.addEventListener("click", (e) => {
  if (e.target.className === "modal") {
    modal.style.transform = "translateY(-100%)";
    document.addEventListener("keydown", handlerKeydown);
  }
});

// toggle effect
lengBtns.forEach((btn) => {
  btn.addEventListener("click", toggleEffect);
});

// handler times
timeBtns.forEach((btn) => {
  btn.addEventListener("click", handlerTimes);
});

// handler text align
textBtns.forEach((btn) => {
  btn.addEventListener("click", handlerText);
});

// handler wordsNumber
inputWordsNumber.addEventListener("input", handleWordsNumber);

// funciones
// funcion game over
function gameOver() {
  // manejo de datos
  let PPM = freeMode
    ? ((successful + errores) / currentTime) * 60
    : ((successful + errores) / (sec - currentTime)) * 60;

  results.innerHTML = `<p class="accuracy">${(
    (successful / (successful + errores)) *
    100
  ).toFixed(0)}%<span>Precisión real</span></p>
        <div>
            <p>${successful}<span>Caracteres acertados</span></p>
            <p>${PPM.toFixed(0)}<span>PPM</span></p>
            <p>${errores}<span>Errores</span></p>
            ${freeMode ? `<p>${currentTime}s<span>Tiempo</span></p>` : ""}
        </div>`;
  results.style.display = "flex";
  setTimeout(() => {
    results.scrollIntoView({ behavior: "smooth" });
  }, 500);
  // reestablecer valores
  clear();
  enableBtns();
}

// reestablecer valores
function clear() {
  pressedKey = [];
  position = 0;
  successful = 0;
  errores = 0;
  clearInterval(timer);
  timer = null;
  currentTime = sec;
}

// toggle effect y wordLenguage
function toggleEffect(e) {
  let btn = document.querySelector(".lenguages div button");
  if (e) btn = e.target;

  lengBtns.forEach((btn) => btn.classList.remove("lengActive"));
  btn.classList.add("lengActive");
  wordLenguage = btn.getAttribute("data-len");
  getWords(wordLenguage);
  toggle_effect.style.width = `${btn.offsetWidth}px`;
  toggle_effect.style.left = `${btn.offsetLeft}px`;
  refresh.click();
}
toggleEffect();

function handleWordsNumber(e) {
  const { value } = e.target;
  if (value < 10 || value > 100) return;
  wordsNumber = value;
  getWords(wordLenguage);
}

// funcion obtener las palabras
async function getWords(wordLenguage) {
  let wordsToRender = {};
  let [reqEn, reqEs] = await Promise.all([
    fetch("src/data/englishWords.json"),
    fetch("src/data/spanishWords.json"),
  ]);
  let [englishWords, spanishWords] = await Promise.all([
    reqEn.json(),
    reqEs.json(),
  ]);
  wordsToRender.english = englishWords;
  wordsToRender.spanish = spanishWords;

  if (wordLenguage === "randomWords") {
    renderText([...englishWords, ...spanishWords]);
  } else {
    renderText(wordsToRender[wordLenguage]);
  }
}

// funcion para mostrar el texto
function renderText(words) {
  containerText.innerHTML = "";
  for (let w = 0; w < wordsNumber; w++) {
    const spanWord = document.createElement("span");
    spanWord.classList.add("word");
    let word = words[Math.floor(Math.random() * words.length)];

    for (let i = 0; i < word.length; i++) {
      const spanLetter = document.createElement("span");

      if (w === 0 && i === 0) {
        spanLetter.classList.add("active");
      }
      spanLetter.classList.add("caracter");
      spanLetter.textContent =
        w === 0 && i === 0 ? word[i].toLocaleUpperCase() : word[i];
      spanWord.appendChild(spanLetter);
    }

    const spanSpace = document.createElement("span");
    spanSpace.classList.add("caracter");
    spanSpace.textContent = w === wordsNumber - 1 ? "." : " ";
    containerText.append(spanWord, spanSpace);
  }
}

// funcion manejadora del evento principal
function handlerKeydown(e) {
  refresh.disabled = false;
  refresh.classList.remove("disabled");
  const { key } = e;
  const letters = containerText.querySelectorAll("span.caracter");

  if (
    key == "Dead" ||
    key == "CapsLock" ||
    key == "Shift" ||
    key == "AltGraph" ||
    key == "Alt" ||
    key == "Control" ||
    key == "Meta" ||
    key == "Tab" ||
    key == "Backspace" ||
    key == "Enter"
  )
    return;

  if (!timer) {
    disabledBtns();
    timer = setInterval(() => {
      if (freeMode) {
        currentTime++;
      } else {
        currentTime--;
        time.textContent = currentTime;
      }

      if (currentTime === 0) {
        gameOver();
        document.removeEventListener("keydown", handlerKeydown);
      }
    }, 1000);
  }

  pressedKey.push(key);

  if (pressedKey[position] === letters[position].textContent) {
    letters[position].classList.add("successful");
    letters[position].classList.remove("active");
    successful++;
  } else {
    letters[position].classList.add("error");
    letters[position].classList.remove("active");
    errores++;
  }

  position++;

  if (letters[position]) {
    letters[position].classList.add("active");
  } else {
    gameOver();
    document.removeEventListener("keydown", handlerKeydown);
  }
}

// funcion handler times
function handlerTimes(e) {
  let btn = e.target;
  if (btn.classList.contains("blockTime")) {
    freeMode = true;
    time.style.opacity = "0";
    sec = 0;
  } else {
    sec = btn.getAttribute("data-s");
    time.textContent = sec;
    time.style.opacity = "1";
    freeMode = false;
  }

  currentTime = sec;
  timeBtns.forEach((btn) => btn.classList.remove("active-btn"));
  btn.classList.add("active-btn");
  btn.blur();
}

// función handler textAlign
function handlerText(e) {
  const { target } = e;
  containerText.style.textAlign = target.getAttribute("data-align");

  textBtns.forEach((btn) => btn.classList.remove("active-btn"));
  target.classList.add("active-btn");
  target.blur();
}

// funcion estado inciial de botones
(() => {
  let initialTime = document.querySelector(".times button");
  let initialAlign = document.querySelector(".textAlign button");

  containerText.style.textAlign = initialAlign.getAttribute("data-align");
  initialAlign.classList.add("active-btn");

  initialTime.classList.add("active-btn");
  sec = initialTime.getAttribute("data-s");
  time.textContent = sec;
  currentTime = sec;
})();

// manejador de botones
function disabledBtns() {
  timeBtns.forEach((btn) => {
    btn.classList.add("disabled");
    btn.disabled = true;
  });
  settings.classList.add("disabled");
  settings.disabled = true;
}

function enableBtns() {
  timeBtns.forEach((btn) => {
    btn.classList.remove("disabled");
    btn.disabled = false;
  });

  settings.classList.remove("disabled");
  settings.disabled = false;
}
