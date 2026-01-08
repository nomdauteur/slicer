var field;
var c; 
var ctx; 

var BACK_COLOR="rgba(0,0,50,255)";
var LINE_COLOR="rgba(255,255,205,255)";

var CIRCLE_RADIUS=vh(20);

var NUCLEUS = {
  x: vw(50),
  y: vh(45)
}

MOUSE_ANIMATE_TIME=-1000;

var SLICER = null;

var WIDTH=0;
var HEIGHT=0;


var isGameOn;

var level_no = 0;


function resize() {
  var w,h;

  if (window.innerWidth >= 9/16*window.innerHeight)
  {
    w = window.innerHeight * 9 / 16;
    h = window.innerHeight;
  }
  else {
    w = window.innerWidth;
    h = window.innerWidth * 16 / 9;
  } 
  WIDTH=w;
  HEIGHT=h * 9/16;

ctx = document.getElementById('canvas').getContext('2d');
ctx.font="bold 5vmin Arial";
document.getElementById('upper').style.top = 0 +"px";
document.getElementById('upper').style.left = (window.innerWidth-w)/2 +"px";
document.getElementById('upper').style.width = w +"px";
document.getElementById('upper').style.height = h * 3/16 +"px";


document.getElementById('canvas').style.width = w +"px";
document.getElementById('canvas').style.height = h * 9/16 +"px";
document.getElementById('canvas').width=WIDTH;
document.getElementById('canvas').height = HEIGHT;
document.getElementById('canvas').style.top = h*3/16 +"px";
document.getElementById('canvas').style.left = (window.innerWidth-w)/2 +"px";

document.getElementById('lower').style.width = w +"px";
document.getElementById('lower').style.height = h * 4/16 +"px";
document.getElementById('lower').style.top = h*12/16 +"px";
document.getElementById('lower').style.left = (window.innerWidth-w)/2 +"px";

NUCLEUS = {
  x: WIDTH/2,
  y: HEIGHT/2
}

CIRCLE_RADIUS = WIDTH/4;


}
window.addEventListener('load', load, false);



function load() {
  document.getElementById('body').style.color = LINE_COLOR;
   document.getElementById('lower').style.backgroundColor= BACK_COLOR;
   document.getElementById('upper').style.backgroundColor= BACK_COLOR;
   document.getElementById('canvas').style.backgroundColor= BACK_COLOR;
  resize();
  c = document.getElementById('canvas');
ctx = c.getContext('2d');
ctx.font="bold 5vmin Arial";
        
c.addEventListener('mouseup', throwSpear, false);
/*
window.addEventListener('mousemove', updateMouse, false);

window.addEventListener('touchmove', touchMoveMouse, false);
*/
         newGame();

}

function throwSpear() {
  if (!isGameOn) return;
  SLICER.catch();
  MOUSE_ANIMATE_TIME = Date.now();
  
}

function check() {
  isGameOn=false;
  document.getElementById("check").disabled="true";
  SLICER.getSlicing();
  var epsilon = 0.1;
  var precision=SLICER.checkPrecision(GOAL_SLICING, epsilon);
  if (precision.matched) {
    var extra_cuts;
    if (GOAL_SLICING.reduce((accumulator, currentValue) => {
  return accumulator + currentValue; }, 0) == 1) extra_cuts = precision.totalCuts - GOAL_SLICING.length;
    else extra_cuts = precision.totalCuts - GOAL_SLICING.length -1;
    console.log("You succeeded");
    document.getElementById("next").disabled="";
    var stars = Math.max(Math.ceil(5 - precision.precision * (5/epsilon))-extra_cuts,1);
    document.getElementById("score").style.display="block";
    document.getElementById("score").textContent="Ваш счет: " +String.fromCodePoint(11088).repeat(stars);
    document.getElementById("extra").style.display="block";
    document.getElementById("extra").textContent="Лишних разрезов: " +extra_cuts;
    console.log(precision.matches);
    
    console.log("Extra cuts: "+extra_cuts);
    console.log("Precision: "+precision.precision.toFixed(2));
  }
  else {
    document.getElementById("score").style.display="block";
    document.getElementById("score").textContent="Попробуйте еще раз";
    console.log("You failed");
    console.log(precision.matches);
  }
  

}

function retry() {
  newGame();
}

function next() {
  level_no+=1;
  newGame();
}

function calculateSlices(slices) {
  var displayable = [];
  var calculable = [];

  for (var i = 0; i < slices.length; i++) {
    displayable.push("1/"+slices[i]);
    calculable.push(1/slices[i]);
  }

  return {display: displayable, calculate: calculable}
}

function newGame() 
  {
    isGameOn=true;
    document.getElementById("score").style.display="none";
    document.getElementById("check").disabled="";
    document.getElementById("next").disabled="true";
    var level_iteration = level_no % levels.length;
    var speed_increaser = Math.floor(level_no / levels.length)+1;
    slices = calculateSlices(levels[level_iteration].slices);
    document.getElementById("level").textContent="Уровень "+(level_no+1);
    document.getElementById("goal").textContent="Разрезы: "+slices.display;
    document.getElementById("hint").innerHTML="<i>Кликните мышью внутри рамки, чтобы запустить копье</i>";
    GOAL_SLICING = slices.calculate;
    SLICER = new Slicer(levels[level_iteration].speed * speed_increaser, NUCLEUS, CIRCLE_RADIUS, WIDTH, HEIGHT);
c = document.getElementById('canvas');

ctx = c.getContext('2d');
ctx.font="bold 5vmin Arial";
draw();
  

update();

  }



function update() {
  if (!isGameOn) {
       isGameOn=false;

  
    
    return;
  }
  resize();
ctx = document.getElementById('canvas').getContext('2d');
ctx.font="bold 5vmin Arial";
SLICER.step();

draw();
     
    window.requestAnimationFrame(update);
}


function draw() {
ctx.clearRect(0, 0, WIDTH, HEIGHT);

ctx.fillStyle = BACK_COLOR;
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.font="5vmin Arial";

ctx.fillStyle = LINE_COLOR;
ctx.strokeStyle = LINE_COLOR;
ctx.lineWidth="10";
drawCircle(ctx,NUCLEUS.x, NUCLEUS.y, CIRCLE_RADIUS,null);
drawCircle(ctx,NUCLEUS.x, NUCLEUS.y, 5,null);

ctx.beginPath();
ctx.moveTo(0, HEIGHT); 
ctx.lineTo(WIDTH,HEIGHT);  
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0, 0); 
ctx.lineTo(0,HEIGHT);  
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0, 0); 
ctx.lineTo(WIDTH,0);  
ctx.stroke();

ctx.beginPath();
ctx.moveTo(WIDTH, 0); 
ctx.lineTo(WIDTH,HEIGHT);  
ctx.stroke(); 

SLICER.draw(ctx);


if (MOUSE_ANIMATE_TIME <0 || (Date.now()-MOUSE_ANIMATE_TIME) > 250) {
    drawCircle(ctx,WIDTH/2, HEIGHT, 20,null);

    drawCircle(ctx,WIDTH/2, HEIGHT - 20, 5,null);
}
}
