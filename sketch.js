// References:
// p1 and P2 animations: https://craftpix.net/freebies/free-3-cyberpunk-characters-pixel-art
// Music from: 
// Font:

let p1;
let p1Ani;

let P2;
let P2Ani;

let gameState = "run"

const ATTACK_DELAY_DURATION = 500; // in ms

// Load Animation, Sound Effect, Music
function preload() {
  //p1 Animations
  p1_attack_1 = loadAnimation(imageSequence("assets/p1/attack_1/", 6))
  p1_attack_1.frameDelay = 4;
  p1_attack_2 = loadAnimation(imageSequence("assets/p1/attack_2/", 6))
  p1_attack_2.frameDelay = 8;
  death = loadAnimation(imageSequence("assets/p1/death/", 6))
  hurt = loadAnimation(imageSequence("assets/p1/hurt/", 2))
  run = loadAnimation(imageSequence("assets/p1/run/", 6))
  idle = loadAnimation(imageSequence("assets/p1/idle/", 4))
  idle.frameDelay = 8;
}

// Setup
function setup() {
  new Canvas(windowWidth, windowHeight);
  
  // p1 Setup
  p1 = new Sprite();  
  p1.w = 80;
  p1.h = 150;
  p1.x = width / 4;
  p1.y = height / 2;
  p1.rotationLock = true;
  p1.addAni('attack_1', p1_attack_1);
  p1.addAni('attack_2', p1_attack_2);
  p1.addAni('death', death);
  p1.addAni('hurt', hurt);
  p1.addAni('run', run);
  p1.addAni('idle', idle);
  
  p1.anis.death.looping = false;
  p1.anis.hurt.looping = false;
  
  p1.delayAttack = false;
    
  // Listen to events for p1
  p1.update = async function () {
  
    speed = 3;
    
    if (this.delayAttack) return;
    
    if (kb.pressing('a') && this.x - this.width / 2 > 0) {
      this.x -= speed; //Backward
    } 
    else if (kb.pressing('d') && this.x + this.width / 2 < width) {
      this.x += speed; //Forward
      this.changeAni('run');
    } 
    else if (kb.pressing('q')) {
      this.delayAttack = true;
      await this.changeAni('attack_1');
      this.changeAni('idle');

      setTimeout(() => {
        this.delayAttack = false;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    else if (kb.pressing('w')) {
      this.delayAttack = true;
      await this.changeAni('attack_2');
      this.changeAni('idle');

      setTimeout(() => {
        this.delayAttack = false;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    // Default action
    else {
      this.changeAni('idle')
    }
    
  };
  
  // p2 Setup
  
  allSprites.autoDraw = false;  // Stop auto drawing
  allSprites.autoUpdate = false;  // Stop auto updating
  
  allSprites.debug = true; // Set to false when playing
}

async function attack() {
  await p1.changeAni('attack_1')
  p1.changeAni('idle');
  p1.delayAttack = true;
}

////////////////////////////////////////////////////
function draw() {   
  if (gameState == "run") runGame();  
}

////////////////////////////////////////////////////
function runGame() {
  background('black');
  
  // p1 behaviours
  //p1.moveTowards(mouse, 1);  
  // set the player orientation (left/right based on mouse)
  //if (pmouseX > mouseX) p1.scale.x = -1; 
  //if (pmouseX < mouseX) p1.scale.x = 1; 
  
  allSprites.update();
  allSprites.draw();
  world.step();  
}

////////////////////////////////////////////////////
function imageSequence(prefix, numberOfFrames, ext=".png") {
  let sequence = []; 
  for (let i=0; i < numberOfFrames; i++) {
    sequence[i] = prefix + i + ext;  
  }
  return sequence;  
}



