document.addEventListener('DOMContentLoaded',() => {
    // html query
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10;
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = ['orange','red','purple','green','blue']

    //
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
    const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
    ]

    const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
    ]

    const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    
    let currentPosition = 4
    let currentRotation = 0

    //randomly select tetromino
    let random = Math.floor(Math.random()*theTetrominos.length)

    let current = theTetrominos[random][currentRotation]

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the tetromino
    function undraw() {
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode == 37) {
            moveLeft()
        } else if (e.keyCode == 38) {
            rotate()
        } else if (e.keyCode == 39) {
            moveRight()
        } else if (e.keyCode == 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup',control)
    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move tetromino left, unless it is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width == 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    // move tetromino right, unless it is at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width == width - 1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    // rotate tetromino
    function rotate() {
        undraw()
        currentRotation ++ 
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    

    //the Tetrominos without rotations
    const upNextTetrominos = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0,1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    //display the shape in the mini-gride display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click',()=>{
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 200)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })

    //ad score
    function addScore() {
        for (let i = 0; i < 199; i+= width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[currentPosition + index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i,width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
            
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition +index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)

        }
    }
})