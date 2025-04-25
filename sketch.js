// References:
// p1 and P2 animations: https://craftpix.net/freebies/free-3-cyberpunk-characters-pixel-art
// Map from: https://craftpix.net/freebies/free-pixel-art-street-2d-backgrounds/
// Music from: zerothree [bit-8] - Fight Song [8-Bit; VRC6] - Eve (https://www.youtube.com/watch?v=wbJQx9aK4KI)
// SFX from: Tekken 8

let p1;
let p1Ani;

let P2;
let P2Ani;

let cityImg;
let music;

let gameState = "intro"

const ATTACK_DELAY_DURATION = 500; // in ms
const ATTACK_PUSH_DISTANCE_1 = 15;
const ATTACK_PUSH_DISTANCE_2 = 30;
const ATTACK_PUSH_DISTANCE_3 = 120;
const HURT_DELAY_DURATION = 450; // in ms
const CHAR_W = 60;
const CHAR_H = 150;
const SHOW_HITBOX = false; // set to false when playing
const MAX_HEALTH = 10
const DURATION = 120;
const DEFAULT_HITBOX_W = 20;
const SPECIAL_ATTACK_MIN_HEALTH = 3;

let timer = DURATION;
let lastTime = 0;

// Load Animation, Sound Effect, Music
function preload() {
  //p1 Animations and sfx
  p1_attack_1 = loadAnimation(imageSequence("assets/p1/attack_1/", 6))
  p1_attack_1.frameDelay = 4;
  p1_attack_1_sfx = [loadSound("assets/p1/attack_1/sfx1.wav"), loadSound("assets/p1/attack_1/sfx2.wav"), loadSound("assets/p1/attack_1/sfx3.wav")];
  
  p1_attack_2 = loadAnimation(imageSequence("assets/p1/attack_2/", 6))
  p1_attack_2.frameDelay = 4;
  p1_attack_2_sfx = [loadSound("assets/p1/attack_2/sfx1.wav"), loadSound("assets/p1/attack_2/sfx2.wav"), loadSound("assets/p1/attack_2/sfx3.wav")];
  
  p1_attack_3 = loadAnimation(imageSequence("assets/p1/attack_3/", 8));
  p1_attack_3.frameDelay = 4;
  p1_attack_3_sfx = loadSound("assets/p1/attack_3/sfx.wav");
  
  p1_attack_4 = loadAnimation(imageSequence("assets/p1/attack_4/", 6));
  p1_attack_4.frameDelay = 5;
  p1_attack_4_sfx = loadSound("assets/p1/attack_4/sfx.wav");
  
  p1_special_attack = loadAnimation(imageSequence("assets/p1/special_attack/", 8));
  p1_special_attack.frameDelay = 6;
  p1_special_attack_sfx = loadSound("assets/p1/special_attack/sfx.wav");
  
  p1_death = loadAnimation(imageSequence("assets/p1/death/", 6))
  p1_death.frameDelay = 8;
  p1_death_sfx = [loadSound("assets/p1/death/sfx1.wav"), loadSound("assets/p1/death/sfx2.wav")];
  
  p1_hurt = loadAnimation(imageSequence("assets/p1/hurt/", 6))
  p1_hurt.frameDelay = 4;
  p1_hurt_sfx = [loadSound("assets/p1/hurt/sfx1.wav"), loadSound("assets/p1/hurt/sfx2.wav"), loadSound("assets/p1/hurt/sfx3.wav")];
  
  p1_run = loadAnimation(imageSequence("assets/p1/run/", 6))
  
  p1_idle = loadAnimation(imageSequence("assets/p1/idle/", 4))
  p1_idle.frameDelay = 8;
  
  p1_win_sfx = loadSound("assets/p1/win/sfx.wav")
  
  //p2 Animations
  p2_attack_1 = loadAnimation(imageSequence("assets/p2/attack_1/", 6))
  p2_attack_1.frameDelay = 4;
  p2_attack_1_sfx = [loadSound("assets/p2/attack_1/sfx1.wav"), loadSound("assets/p2/attack_1/sfx2.wav"), loadSound("assets/p2/attack_1/sfx3.wav")];
  
  p2_attack_2 = loadAnimation(imageSequence("assets/p2/attack_2/", 6))
  p2_attack_2.frameDelay = 4;
  p2_attack_2_sfx = [loadSound("assets/p2/attack_2/sfx1.wav"), loadSound("assets/p2/attack_2/sfx2.wav"), loadSound("assets/p2/attack_2/sfx3.wav")];
  
  p2_attack_3 = loadAnimation(imageSequence("assets/p2/attack_3/", 8));
  p2_attack_3.frameDelay = 4;
  p2_attack_3_sfx = loadSound("assets/p2/attack_3/sfx.wav");
  
  p2_attack_4 = loadAnimation(imageSequence("assets/p2/attack_4/", 6));
  p2_attack_4.frameDelay = 5;
  p2_attack_4_sfx = loadSound("assets/p2/attack_4/sfx.wav");
  
  p2_special_attack = loadAnimation(imageSequence("assets/p2/special_attack/", 8));
  p2_special_attack.frameDelay = 6;
  p2_special_attack_sfx = loadSound("assets/p2/special_attack/sfx.wav");  
  
  p2_death = loadAnimation(imageSequence("assets/p2/death/", 6))
  p2_death.frameDelay = 12;
  p2_death_sfx = [loadSound("assets/p2/death/sfx1.wav"), loadSound("assets/p2/death/sfx2.wav")];
  
  p2_hurt = loadAnimation(imageSequence("assets/p2/hurt/", 6))
  p2_hurt.frameDelay = 4;
  p2_hurt_sfx = [loadSound("assets/p2/hurt/sfx1.wav"), loadSound("assets/p2/hurt/sfx2.wav"), loadSound("assets/p2/hurt/sfx3.wav")];
  
  p2_run = loadAnimation(imageSequence("assets/p2/run/", 6))
  p2_idle = loadAnimation(imageSequence("assets/p2/idle/", 4))
  p2_idle.frameDelay = 8;
  
  p2_win_sfx = loadSound("assets/p2/win/sfx.wav")
  
  // Background
  cityImg = loadImage("assets/city.png")
  
  // Music
  music = loadSound("assets/music.mp3");
  
}
// Setup
function setup() {
  new Canvas(1080, 1020);
  print(windowWidth, windowHeight)
  displayMode('centered')
  
  // p1 Setup
  p1 = new Sprite();  
  p1.w = CHAR_W;
  p1.h = CHAR_H;
  p1.x = width * 0.4;
  p1.y = height * 0.5;
  p1.rotationLock = true;
  p1.healthPoints = MAX_HEALTH;
  p1.hitTime = undefined;
  p1.specialAttackUsed = false;
  p1.hurt = {
    damage: 0,
    knockback: 0,
  }
  
  //Add animations
  p1.addAni('attack_1', p1_attack_1);
  p1.addAni('attack_2', p1_attack_2);
  p1.addAni('attack_3', p1_attack_3);
  p1.addAni('attack_4', p1_attack_4);
  p1.addAni('special_attack', p1_special_attack);
  p1.addAni('death', p1_death);
  p1.addAni('hurt', p1_hurt);
  p1.addAni('run', p1_run);
  p1.addAni('idle', p1_idle);
  
  p1.anis.death.looping = false;
  
  p1.delay = true;
  
  // Define Hitbox
  p1.hitbox = createSprite(p1.x + p1.w/2, p1.y, DEFAULT_HITBOX_W, 60);
  p1.hitbox.visible = SHOW_HITBOX;
  
  // Listen to events for p1
  p1.update = async function () {
    speed = 3;
    
    if (this.delay) return;
    
    //================================ Sample Code for Attacks (with explanations) ================================//
    /*
    if (kb.presses('x')) { // Check for input (keyboard, controllers, etc)
      this.hitTime = Math.floor(millis()); // Track hittime
      p1_attack_1_sfx[Math.floor(Math.random() * 3)].play(); // Play sound effect
      this.changeAni(['attack_1', 'idle']); // Run attack animation with idle after it
      !!! Formula to calculate duration taken from ChatGPT !!!
      let aniDuration = (6 * p1_attack_1.frameDelay) * (1000 / 60); // Estimate animation duration using: (totalFrame * frameDelay) * (1000ms / 60fps)
      let startTime = Date.now(); // Start a timer to count the animation duration
      this.delay = true; // Set delay to true to prevent other animation to take over
      
      // Check for collision or enemy hit while animation is running
      
      !!! while loop idea with Promise at the end referenced from ChatGPT !!!
      
      while (Date.now() - startTime < aniDuration) { // Stop loop until animation duration runs out
        // Only check for collision when frame it >= 4 (punch about to land)
        if (this.ani.frame >= 4) {
          this.hitbox.visible = SHOW_HITBOX; //debug purpose
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { // When frame is >= 4 check for collision and check if p2 is not hurt (to prevent repitition)
            if(this.hitTime < p2.hitTime || p2.hitTime == undefined || this.hitTime == p2.hitTime) { // if a collision is detected and p2 is not hurt, check for hitTime
              print('p1 Hits p2 with attack 1')
              p2.isHurt = true; // set p2 hurt flag to true
            }
          }
        }
        else {
          this.hitbox.visible = false; //debug purpose
        }
        // If player is hit while animating, break the animation | Should be placed after collision check to allow both players to get hurt when hitTime is equal
        if (this.isHurt) { // If enemy hit (p1 is hurt) // if (this.interrupt)
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          // Break the current animation and prepare hurt animation. Set the frame to 0 to let the hurt handler below to run the animation
          this.delay = false; // Set delay to false to allow hurt animation to take over
          //this.interrupt = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); // Prevents the code from freezing the browser from the while loop by pausing for a ~1 frame
      }
      //Add attack delay to avoid spamming
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); // Cooldown in ms
    }
    */
    //===================================================================================//
    
    //================================ Movement Controls ================================//    
    if (((contros[0] && contros[0].pressing('left')) || kb.pressing('a')) && this.hurt.damage == 0 && this.x - this.w / 2 > 0) {
      this.x -= speed; //Backward
    } 
    else if (((contros[0] && contros[0].pressing('right')) || kb.pressing('d')) && this.hurt.damage == 0 && this.x + this.w / 2 + p2.w < width) {
      this.x += speed; //Forward
      this.changeAni('run'); 
    } 
    //===================================================================================//
    
    //================================ Attack Controls ================================//
    // ATTACK_1
    else if ((contros[0] && contros[0].presses('x')) || kb.presses('q')) {
      this.hitTime = Math.floor(millis()); 
      print('p1 hittime: ', this.hitTime);
      p1_attack_1_sfx[Math.floor(Math.random() * 3)].play(); 
      this.changeAni(['attack_1', 'idle']);
      let aniDuration = (6 * p1_attack_1.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame >= 4 && this.ani.frame <= 5) {
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { 
            if(this.hitTime == p2.hitTime || this.hitTime < p2.hitTime || p2.hitTime == undefined) { 
              print('p1 Hits p2 with attack 1')
              p2.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_1,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    // ATTACK_2
    else if ((contros[0] && contros[0].presses('y')) || kb.presses('w')) {
      this.hitTime = Math.floor(millis()); 
      print('p1 hittime: ', this.hitTime);
      p1_attack_2_sfx[Math.floor(Math.random() * 3)].play(); 
      this.changeAni(['attack_2', 'idle']);
      let aniDuration = (6 * p1_attack_2.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 4) { // Stricly check collision at frame 4
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { 
            if(this.hitTime < p2.hitTime || p2.hitTime == undefined || this.hitTime == p2.hitTime) { 
              print('p1 Hits p2 with attack 1')
              p2.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_1,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    // ATTACK_3
    else if ((contros[0] && contros[0].presses('b')) || kb.presses('e')) {
      this.hitTime = Math.floor(millis()); 
      print('p1 hittime: ', this.hitTime);
      p1_attack_3_sfx.play(); 
      this.changeAni(['attack_3', 'idle']);
      let aniDuration = (8 * p1_attack_3.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame >= 3) { // Stricly check collision at frame 3 onwards
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { 
            if(this.hitTime < p2.hitTime || p2.hitTime == undefined || this.hitTime == p2.hitTime) { 
              print('p1 Hits p2 with attack 1')
              p2.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_2,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    // ATTACK_4
    else if ((contros[0] && contros[0].presses('a')) || kb.presses('r')) {
      this.hitTime = Math.floor(millis()); 
      print('p1 hittime: ', this.hitTime);
      p1_attack_4_sfx.play(); 
      this.changeAni(['attack_4', 'idle']);
      let aniDuration = (6 * p1_attack_4.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 3 || this.ani.frame == 4) { // Stricly check collision at frame 3 and 4
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { 
            if(this.hitTime < p2.hitTime || p2.hitTime == undefined || this.hitTime == p2.hitTime) { 
              print('p1 Hits p2 with attack 1')
              p2.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_2,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    // SPECIAL_ATTACK
    else if (((contros[0] && contros[0].presses('rt')) || kb.presses(' ')) && this.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !this.specialAttackUsed) {
      this.hitbox.w = 40;
      this.hitTime = Math.floor(millis()); 
      print('p1 hittime: ', this.hitTime);
      p1_special_attack_sfx.play(); 
      this.changeAni(['special_attack', 'idle']);
      let aniDuration = (8 * p1_special_attack.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 4 || this.ani.frame == 5 || this.ani.frame == 6) { // Stricly check collision at frame 4, 5, and 6
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p2) && !p2.isHurt) { 
            if(this.hitTime < p2.hitTime || p2.hitTime == undefined || this.hitTime == p2.hitTime) { 
              print('p1 Hits p2 with special attack')
              p2.hurt = {
                damage: (p2.healthPoints > 5 ? Math.floor(p2.healthPoints/2) : 2),
                knockback: ATTACK_PUSH_DISTANCE_3,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.hitbox.w = DEFAULT_HITBOX_W;
        this.specialAttackUsed = true;
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    //===================================================================================//
    
    //================================ Hurt Listener ================================//
    else if (this.hurt.damage != 0) {  
      this.changeAni(['hurt', 'idle']); 
      this.delay = true; 
      p1_hurt_sfx[Math.floor(Math.random() * 3)].play();
      
      // No need to add while loop as we are not checking anything while the hurt animation is running
    
      this.healthPoints -= this.hurt.damage;
      if(this.x - this.w / 2 - this.hurt.knockback > 0) { this.x -= this.hurt.knockback }
      else { this.x = this.w / 2; }
      
      setTimeout(() => {
        this.hurt = {
          damage: 0,
          knockback: 0,
        };
        this.delay = false;
        p2.delay = true;
        this.hitTime = undefined;
        if(this.healthPoints <= 0) { 
          this.delay = true;
          p1_death_sfx[Math.floor(Math.random() * 2)].play();
          this.changeAni('death');
          // To fix looping issue
          this.ani.frame = 0;
          this.ani.play()
          setTimeout(() => {
            gameState = 'end';
            p2.delay = true;
            if (p2.healthPoints > 0) {p2_win_sfx.play();}
          }, 1000)
        } 
      }, HURT_DELAY_DURATION); // Cooldown in ms
    }
    //===================================================================================//  
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
  p2.healthPoints = MAX_HEALTH;
  p2.hitTime = undefined;
  p2.hurt = {
    damage: 0,
    knockback: 0,
  }
  
  p2.addAni('attack_1', p2_attack_1);
  p2.addAni('attack_2', p2_attack_2);
  p2.addAni('attack_3', p2_attack_3);
  p2.addAni('attack_4', p2_attack_4);
  p2.addAni('special_attack', p2_special_attack);
  p2.addAni('death', p2_death);
  p2.addAni('hurt', p2_hurt);
  p2.addAni('run', p2_run);
  p2.addAni('idle', p2_idle);
  
  p2.anis.death.looping = false;
  
  // Delays needed to finish an animation / prevent action
  p2.delay = true;
  
  // Define Hitbox
  p2.hitbox = createSprite(p2.x - p2.w/2, p2.y, DEFAULT_HITBOX_W, 60);
  p2.hitbox.visible = SHOW_HITBOX;
    
  // Listen to events for p2
  p2.update = async function () {
    speed = 3;
    
    if (this.delay) return;
    
    //================================ Movement Controls ================================//
    if (((contros[1] && contros[1].pressing('left')) || kb.pressing(',')) && this.hurt.damage == 0 && this.x - this.w / 2 - p1.w > 0) {
      this.x -= speed; //Forward
      this.changeAni('run');
    } 
    else if (((contros[1] && contros[1].pressing('right')) || kb.pressing('.')) && this.hurt.damage == 0 && this.x + this.w / 2 < width) {
      this.x += speed; //Backward
    } 
    //===================================================================================//
    
    //================================ Attack Controls ================================//
    // ATTACK 1
    else if ((contros[1] && contros[1].presses('x')) || kb.presses('k')) {
      this.hitTime = Math.floor(millis()); 
      print('p2 hittime: ', this.hitTime);
      p2_attack_1_sfx[Math.floor(Math.random() * 3)].play(); 
      this.changeAni(['attack_1', 'idle']);
      let aniDuration = (6 * p2_attack_1.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame >= 4) {
          this.hitbox.visible = SHOW_HITBOX;
          if (this.hitbox.overlapping(p1) && !p1.isHurt) { 
            if(this.hitTime == p1.hitTime || this.hitTime < p1.hitTime || p1.hitTime == undefined) { 
              print('p2 Hits p1 with attack 1')
              p1.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_1,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    // ATTACK 2
    else if ((contros[1] && contros[1].presses('y')) || kb.presses('l')) {
      this.hitTime = Math.floor(millis()); 
      print('p2 hittime: ', this.hitTime);
      p2_attack_2_sfx[Math.floor(Math.random() * 3)].play(); 
      this.changeAni(['attack_2', 'idle']);
      let aniDuration = (6 * p2_attack_2.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 4) { // Strictly at frame 4
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p1) && !p1.isHurt) { 
            if(this.hitTime < p1.hitTime || p1.hitTime == undefined || this.hitTime == p1.hitTime) { 
              print('p2 Hits p1 with attack 2')
              p1.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_1,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }

    // ATTACK_3
    else if ((contros[1] && contros[1].presses('b')) || kb.presses(';')) {
      this.hitTime = Math.floor(millis()); 
      print('p2 hittime: ', this.hitTime);
      p2_attack_3_sfx.play(); 
      this.changeAni(['attack_3', 'idle']);
      let aniDuration = (8 * p2_attack_3.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame >= 3) { // Stricly check collision at frame 3 onwards
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p1) && !p1.isHurt) { 
            if(this.hitTime < p1.hitTime || p1.hitTime == undefined || this.hitTime == p1.hitTime) { 
              print('p2 Hits p1 with attack 3')
              p1.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_2,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }    
    
    // ATTACK_4
    else if ((contros[1] && contros[1].presses('a')) || kb.presses("'")) {
      this.hitTime = Math.floor(millis()); 
      print('p2 hittime: ', this.hitTime);
      p2_attack_4_sfx.play(); 
      this.changeAni(['attack_4', 'idle']);
      let aniDuration = (6 * p2_attack_4.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 3 || this.ani.frame == 4) { // Stricly check collision at frame 3 and 4
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p1) && !p1.isHurt) { 
            if(this.hitTime < p1.hitTime || p1.hitTime == undefined || this.hitTime == p1.hitTime) { 
              print('p2 Hits p1 with attack 4')
              p1.hurt = {
                damage: 1,
                knockback: ATTACK_PUSH_DISTANCE_2,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }
    
    // SPECIAL_ATTACK
    else if (((contros[1] && contros[1].presses('rt')) || kb.presses('enter')) && this.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !this.specialAttackUsed) {
      this.hitbox.w = 40;
      this.hitTime = Math.floor(millis()); 
      print('p2 hittime: ', this.hitTime);
      p2_special_attack_sfx.play(); 
      this.changeAni(['special_attack', 'idle']);
      let aniDuration = (8 * p2_special_attack.frameDelay) * (1000 / 60); 
      let startTime = Date.now(); 
      this.delay = true; 
      // Collision Detection
      while (Date.now() - startTime < aniDuration) {
        if (this.ani.frame == 4 || this.ani.frame == 5 || this.ani.frame == 6) { // Stricly check collision at frame 4, 5, and 6
          this.hitbox.visible = SHOW_HITBOX; 
          if (this.hitbox.overlapping(p1) && !p1.isHurt) { 
            if(this.hitTime < p1.hitTime || p1.hitTime == undefined || this.hitTime == p1.hitTime) { 
              print('p2 Hits p1 with special attack')
              p1.hurt = {
                damage: (p1.healthPoints > 5 ? Math.floor(p1.healthPoints/2) : 2),
                knockback: ATTACK_PUSH_DISTANCE_3,
              }
            }
          }
        }
        // else {
        //   this.hitbox.visible = false;
        // }
        if (this.hurt.damage != 0) { 
          this.changeAni('hurt'); 
          this.ani.frame = 0;
          this.delay = false; 
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 16)); 
      }
      // Attack Delay
      setTimeout(() => {
        this.hitbox.w = DEFAULT_HITBOX_W;
        this.specialAttackUsed = true;
        this.delay = false;
        this.hitTime = undefined;
      }, ATTACK_DELAY_DURATION); 
    }    
    
    //===================================================================================//
    
    //================================ Hurt Listener ================================//
    else if (this.hurt.damage != 0) {
      this.changeAni(['hurt', 'idle']); 
      this.delay = true; 
      p2_hurt_sfx[Math.floor(Math.random() * 3)].play();
      
      // No need to add while loop as we are not checking anything while the hurt animation is running
    
      this.healthPoints -= this.hurt.damage;
      if(this.x + this.width / 2 + this.hurt.knockback < width) { this.x += this.hurt.knockback; }
      else { this.x = width - this.w / 2; }
      
      setTimeout(() => {
        this.hurt = {
          damage: 0,
          knockback: 0,
        };
        this.delay = false;
        this.hitTime = undefined;
        if(this.healthPoints <= 0) { 
          this.delay = true;
          p1.delay = true;
          p2_death_sfx[Math.floor(Math.random() * 2)].play();
          this.changeAni('death');
          // To fix looping issue
          this.ani.frame = 0;
          this.ani.play();
          setTimeout(() => {
            gameState = 'end';
            p1.delay = true;
            if (p1.healthPoints > 0) {p1_win_sfx.play();}
          }, 1000)
        } 
      }, HURT_DELAY_DURATION); // Cooldown in ms
    }
    //===================================================================================//
    
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
  
  allSprites.debug = SHOW_HITBOX; // Set to false when playing
}

////////////////////////////////////////////////////
function draw() {   
  background('black')
  image(cityImg, 0, 0, width, height, 0, 0, cityImg.width, cityImg.height, CONTAIN);
  if (gameState == "intro") introGame();
  if (gameState == "run") runGame();  
  if (gameState == "end") endGame();  
}

function introGame() {
  
  fill('white');
  textFont("Arial");
  
  textSize(36);
  textAlign(CENTER);
  text("Press the start button to begin", width/2, height*0.15);
  
  drawTextInfo();
  
  if (keyIsPressed || (contros[0] && contros[0].presses('start')) || (contros[1] && contros[1].presses('start'))) {
    resetGameState()
  }
}

////////////////////////////////////////////////////
function runGame() {
  countdown();
    
  drawTextInfo();
  
  //Hitbox Behaviours
  p1.hitbox.x = p1.x + p1.w/2 + p1.hitbox.w/2 + 1; //Relative to p1
  p1.hitbox.y = p1.y;
  
  p2.hitbox.x = p2.x - p2.w/2 - p2.hitbox.w/2 - 1; //Relative to p2
  p2.hitbox.y = p2.y;
  
}

function endGame() {  
  p1.delay = true;
  p2.delay = true;
  
  noStroke();  
  fill('red');
  textAlign(CENTER);
  textSize(72);
  textFont("Arial");
  text("GAME OVER!!!", width/2, height*0.15);
  
  fill('white');
  textSize(24);
  textFont("Arial");
  wiiner = "";
  if (p1.healthPoints == p2.healthPoints) {
    winner = "Draw"
  }
  else if (p1.healthPoints > p2.healthPoints) {
    winner = "p1 Wins"
  }
  else (
    winner = "p2 Wins"
  )
  text(winner, width/2, height*0.20);
  text("Press start to try again", width/2, height*0.25);
  
  // Draw Health and Time
  drawHealthBar(p1.healthPoints, p2.healthPoints);
  
  if (keyIsPressed || (contros[0] && contros[0].presses('start')) || (contros[1] && contros[1].presses('start'))) {
    resetGameState();
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

function countdown() {
  if (millis() - lastTime >= 1000 && timer > 0) {
    timer--;
    lastTime = millis();
  }
  if(timer <= 0) {
    gameState = "end"
    p1.delay = true;
    p2.delay = true;
  }
}

function drawTextInfo() {
  fill('white');
  textSize(24);
  textFont("Arial");

  // Print Movesets
  if (contros[0]) {
    textAlign(CENTER)
    text("Left and Right to move\nX, Y, B, A to attack", width/2, height*0.20);
    
    // Print Special Attack
    fill('red');
    if (p1.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !p1.specialAttackUsed) {
      textAlign(LEFT)
      text(("Press RT for Special Attack"), 0, height*0.31);
    }
    if (p2.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !p2.specialAttackUsed) {
      textAlign(RIGHT)
      text(("Press RT for Special Attack"), width, height*0.31);
    }  
    fill('white');
  }
  else {
      textAlign(LEFT)
      text("Q, W, E, R to attack\nA and D to move", 0, height*0.25);
      if (p1.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !p1.specialAttackUsed) {
        fill('red');
        text(("Press Space for Special Attack"), 0, height*0.31);
        fill('white');
      }
      textAlign(RIGHT)
      text("K, L, ;, and ' to attack\n, and . to move", width, height*0.25);
      if (p2.healthPoints <= SPECIAL_ATTACK_MIN_HEALTH && !p2.specialAttackUsed) {
        fill('red');
        text(("Press Enter for Special Attack"), width, height*0.31);
        fill('white');
      }  
  }
  
  // Draw Health and Time
  drawHealthBar(p1.healthPoints, p2.healthPoints);
  
  textAlign(CENTER)
  timer <= 10 ? fill('red') : fill('white');
  text((timer), width*0.5, height*0.34);
}

function drawHealthBar(health_p1, health_p2) {
  // Background bar
  let barWidth = 300;
  let barHeight = 25;
  
  fill('gray');
  noStroke();
  rect(0, height*0.32, barWidth, barHeight, 5);
  rect(width - barWidth, height*0.32, barWidth, barHeight, 5);
  
  health_p1 <= SPECIAL_ATTACK_MIN_HEALTH ? fill('red') : fill('green');
  let p1HealthBar = barWidth * (health_p1 / MAX_HEALTH);
  rect(0, height*0.32, p1HealthBar, barHeight, 5);
  
  health_p2 <= SPECIAL_ATTACK_MIN_HEALTH ? fill('red') : fill('green');
  let p2HealthBar = barWidth * (health_p2 / MAX_HEALTH);
  rect(width - p2HealthBar, height*0.32, p2HealthBar, barHeight, 5);
}

function resetGameState() {
    p1.hurt = {
      damage: 0,
      knockback: 0,
    }
    p2.hurt = {
      damage: 0,
      knockback: 0,
    }
    p1.healthPoints = MAX_HEALTH;
    p2.healthPoints = MAX_HEALTH;
    p1.delay = false;
    p2.delay = false;
    p1.specialAttackUsed = false;
    p2.specialAttackUsed = false;
    p1.x = width * 0.4;
    p1.y = height * 0.5;
    p2.x = width * 0.6;
    p2.y = height * 0.5;
    timer = DURATION;
  
    music.stop();
    music.setVolume(0.5);
    music.play();
    gameState = "run";
}
