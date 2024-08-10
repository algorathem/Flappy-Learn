let move_speed = 3, grativy = 0.25;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

//   method returns DOMReact top, right, left, bottom, x, y, width, height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// quiz logic here....
let lives = 5;
let isQuizActive = false;
let isGameOver = false;

const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question");
const options = Array.from(document.querySelectorAll("#quiz-container button"));

const questions = [
    { question: "What is 2+2?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
    { question: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
];

const gameOverContainer = document.getElementById("game-over-container");
const finalScoreText = document.getElementById("final-score");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");


let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    
    if(e.key == 'Enter' && game_state != 'Play' && !isQuizActive && !isGameOver){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });

        img.style.display = 'block';
        quizContainer.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        isGameOver = false;
                        gameOverContainer.style.display = "none";
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            showQuiz();
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;
        if(!isQuizActive) {showQuiz();}

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

//quiz logic writes here......
function showQuiz() {

    isQuizActive = true;
    quizContainer.style.display = "block";
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = randomQuestion.question;
    options.forEach((option, index) => {
        option.textContent = randomQuestion.options[index];
        option.dataset.correct = index === randomQuestion.correct;
    });
}

function checkAnswer(selectedOption) {
    if (options[selectedOption].dataset.correct === "true") {
        resetGameAfterQuiz();
    } else {
        lives--;
        if (lives <= 0) {
            gameOver();
        } else {
            updateScoreAndLivesDisplay();
            resetGameAfterQuiz();
        }
    }
}

function resetGameAfterQuiz() {
    isQuizActive = false;
    quizContainer.style.display = "none";
    game_state = 'End';
    message.style.left = '28vw';
    window.location.reload();
    message.classList.remove('messageStyle');
    return;
}

function updateScoreAndLivesDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.innerHTML = ''; // Clear previous hearts
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img');
        heart.src = 'heart.png';
        heart.width = 30;
        heart.height = 30;
        livesDisplay.appendChild(heart);
    }
}

function gameOver() {
    isGameOver = true;
    gameOverContainer.style.display = "block";
    finalScoreText.textContent = score;
}

function restartGame() {
    isGameOver = false;
    gameOverContainer.style.display = "none";
    score = 0;
    lives = 5;
    bird.x = canvas.width / 4;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    updateScoreAndLivesDisplay();
    gameLoop();
}

function drawLives() {
    // Clear the lives area
    ctx.clearRect(0, 0, canvas.width, 30);
    // Not used anymore since we are using HTML elements for hearts
}
