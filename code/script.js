const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident fugit consequuntur nesciunt consequatur eveniet quod quia repellat error! Placeat veritatis nihil illo nemo beatae aliquid sunt, incidunt culpa voluptate id!'

// elementos
const containerText = document.querySelector('.containerText')
const refresh = document.querySelector('.refresh')
const time = document.querySelector('.time')
const btns = document.querySelectorAll('.times button')
const results = document.querySelector('.results')

let pressedKey = []
let position = 0, 
successful = 0, 
errores = 0,
timer = null, 
sec,
currentTime

// eventos
// evento principal
document.addEventListener('keydown', handlerKeydown)

// evento reiniciar juego
refresh.addEventListener('click', ()=>{
    document.addEventListener('keydown', handlerKeydown)
    clear()
    containerText.innerHTML = ''
    renderText(text)
    refresh.blur()
    time.textContent = sec
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
    results.innerHTML = `<p class="accuracy">${(successful / (successful + errores) * 100).toFixed(0)}%<span>Precisión real</span></p>
        <div>
            <p>${successful}<span>Caracteres acertados</span></p>
            <p>${sec - currentTime}<span>Segundos</span></p>
            <p>${errores}<span>Errores</span></p>
        </div>`
    results.style.display = 'flex'
    
    // reestablecer valores
    clear()
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

// funcion mostrar texto
function renderText(text) {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span')
        if (i == 0) {
            span.classList.add('active')
        }
        span.textContent = text[i]
        fragment.appendChild(span)
    }
    containerText.append(fragment)
}
renderText(text)

// funcion manejadora del evento principal
function handlerKeydown(e) {
    const { key } = e
    const letters = containerText.children
    
    if (key == 'CapsLock' || key == 'Shift' || key == 'AltGraph' || key == 'Alt' || key == 'Control' || key == 'Meta' || key == 'Tab' || key == 'Backspace') return

    if(!timer){
        timer = setInterval(()=>{
            currentTime--
            time.textContent = currentTime

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

    if (e) {
        btn = document.querySelector(`[data-s="${e.target.getAttribute('data-s')}"]`)

        btns.forEach(btn => btn.classList.remove('active-btn'))
    }else{
        btn = document.querySelector('.times button')
    }

    btn.classList.add('active-btn')
    time.textContent = btn.getAttribute('data-s')
    sec = btn.getAttribute('data-s')
    currentTime = sec
    btn.blur()
}
handlerTimes()
