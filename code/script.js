const text = 'Lorem ipsum qué sit amet consectetur adipisicing elit. Provident fugit consequuntur nesciunt consequatur eveniet quod quia repellat error! Placeat veritatis nihil illo nemo beatae aliquid sunt, incidunt culpa voluptate id!'

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
freeMode = false

// eventos
// evento principal
document.addEventListener('keydown', handlerKeydown)

// evento reiniciar juego
refresh.addEventListener('click', ()=>{
    document.addEventListener('keydown', handlerKeydown)
    clear()
    enableBtns()
    containerText.innerHTML = ''
    renderText(text)
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
    refresh.disabled = false
    refresh.classList.remove('disabled')
    const { key } = e
    const letters = containerText.children
    
    if (key == 'Dead' || key == 'CapsLock' || key == 'Shift' || key == 'AltGraph' || key == 'Alt' || key == 'Control' || key == 'Meta' || key == 'Tab' || key == 'Backspace') return

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
