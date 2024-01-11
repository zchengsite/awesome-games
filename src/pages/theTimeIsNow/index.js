
const rotaryControl = true

const pointerDom = document.querySelector('#pointer')

const circleDom = document.querySelector('#circle')

const stopBtnDom = document.querySelector('#stop-btn')
const startBtnDom = document.querySelector('#start-btn')

const msgBoxDom = document.querySelector('#msg-box')

let timer = null

let deg = 0

let randomDeg = 1

let randomDegRange = 15

function step () {
  deg += 1
  pointerDom.style.transform = `rotate(${deg}deg)`

  if (deg >= 360) deg = 0
}

function start () {
  msgBoxDom.innerHTML = ''
  clearInterval(timer)
  timer = null
  randomDegRange = randomNum(15, 30)
  randomDeg = randomNum(0, 360 - randomDegRange)
  let styleText = `conic-gradient(black 0deg ${randomDeg}deg, orange ${randomDeg}deg ${randomDeg + randomDegRange}deg, black ${randomDeg + randomDegRange}deg)`
  circleDom.style.background = styleText
  timer = setInterval(step, 0)
}

function stop () {
  if (!timer) {
    return
  }
  clearInterval(timer)
  timer = null
  if (deg <= randomDeg + randomDegRange && deg >= randomDeg) {
    msgBoxDom.innerHTML = 'nice!'
  } else {
    msgBoxDom.innerHTML = 'bad!'
  }
}

function randomNum (minNum, maxNum) {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
}

stopBtnDom.addEventListener('click', stop, false)
startBtnDom.addEventListener('click', start, false)
start()
