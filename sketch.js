const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine, world;

var tower, towerImage, backgroundImage, ground, cannon, angle;
var cannonBall;

var balls = [];
var boats = [];
var boatAnimation = [];
var brokenBoatAnimation = [];
var waterSplashAnimation = [];

var boatSS, boatSD;
var brokenBoatSS, brokenBoatSD;
var waterSplashSS, waterSplashSD;

var backgroundMusic, cannonWater, cannonExplosion, pirateLaugh;

var isLaughing = false;
var isGameOver = false;

var score = 0;


function preload() {
  towerImage = loadImage("assets/tower.png");
  backgroundImage = loadImage("assets/background.gif");

  boatSS = loadImage("assets/boat/boat.png");
  boatSD = loadJSON("assets/boat/boat.json");

  brokenBoatSS = loadImage("assets/boat/broken_boat.png");
  brokenBoatSD = loadJSON("assets/boat/broken_boat.json");

  waterSplashSS = loadImage("assets/water_splash/water_splash.png");
  waterSplashSD = loadJSON("assets/water_splash/water_splash.json");

  backgroundMusic = loadSound("assets/background_music.mp3");
  cannonWater = loadSound("assets/cannon_water.mp3");
  cannonExplosion = loadSound("assets/cannon_explosion.mp3");
  pirateLaugh = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  cannon = new Cannon(150, 120, 130, 100, angle);

  ground = Bodies.rectangle(700, 599, 1400, 1, {
    isStatic: true
  });
  World.add(world, ground);

  tower = Bodies.rectangle(120, 360, 160, 310, {
    isStatic: true
  });
  World.add(world, tower);

  var boatFrames = boatSD.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSS.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSD.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSS.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSD.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSS.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }

  rectMode(CENTER);
}

function draw() {
  background(189);

  image(backgroundImage, 0, 0, width, height);
  Engine.update(engine);

  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.5)
  }

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  showBoats();
  cannon.display();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionBoats(i);
  }

  textSize(40);
  fill("black");
  text(`Score : ${score}`, 900, 50);

  if(score >= 1000){
    swal({
      title: `YOU WON`,
      text: `CONGRATULATIONS`,
      imageUrl: `https://media.istockphoto.com/id/1168757141/vector/gold-trophy-with-the-name-plate-of-the-winner-of-the-competition.jpg?s=612x612&w=0&k=20&c=ljsP4p0yuJnh4f5jE2VwXfjs96CC0x4zj8CHUoMo39E=`,
      imageSize: `150x150`,
      confirmButtonText: `Press here to restart!`
    },(isConfirm) => {
      if(isConfirm){
        location.reload();
      }
    });
  }
}

function collisionBoats(c) {
  for (var i = 0; i < boats.length; i++) {
    if (boats[i] != undefined && balls[c] != undefined) {
      var collide = Matter.SAT.collides(boats[i].body, balls[c].body);

      if (collide.collided) {
        score = score + 1;
        boats[i].remove(i);
        balls[c].remove(c);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    cannonBall = new Cannonball(cannon.x, cannon.y);
    balls.push(cannonBall);

  }
}

function showCannonBalls(ball, i) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width + 20 || ball.body.position.y >= height - 30) {
      ball.remove(i);
      cannonWater.play();
    }
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    cannonExplosion.play();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] == undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var pos = [-70, -60, -40, -20];
      var posRandom = random(pos);
      var boat = new Boat(1300, height - 60, 200, 200, posRandom, boatAnimation);
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -1,
          y: 0
        });
        boats[i].show();
        boats[i].animate();

        var c = Matter.SAT.collides(this.tower, boats[i].body);
        if (c.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateLaugh.isPlaying()) {
            pirateLaugh.play();
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      }

    }
  } else {
    var boat = new Boat(1300, height - 60, 200, 200, -60, boatAnimation);
    boats.push(boat);
  }
}

function gameOver() {
  swal({
    title: `GAME OVER`,
    text: `YOU SNOOZE, YOU LOSE!`,
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: `150x150`,
    confirmButtonText: `Press here to restart!`
  }, (isConfirm) => {
    if(isConfirm){
      location.reload();
    }
  });
}