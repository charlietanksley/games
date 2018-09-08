var gameWidth = 800;
var gameHeight = 600;
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('./');

    this.load.image('sky', 'assets/space3.png');
    this.load.image('paddle', 'assets/paddle1.png');
    this.load.image('ball', 'assets/ball1.png');
    this.load.bitmapFont('atari', 'assets/atari-classic.png', 'assets/atari-classic.xml');
}

var ball,
    cursors,
    paddle,
    paddle_speed,
    score;

paddle_speed = 5;
score = 0;


function pickSpeed(onlyPositive=true) {
    let signs = [1, -1];
    let speeds = [200, 250, 300, 350, 400, 450, 500, 550];

    let speed = speeds[Math.floor(Math.random()*speeds.length)];

    if (onlyPositive) {
        return speed;
    } else {
        return speed * signs[Math.floor(Math.random()*signs.length)];
    }
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();

    let background = this.physics.add.staticGroup();
    this.groundLayer = background.create(400, 300, 'sky');

    let ballStartX = Math.floor((Math.random() * gameWidth) + 1);

    ball = this.physics.add.image(ballStartX, 0, 'ball');
    ball.setVelocity(pickSpeed(false), pickSpeed(true));
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);

    paddle = this.physics.add.image(400, 600, 'paddle');
    paddle.body.gravityScale = 0;
    paddle.setCollideWorldBounds(true);
    paddle.body.immovable = true;

}

var gameOver = false;
function update () {
    this.physics.add.collider(ball, paddle, collide);
    if (ball.y >= 580) {
        this.add.bitmapText(100, 150, "atari", 'Game Over!', 64);
        let scoreMsg = 'Score: ' + score;
        this.add.bitmapText(100, 250, "atari", scoreMsg, 48);
        ball.setVelocity(0,0)
        gameOver = true;
    }

    if (!gameOver) {
        if (cursors.left.isDown && paddle.x > 0) {
            paddle.x -= paddle_speed;
        } else if (cursors.right.isDown && paddle.x < 800) {
            paddle.x += paddle_speed;
        }
    }
}

function collide (object1, object2) {
    let velocity = object1.body.velocity;
    score += 1;
    console.debug(score);

    object1.setVelocity(velocity.x * 1.1, velocity.y * 1.1);
    paddle_speed += 2;
}
