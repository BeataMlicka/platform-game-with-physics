//board size

size(1200,550);
var a = new PImage;
setup = function() {
    smooth();
    a = loadImage("back.jpg");
}
var currentScene = 0;
//--------------------------------------------------------------------------------------------------------------------//
//----------------------------------------- FUNCTIONS AND OBJECTS -------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//

var forceGravitation = new PVector();

//player variables

var Mover = function() {
    this.position = new PVector(50, 300); //player's start positions
    this.velocity = new PVector(0,0);
    this.acceleration = new PVector(0,0);
    this.friction = new PVector(0,0);
    this.air = new PVector(0,0);
    this.gravitation = new PVector(0,0);
    this.star = 0;
};

//draws player

Mover.prototype.display = function() {
    noStroke();
    fill(255, 255, 255);
    ellipse(this.position.x, this.position.y, 20, 20);
};

Mover.prototype.update = function() {

    this.acceleration.add(this.air);
    this.acceleration.add(this.friction);
    this.acceleration.add(this.gravitation);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.air.mult(0);
    this.friction.mult(0);
};

//************************************** GRAVITY CALCULATION FUNCTION ************************************************

Mover.prototype.gravitationForce = function() {
    this.gravitation.x = 0;
    this.gravitation.y = 0.1;
};

//************************************************ FRICTION FUNCTION ******************************************************

Mover.prototype.frictionForce = function(){
    var miu = 0.01;
    var N = 1;
    var frictionMag = miu * N;

    this.friction = this.velocity.get();

    this.friction.mult(-1);
    this.friction.normalize();
    this.friction.y = 0;
    this.friction.mult(frictionMag);
}

//****************************************** AERODYNAMIC POWER FUNCTIONS **********************************************

Mover.prototype.airForce = function() {
        var c = 0.01;
        var speed = this.velocity.mag();
        var airMagnitude = c * speed * speed;

        this.air = this.velocity.get();
        this.air.normalize();
        this.air.mult(-1);

        this.air.mult(airMagnitude);
};

// ************************************** FUNCTIONS CHECK BOARD LIMITS ***********************************************

Mover.prototype.checkFirstEdges = function(x0, y0, x1, y1){

    //top 
    if(this.position.y<10){
        this.acceleration.y = 0;
        this.position.y = 10;
    }

    //left
    if(this.position.x < 10){
        this.acceleration.x = 0;
        this.position.x = 10;
    }

    //right
    if(this.position.x > 1189){
        this.acceleration.x = 0;
        this.position.x = 1190;
    }

    if(this.position.y < 490 && this.position.y > 475 && this.position.x > 0 && this.position.x < 100){
        this.position.y = 485;  //start platform
        this.acceleration.y = 0;
        return true;
    }

    if(this.position.y < y0 - 10 && this.position.y > y0 -25 && this.position.x > x0 && this.position.x < x0 + 50) {
        this.position.y = y0 - 15;
        this.acceleration.y = 0;   //first moving platform
        return true;
    }

    if(this.position.y < 290 && this.position.y > 275 && this.position.x > 360 && this.position.x < 410){
        this.position.y = 285;  //first block - horizontal   //360,300, 50, 250
        this.acceleration.y = 0;
        return true;
    }

    if(this.position.y < 550 && this.position.y > 295 && this.position.x > 335 && this.position.x < 360){
        this.position.x = 345;  //first block - left  //360,300, 50, 250
        this.acceleration.x = 0;
        return true;
    }

    if(this.position.y < 550 && this.position.y > 295 && this.position.x > 410 && this.position.x < 435){
        this.position.x = 425; //first block - right //360,300, 50, 250
        this.acceleration.x = 0;
        return true;
    }

    if(this.position.y < 290 && this.position.y > 275 && this.position.x > 610 && this.position.x < 660){
        this.position.y = 285; //second block - horizontal
        this.acceleration.y = 0;  //610,300, 50, 250
        return true;
    }

    if(this.position.y < 550 && this.position.y > 295 && this.position.x > 585 && this.position.x < 610){
        this.position.x = 600;   //second block - left
        this.acceleration.x = 0;  //610,300, 50, 250
        return true;
    }

    if(this.position.y < 550 && this.position.y > 295 && this.position.x > 660 && this.position.x < 685){
        this.position.x = 675;   //second block - right
        this.acceleration.x = 0;  //610,300, 50, 250
        return true;
    }

    if(this.position.y < y1 - 10 && this.position.y > y1 -25 && this.position.x > x1 && this.position.x < x1 + 50) {
        this.position.y = y1 - 15;
        this.acceleration.y = 0;   //second moving platform
        return true;
    }

    if(this.position.y < 300 && this.position.y > 275 && this.position.x > 1150 && this.position.x < 1200){
        this.position.y = 285;  //finish platform
        this.acceleration.y = 0;
        return true;
    }
};


Mover.prototype.checkSecondEdges = function(x0, y0, x1, y1){


    if(this.position.y<10){
        this.acceleration.y = 0;
        this.position.y = 10;
    }

    if(this.position.x < 10){
        this.acceleration.x = 0;
        this.position.x = 10;
    }

    if(this.position.x > 1189){
        this.acceleration.x = 0;
        this.position.x = 1190;
    }

    if(this.position.y < 490 && this.position.y > 475 && this.position.x > 0 && this.position.x < 100){
        this.position.y = 485;  
        this.acceleration.y = 0;
        return true;
    }

    if(this.position.y < y0 - 10 && this.position.y > y0 -25 && this.position.x > x0 && this.position.x < x0 + 100) {
        this.position.y = y0 - 15;
        this.acceleration.y = 0;  
        return true;
    }

    if(this.position.y < y1 - 10 && this.position.y > y1 -25 && this.position.x > x1 && this.position.x < x1 + 100) {
        this.position.y = y1 - 15;
        this.acceleration.y = 0;   
        return true;
    }
    //400, 350
    if(this.position.y < 340 && this.position.y > 330 && this.position.x > 400 && this.position.x < 500){
        this.position.y = 335;  
        this.acceleration.y = 0;
        return true;
    }
    //680, 350
    if(this.position.y < 340 && this.position.y > 330 && this.position.x > 680 && this.position.x < 780){
        this.position.y = 335; 
        this.acceleration.y = 0;
        return true;
    }

    if(this.position.y < 490 && this.position.y > 475 && this.position.x > 1100 && this.position.x < 1200){
        this.position.y = 485;  
        this.acceleration.y = 0;
        return true;
    }
};

// ************************************************* PLATFORMS *********************************************************

var Platform = function(){
    this.position = new PVector(0,0);
};

Platform.prototype.display = function(x,y, width, height){
    this.position.x = x;
    this.position.y = y;
    fill(255, 0,0);
    noStroke();
    rect(this.position.x, this.position.y, width, height);
};

// ********************************************** FIRST MOVING PLATFORM ************************************************

var FirstMovingPlatform = function(){
    this.position = new PVector(200, 445);
};

FirstMovingPlatform.prototype.display = function(){
    fill(255, 0,0);
    noStroke();
    rect(this.position.x, this.position.y, 50, 10);
};

var SecondMovingPlatform = function(){
    this.position = new PVector(850, 445);
};

SecondMovingPlatform.prototype.display = function(){
    fill(255, 0,0);
    noStroke();
    rect(this.position.x, this.position.y, 50, 10);
};

var ThirdMovingPlatform = function(){
    this.position = new PVector(205, 450);
};

ThirdMovingPlatform.prototype.display = function(){
    fill(255, 0,0);
    noStroke();
    rect(this.position.x, this.position.y, 100, 10);
};

var FourthMovingPlatform = function(){
    this.position = new PVector(875, 450);
};

FourthMovingPlatform.prototype.display = function(){
    fill(255, 0,0);
    noStroke();
    rect(this.position.x, this.position.y, 100, 10);
};

//************************************************* SPIKES ***********************************************************

var Triangles = function () {
    this.firstPoint = new PVector();
    this.secondPoint = new PVector();
    this.thirdPoint = new PVector();
};

Triangles.prototype.draw = function(x1, y1){
    fill(255, 255, 255);
    this.firstPoint.x = x1;
    this.firstPoint.y = y1;
    this.secondPoint.x = x1 + 20;
    this.secondPoint.y = y1;
    this.thirdPoint.x = x1 + 10;
    this.thirdPoint.y = y1 - 30;
    triangle(this.firstPoint.x, this.firstPoint.y ,this.secondPoint.x, this.secondPoint.y, this.thirdPoint.x ,this.thirdPoint.y);
};

// ************************************************** DOOR ***********************************************************

var Gate = function(){
    this.positionBig = new PVector();
    this.positionSmall = new PVector();
};

Gate.prototype.display = function(x,y, width, height){
    this.positionBig.x = x;
    this.positionBig.y = y;
    fill(240, 220,0);
    rect(this.positionBig.x, this.positionBig.y, width, height);
    fill(0,0,0);
    rect(this.positionBig.x+5, this.positionBig.y+5, width-10, height-10);
};

// ***************************************************** TRAP **********************************************************

var Trap = function(){
    this.position = new PVector();
};

Trap.prototype.display = function(x,y){
    this.position.x = x;
    this.position.y = y;
    fill(230,0,0);
    rect(this.position.x, this.position.y, 40, 40);
    fill(255, 255, 255);
    triangle(this.position.x, this.position.y, this.position.x+10, this.position.y-15, this.position.x+20, this.position.y);//up1
    triangle(this.position.x+20, this.position.y, this.position.x+30, this.position.y-15, this.position.x+40, this.position.y);//up2
    triangle(this.position.x, this.position.y, this.position.x-15, this.position.y+10, this.position.x, this.position.y+20);//left1
    triangle(this.position.x, this.position.y+20, this.position.x-15, this.position.y+30, this.position.x, this.position.y+40);//left2
    triangle(this.position.x+40, this.position.y, this.position.x+55, this.position.y+10, this.position.x+40, this.position.y+20);//right1
    triangle(this.position.x+40, this.position.y+20, this.position.x+55, this.position.y+30, this.position.x+40, this.position.y+40);//right1
    triangle(this.position.x, this.position.y+40, this.position.x+10, this.position.y+55, this.position.x+20, this.position.y+40);//down1
    triangle(this.position.x+20, this.position.y+40, this.position.x+30, this.position.y+55, this.position.x+40, this.position.y+40);//up2
};

var SecondTrap = function(){
    this.position = new PVector(570, 100);
};

SecondTrap.prototype.display = function(){
    fill(230,0,0);
    rect(this.position.x, this.position.y, 40, 40);
    fill(255, 255, 255);
    triangle(this.position.x, this.position.y, this.position.x+10, this.position.y-15, this.position.x+20, this.position.y);//up1
    triangle(this.position.x+20, this.position.y, this.position.x+30, this.position.y-15, this.position.x+40, this.position.y);//up2
    triangle(this.position.x, this.position.y, this.position.x-15, this.position.y+10, this.position.x, this.position.y+20);//left1
    triangle(this.position.x, this.position.y+20, this.position.x-15, this.position.y+30, this.position.x, this.position.y+40);//left2
    triangle(this.position.x+40, this.position.y, this.position.x+55, this.position.y+10, this.position.x+40, this.position.y+20);//right1
    triangle(this.position.x+40, this.position.y+20, this.position.x+55, this.position.y+30, this.position.x+40, this.position.y+40);//right1
    triangle(this.position.x, this.position.y+40, this.position.x+10, this.position.y+55, this.position.x+20, this.position.y+40);//down1
    triangle(this.position.x+20, this.position.y+40, this.position.x+30, this.position.y+55, this.position.x+40, this.position.y+40);//up2
};


//--------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------  SCENS  ----------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//
var mover = new Mover();
var platform = new Platform();
var triangles = new Triangles();
var firstMP = new FirstMovingPlatform();
var secondMP = new SecondMovingPlatform();
var thirdMP = new ThirdMovingPlatform();
var fourthMP = new FourthMovingPlatform();
var gate = new Gate();
var trap = new Trap();
var trap2 = new SecondTrap();
var speed = 0.7;
var speed1 = -0.7;
var speed3 = 1;


var FirstScene = function(){
    background(0,0,0);
    fill(255, 255, 255);
    textSize(50);
    text("Jumping Ball", 450, height/2);
};

var GameOverScene = function(){
    background(0,0,0);
    fill(255, 255, 255);
    textSize(50);
    text("Koniec Gry! :(", 450, height/2);
};

var WinScene = function(){
    background(0,0,0);
    fill(255, 255, 255);
    textSize(50);
    text("Zwyciestwo! :))", 450, height/2);
};

var ThirdScene = function () {

    background(0, 0, 0);
    image( a, 0, 0, 1200, 550 );
    trap.display(570,420);
    if(mover.position.x >570 && mover.position.x < 660 && mover.position.y > 415){
        currentScene = 3;
    }

    //draws triangles
    var x1 = 0;
    for(var i = 0; i<60; i++){
        triangles.draw(x1,550);
        x1 += 20;
    }

    thirdMP.position.x += speed;
    thirdMP.display();
    if(thirdMP.position.x < 200){
        speed *= -1;
    }
    if(thirdMP.position.x > 330){
        speed *= -1;
    }

    fourthMP.position.x += speed1;
    fourthMP.display();
    if(fourthMP.position.x < 750){
        speed1 *= -1;
    }
    if(fourthMP.position.x > 880){
        speed1 *= -1;
    }

    trap2.position.y += speed3;
    trap2.display();
    if(trap2.position.y < 90){
        speed3 *= -1;
    }
    if(trap2.position.y > 350){
        speed3 *= -1;
    }
    if(mover.position.x > trap2.position.x-20 && mover.position.x < trap2.position.x+60
        && mover.position.y > trap2.position.y-20 && mover.position.y < trap2.position.y+60 ){
        currentScene = 3;
    }

    platform.display(0, 500, 100, 10); //start platform
    platform.display(400, 350, 100, 10); //first platform
    platform.display(680, 350, 100, 10); //second platform
    platform.display(1100, 500, 100, 10); //finish platform

    gate.display(1125,450,50,50);

    var ground = mover.checkSecondEdges(thirdMP.position.x, thirdMP.position.y, fourthMP.position.x, fourthMP.position.y);

    // ************* controlers *******************

    if (keyPressed && keyCode === LEFT) {
        mover.velocity.x -= 0.015;
        mover.acceleration.x -= 0.08;
    }
    if (keyPressed && keyCode === RIGHT) {
        mover.velocity.x += 0.015;
        mover.acceleration.x += 0.08;
    }
    if((ground === true) && keyPressed && keyCode === UP){
        mover.velocity.y -= 0.015;
        mover.acceleration.y -= 4.5;
    }
    else {
    }

    // ************* player *******************
    //friction
    if(ground === true){
        mover.frictionForce();
    }

    //forces calculation
    mover.airForce();
    mover.gravitationForce();
    mover.update();
    mover.display();

    if(mover.position.y > 520){
        currentScene = 3;
    }

    if(mover.position.x > 1125 && mover.position.x < 1175 && mover.position.y > 450 && mover.position.y < 500){
        WinScene();
    }
};

//second scene

var SecondScene = function(){
    background(0, 0, 0);
    image( a, 0, 0, 1200, 550 );
    gate.display(1150,250,50,50);

    //draws triangles
    var x1 = 0;
    for(var i = 0; i<18; i++){
        triangles.draw(x1,550);
        x1 += 20;
    }

    platform.display(0, 500, 100, 10); //1

    firstMP.position.y += speed;
    firstMP.display();
    if(firstMP.position.y < 200){
        speed *= -1;
    }
    if(firstMP.position.y > 450){
        speed *= -1;
    }

    platform.display(360,300, 50, 250); //2

    var x2 = 410;
    for(var i = 0; i<10; i++){
        triangles.draw(x2,550);
        x2 += 20;
    }

    platform.display(610,300, 50, 250); //2

    secondMP.position.y += speed;
    secondMP.display();
    if(secondMP.position.y < 200){
        speed *= -1;
    }
    if(secondMP.position.y > 450){
        speed *= -1;
    }

    var x4 = 660;
    for(var i = 0; i<27; i++){
        triangles.draw(x4,550);
        x4 += 20;
    }

    platform.display(1150, 300, 50, 10); 

    var ground = mover.checkFirstEdges(firstMP.position.x, firstMP.position.y, secondMP.position.x, secondMP.position.y);

    // ************* controlers *******************

    if (keyPressed && keyCode === LEFT) {
        mover.velocity.x -= 0.015;
        mover.acceleration.x -= 0.08;
    }
    if (keyPressed && keyCode === RIGHT) {
        mover.velocity.x += 0.015;
        mover.acceleration.x += 0.08;
    }
    if((ground === true) && keyPressed && keyCode === UP){
        mover.velocity.y -= 0.015;
        mover.acceleration.y -= 4.5;
    }
    else {
    }

    if(ground === true){
        mover.frictionForce();
    }

    mover.airForce();
    mover.gravitationForce();
    mover.update();
    mover.display();

    if(mover.position.y > 520){
        GameOverScene();
    }

    if(mover.position.x > 1150 && mover.position.y > 250 && mover.position.y < 300){
        mover.position.x = 50;
        mover.position.y = 300;
        mover.acceleration.y = 0;
        currentScene = 2;
    }
};



// ******************************************  MAIN FUNCTIONS ******************************************


draw = function() {

    if (currentScene === 1) {
        SecondScene();
    }
    if (currentScene === 2) {
        ThirdScene();
    }
    if (currentScene === 3) {
        GameOverScene();
    }
};

mouseClicked = function() {
    if (currentScene === 1) {
        drawScene2();
    } else if (currentScene === 3) {
        drawScene3();
    }
    currentScene += 1;
};

FirstScene();