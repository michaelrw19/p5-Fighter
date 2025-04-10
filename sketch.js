// References:
// p1 and P2 animations: https://craftpix.net/freebies/free-3-cyberpunk-characters-pixel-art
// Music from: 
// Font:

let p1;
let p1Ani;

let P2;
let P2Ani;

let winner = "";
let gameState = "run"

const ATTACK_DELAY_DURATION = 500; // in ms
const HURT_DELAY_DURATION = 200; // in ms
const CHAR_W = 60;
const CHAR_H = 150;
const SHOW_HITBOX = true; // set to false when playing
const HEALTH = 1;

// Load Animation, Sound Effect, Music
function preload() {
  //p1 Animations
  p1_attack_1 = loadAnimation(imageSequence("assets/p1/attack_1/", 6))
  p1_attack_1.frameDelay = 4;
  p1_attack_2 = loadAnimation(imageSequence("assets/p1/attack_2/", 6))
  p1_attack_2.frameDelay = 4;
  p1_death = loadAnimation(imageSequence("assets/p1/death/", 6))
  p1_hurt = loadAnimation(imageSequence("assets/p1/hurt/", 6))
  p1_hurt.frameDelay = 4;
  p1_run = loadAnimation(imageSequence("assets/p1/run/", 6))
  p1_idle = loadAnimation(imageSequence("assets/p1/idle/", 4))
  p1_idle.frameDelay = 8;
  
  //p2 Animations
  p2_attack_1 = loadAnimation(imageSequence("assets/p2/attack_1/", 6))
  p2_attack_1.frameDelay = 4;
  p2_attack_2 = loadAnimation(imageSequence("assets/p2/attack_2/", 6))
  p2_attack_2.frameDelay = 4;
  p2_death = loadAnimation(imageSequence("assets/p2/death/", 6))
  p2_death.frameDelay = 12;
  p2_hurt = loadAnimation(imageSequence("assets/p2/hurt/", 6))
  p2_hurt.frameDelay = 4;
  p2_run = loadAnimation(imageSequence("assets/p2/run/", 6))
  p2_idle = loadAnimation(imageSequence("assets/p2/idle/", 4))
  p2_idle.frameDelay = 8;
}

// Setup
function setup() {
  new Canvas(windowWidth, windowHeight);
  
  // p1 Setup
  p1 = new Sprite();  
  p1.w = CHAR_W;
  p1.h = CHAR_H;
  p1.x = width * 0.4;
  p1.y = height * 0.5;
  p1.rotationLock = true;
  p1.healthPoints = HEALTH;
  
  //Add animations
  p1.addAni('attack_1', p1_attack_1);
  p1.addAni('attack_2', p1_attack_2);
  p1.addAni('death', p1_death);
  p1.addAni('hurt', p1_hurt);
  p1.addAni('run', p1_run);
  p1.addAni('idle', p1_idle);
  
  p1.anis.death.looping = false;
  
  p1.delay = false;
  
  // Define Hitbox
  p1.hitbox = createSprite(p1.x + 40, p1.y, 20, 60);
  p1.hitbox.visible = SHOW_HITBOX;
  // Hitbox will always follow the movement of p1, see runGame()
    
  // Listen to events for p1
  p1.update = async function () {
  
    speed = 3;
    
    if (this.delay) return;
    
    if (kb.pressing('a') && this.x - this.width / 2 > 0) {
      this.x -= speed; //Backward
    } 
    else if (kb.pressing('d') && this.x + (this.width / 2) + this.width < width) {
      this.x += speed; //Forward
      this.changeAni('run'); 
    } 
    // ATTACK_1
    else if (kb.pressing('q')) {
      this.delay = true;
      
      //await ensure the next animation doesnt take over the attack animation
      await this.changeAni('attack_1'); 
      //Figure out if the collision detection should be before or after attack animation finishes
      if(p1.hitbox.overlapping(p2)) { 
        print('p1 Hits p2 with attack 1')
        p2.isHurt = true;
      }
      // this is needed to also ensure attack animation only loop once while waiting for the timeout below
      this.changeAni('idle');
      // Set specific delay for attacks
      setTimeout(() => {
        //the delay var ensures the update loop to return nothing so it doesnt go to the else statement and interupt the curret animation
        this.delay = false;
      }, ATTACK_DELAY_DURATION);
    }
    // ATTACK_2
    else if (kb.pressing('w')) {
      this.delay = true;
      
      await this.changeAni('attack_2');
      if(p1.hitbox.overlapping(p2)) { 
        print('p1 Hits p2 with attack 2')
        p2.isHurt = true;
      }
      this.changeAni('idle');

      setTimeout(() => {
        this.delay = false;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    else if (this.isHurt) {
      this.delay = true;
      await this.changeAni('hurt');
      this.changeAni('idle')
      this.isHurt = false;
      this.delay = false;
      
      this.healthPoints -= 1;
      
      setTimeout(() => {
        this.isHurt = false;
        this.delay = false;
        if(this.healthPoints == 0) { 
          this.delay = true;
          p2.delay = true;
          this.changeAni('death') 
          setTimeout(() => {
            winner = 'p2'
            gameState = 'end';
          }, 1000)
        } 
      }, HURT_DELAY_DURATION); // Cooldown in ms
    }
    // Default action
    else {
      this.changeAni('idle')
    }
    
  };
  
  // p2 Setup
  p2 = new Sprite();  
  p2.w = CHAR_W;
  p2.h = CHAR_H;
  p2.x = width * 0.6;
  p2.y = height * 0.5;
  p2.scale.x = -1;
  p2.rotationLock = true;
  p2.healthPoints = HEALTH;
  
  p2.addAni('attack_1', p2_attack_1);
  p2.addAni('attack_2', p2_attack_2);
  p2.addAni('death', p2_death);
  p2.addAni('hurt', p2_hurt);
  p2.addAni('run', p2_run);
  p2.addAni('idle', p2_idle);
  
  p2.anis.death.looping = false;
  
  // Delays needed to finish an animation
  p2.delay = false;
  
  // Define Hitbox
  p2.hitbox = createSprite(p2.x - 40, p2.y, 20, 60);
  p2.hitbox.visible = SHOW_HITBOX;
    
  // Listen to events for p2
  p2.update = async function () {
    
    speed = 3;
    
    if (this.delay) return;
    
    if (kb.pressing(',') && this.x - (this.width / 2) > this.width) {
      this.x -= speed; //Forward
      this.changeAni('run');
    } 
    else if (kb.pressing('.') && this.x + this.width / 2 < width) {
      this.x += speed; //Backward
    } 
    // ATTACK 1
    else if (kb.pressing('k')) {
      this.delay = true;

      await this.changeAni('attack_1');
      if(p2.hitbox.overlapping(p1)) { 
        print('p2 Hits p1')
        p1.isHurt = true;
      }
      this.changeAni('idle');

      setTimeout(() => {
        this.delay = false;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    // ATTACK 2
    else if (kb.pressing('l')) {
      this.delay = true;
      
      await this.changeAni('attack_2');
      if(p2.hitbox.overlapping(p1)) { 
        print('p2 Hits p1')
        p1.isHurt = true;
      }
      this.changeAni('idle'); 

      setTimeout(() => {
        this.delay = false;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    else if (this.isHurt) {
      this.delay = true;
      await this.changeAni('hurt');
      this.changeAni('idle')
      this.isHurt = false;
      this.delay = false;
      
      this.healthPoints -= 1;
      
      setTimeout(() => {
        this.isHurt = false;
        this.delay = false;
        if(this.healthPoints == 0) { 
          this.delay = true;
          p1.delay = true;
          this.changeAni('death') 
          setTimeout(() => {
            winner = 'p1'
            gameState = 'end';
          }, 1000)
        } 
      }, HURT_DELAY_DURATION); // Cooldown in ms
    }
    // Default action
    else {
      this.changeAni('idle')
    }
    
  };
  
  // Define hitbox overlapping
  p1.hitbox.overlaps(p2);
  p1.hitbox.overlaps(p2.hitbox);
  p2.hitbox.overlaps(p1);
  p2.hitbox.overlaps(p1.hitbox);
  
  // disable all the automatic stuff
  // allSprites.autoDraw = false;
  // allSprites.autoUpdate = false;
  // world.autoStep = false; 
  
  allSprites.debug = true; // Set to false when playing
}

////////////////////////////////////////////////////
function draw() {   
  if (gameState == "run") runGame();  
  if (gameState == "end") endGame();  
}

////////////////////////////////////////////////////
function runGame() {
  background('black');
  
  //Hitbox Behaviours, 41 makes gives enough space to prevent it from pushing
  p1.hitbox.x = p1.x + 41; //Relative to p1
  p1.hitbox.y = p1.y;
  
  p2.hitbox.x = p2.x - 41; //Relative to p2
  p2.hitbox.y = p2.y;
  
  // allSprites.update();
  // allSprites.draw();dd
  // world.step();  
  
}

function endGame() {
  background('black');
  
  noStroke();  
  fill('red');
  textAlign(CENTER);
  textSize(72);
  textFont("Arial");
  text("GAME OVER!!!", width/2, height*0.2);
  
  fill('white');
  textSize(24);
  textFont("Arial");
  text((winner + " WINS"), width/2, height*0.3);
  
  fill('white');
  textSize(24);
  textFont("Arial");
  text("Click to try again", width/2, height*0.4);
  
  if (mouse.presses()) {
    gameState = "run";
    p1.healthPoints = HEALTH;
    p2.healthPoints = HEALTH;
    p1.delay = false;
    p2.delay = false;
    p1.x = width * 0.4;
    p1.y = height * 0.5;
    p2.x = width * 0.6;
    p2.y = height * 0.5;
  }
}

////////////////////////////////////////////////////
function imageSequence(prefix, numberOfFrames, ext=".png") {
  let sequence = []; 
  for (let i=0; i < numberOfFrames; i++) {
    sequence[i] = prefix + i + ext;  
  }
  return sequence;  
}


