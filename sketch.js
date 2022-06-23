
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var fairy,fairy_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var mGroup,m1,m2,m3, m4;
var backgroundImg
var score=0;

var gameOver, restart;


function preload(){
 
  backgroundImg = loadImage("backgroundImg.png")
 
  fairyImg = loadImage("fairy.png");

  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
m1 = loadImage("m1.png");
 m2 = loadImage("m2.png");
m3 = loadImage("m3.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  
  fairy = createSprite(50,height-70,30,100);
  fairy.addImg(fairyImg);
  fairy.setCollider('circle',0,0,350)
  fairy.scale = 0.2
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  mGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && fairy.y  >= height-120) {
    
      fairy.velocityY = -10;
       touches = [];
    }
    
    fairy.velocityY = fairy.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2; 
    }
  
    fairy.collide(invisibleGround);
    spawnClouds();
    spawnm();
  
    if(mGroup.isTouching(fairy)){
      
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    fairy.velocityY = 0;
   mGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    fairy.changeImage("collided",fairy_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    mGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = fairy.depth;
    fairy.depth = fairy.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var m = createSprite(600,height-95,20,30);
    m.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
   m.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: m.addImage(m1);
              break;
      case 2: m.addImage(m2);
              break;
              case 3: m.addImage(m3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    m.scale = 0.3;
    m.lifetime = 300;
   m.depth = fairy.depth;
    fairy.depth +=1;
    //add each obstacle to the group
  mGroup.add(m);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
m.Group.destroyEach();
  cloudsGroup.destroyEach();
  
  fairy.changeImage("running",fairyImg);
  
  score = 0;
  
}
