// elementos
const containerText = document.querySelector('.containerText')
const refresh = document.querySelector('.refresh')
const time = document.querySelector('.time')
const btns = document.querySelectorAll('.times button')
const results = document.querySelector('.results')
refresh.disabled = true
refresh.classList.add('disabled')

let pressedKey = []
let position = 0, 
successful = 0, 
errores = 0,
timer = null, 
sec,
currentTime,
freeMode = false,
wordsNumber = 50,
wordLenguage = 'spanishWords'

// eventos
// evento principal
document.addEventListener('keydown', handlerKeydown)

// evento reiniciar juego
refresh.addEventListener('click', ()=>{
    document.addEventListener('keydown', handlerKeydown)
    clear()
    enableBtns()
    containerText.innerHTML = ''
    getWords(wordLenguage)
    refresh.blur()
    refresh.disabled = true
    refresh.classList.add('disabled')
    time.textContent = freeMode ? '' : sec
    results.style.display = 'none'
})

// cambiar de estado
btns.forEach(btn =>{
    btn.addEventListener('click', handlerTimes)
})


// funciones
// funcion game over
function gameOver() {
    // manejo de datos
    let PPM = freeMode ? ((successful + errores) / currentTime)*60 : ((successful + errores) / (sec - currentTime))*60
    
    results.innerHTML = `<p class="accuracy">${(successful / (successful + errores) * 100).toFixed(0)}%<span>Precisión real</span></p>
        <div>
            <p>${successful}<span>Caracteres acertados</span></p>
            <p>${PPM.toFixed(0)}<span>PPM</span></p>
            <p>${errores}<span>Errores</span></p>
            ${freeMode ? `<p>${currentTime}s<span>Tiempo</span></p>` : ''}
        </div>`
    results.style.display = 'flex'
    
    // reestablecer valores
    clear()
    enableBtns()
}

function clear() {
    pressedKey = []
    position = 0
    successful = 0
    errores = 0
    clearInterval(timer)
    timer = null
    currentTime = sec
}

// funcion obtener las palabras
function getWords(lenguageWords) {
    fetch(`/src/data/${lenguageWords}.json`)
    .then(req => req.json())
    .then(res =>{
        renderText(res)
    })
    .catch(err => console.log(err))    
}
getWords(wordLenguage)

// funcion para mostrar el texto
function renderText(words) {
    for (let w = 0; w < wordsNumber; w++) {
        const spanWord = document.createElement('span')
        spanWord.classList.add('word')
        let word = words[Math.floor(Math.random() * words.length)]

        for (let i = 0; i < word.length; i++) {
            const spanLetter = document.createElement('span')

            if (w === 0 && i === 0) {
                spanLetter.classList.add('active')
            }
            spanLetter.classList.add('caracter')
            spanLetter.textContent = (w === 0 && i === 0) ? word[i].toLocaleUpperCase() : word[i]
            spanWord.appendChild(spanLetter)
        }

        const spanSpace = document.createElement('span')
        spanSpace.classList.add('caracter')
        spanSpace.textContent = w === (wordsNumber - 1) ? '.' : ' '
        containerText.append(spanWord, spanSpace)
    }
}

// funcion manejadora del evento principal
function handlerKeydown(e) {
    refresh.disabled = false
    refresh.classList.remove('disabled')
    const { key } = e
    const letters = containerText.querySelectorAll('span.caracter')
    
    if (key == 'Dead' || key == 'CapsLock' || key == 'Shift' || key == 'AltGraph' || key == 'Alt' || key == 'Control' || key == 'Meta' || key == 'Tab' || key == 'Backspace' || key == 'Enter') return

    if(!timer){
        btns.forEach(btn =>{
            btn.classList.add('disabled')
            btn.disabled = true
        })
        timer = setInterval(()=>{
            if (freeMode) {
                currentTime++
            }else{
                currentTime--
                time.textContent = currentTime
            }

            if (currentTime === 0) {
                gameOver()
                document.removeEventListener('keydown', handlerKeydown)
            }
        }, 1000)
    }

    pressedKey.push(key)

    if (pressedKey[position] === letters[position].textContent) {
        letters[position].classList.add('successful')
        letters[position].classList.remove('active')
        successful++

    } else {
        letters[position].classList.add('error')
        letters[position].classList.remove('active')
        errores++
    }

    position++

    if (letters[position]) {
        letters[position].classList.add('active')
    }else{
        gameOver()
        document.removeEventListener('keydown', handlerKeydown)
    }  
}

// funcion para tiempo inicial
function handlerTimes(e) {
    let btn
    if (e && e.target.classList.contains('blockTime')) {
        freeMode = true
        time.textContent = ''
        btn = e.target
        sec = 0
        currentTime = sec
        
    }else if(e){
        btn = e.target
        sec = btn.getAttribute('data-s')
        currentTime = sec
        time.textContent = sec
        freeMode = false
    }else{
        btn = document.querySelector('.times button')
        sec = btn.getAttribute('data-s')
        currentTime = sec
        time.textContent = sec
        freeMode = false
    }

    btns.forEach(btn => btn.classList.remove('active-btn'))
    btn.classList.add('active-btn')
    btn.blur()
}
handlerTimes()

// manejador de estado botones
function enableBtns() {
    let disabledBtns = document.querySelectorAll('.times .disabled')
    disabledBtns.forEach(btn => {
        btn.classList.remove('disabled')
        btn.disabled = false
    })
}
