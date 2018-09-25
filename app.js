/* 2D Cellular Automata with Constant Boundaries (Edges) 
 * Implemented using Conway's Game of Life rules
 */
window.onload = init;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

//changeable variables
var run = false;
var cyclic = false;

// Our 2D grid data
let cells, nextGen;

let w = window.innerWidth;
let h = window.innerHeight;
let cellWidth = 10;

// Function for creating Grid objects using Object Literal
let createGrid = (rows, cols) => {
  // create 2d array filled with 0's
  let data = Array.from({length: rows}, () => Array.from({length: cols}, () => 0));
  let result = { rows, cols, data};
  return result; 
}

function init(){
  document.querySelector('#startButton').onclick = startGame;
  document.querySelector('#stopButton').onclick = stopGame;
  document.querySelector('#next').onclick = next;
  document.querySelector('#clear').onclick = clear;
  document.querySelector('#random').onclick = random;
  document.querySelector('#cyclic').onchange = setEdge;
}
//Control functions/////////////////////////////////////
function startGame(){
  run = true;
  console.log('started');
}

function stopGame(){
  run = false;
  console.log('stopped');
}

function setEdge(){
  console.log('cyclic');
  if(cyclic){
    cyclic = false;
  } else{
    cyclic = true;
  }
}

function next(){
  run = false;
  computeNextGeneration();
}

function clear(){
  for(let y = 0; y < cells.rows; y++) {
    let row = cells.data[y];
    for(let i = 0; i < row.length; i++) {
      row[i] = 0;
    }
  }
}

function random(){
  for(let y = 0; y < cells.rows; y++) {
    let row = cells.data[y];
    for(let i = 0; i < row.length; i++) {
      row[i] = (Math.random() < 0.25) ? 1 : 0;
    }
  }
}

function getMouse(e){
  var mouse = {} //make object
  mouse.x = e.pageX - e.target.offsetLeft;
  mouse.y = e.pageY - e.target.offsetTop;
  return mouse;
}

function cellClicked(x,y, point){
  if(cellWidth <= 0 || cellWidth <=0 ){
    return false;
  }

  return (point.x >= x && point.x <= x + cellWidth && point.y >= y && point.y <= y + cellWidth);
}

//end Control functions/////////////////////////////////////

function updateCanvasSize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,w,h);
  
  let rows = Math.floor(h / cellWidth);
  let cols = Math.floor(w / cellWidth);
  cells = createGrid(rows, cols); 
  nextGen = createGrid(rows, cols); 

  // Randomize cells for initial state
  for(let y = 0; y < cells.rows; y++) {
    let row = cells.data[y];
    for(let i = 0; i < row.length; i++) {
      row[i] = (Math.random() < 0.25) ? 1 : 0;
    }
  }

  document.addEventListener('click', function(e) {
    var mouse = getMouse(e);
    console.log("mouse clicked at " + mouse.x + "," + mouse.y);

    console.log(cellClicked(400,400,mouse));

    for(let y = 0; y < cells.rows; y++) {
      for(let x = 0; x < cells.cols; x++) {
        if(cellClicked(x,y,mouse)){
          cells.data[y][x] += 1
          console.log("inside loops ran");
        }
      }
    }
  })
}
updateCanvasSize();

/* Conway's Game of Life processing rule for a 
   3x3 Neighborhood of Cells */
function processRule(grid, row, col) {
  let currentCell = grid.data[row][col];
  let liveNeighbors = 0;

  if(cyclic){
    // calculate indices for cyclic wrapping
    let row0 = row - 1, row2 = row + 1;
    let col0 = col - 1, col2 = col + 1;

    let rowLen = grid.data.length;
    let colLen = grid.data[0].length;

    if(row0 < 0) { row0 = rowLen - 1; }
    if(row2 >= rowLen) { row2 = 0; }
    if(col0 < 0) { col0 = colLen - 1; }
    if(col2 >= colLen) { col2 = 0; }

    // 1. Calculate Neighborhood state surrounding the current cell
    liveNeighbors += grid.data[row0][col0];
    liveNeighbors += grid.data[row0][col];
    liveNeighbors += grid.data[row0][col2]; 
    liveNeighbors += grid.data[row][col0];
    liveNeighbors += grid.data[row][col2]; 
    liveNeighbors += grid.data[row2][col0];
    liveNeighbors += grid.data[row2][col];
    liveNeighbors += grid.data[row2][col2]; 

    // 2. evaluate Game of Life Rules
    let result = currentCell; // default to stasis

    if(currentCell == 1) {
      if(liveNeighbors >= 4 || liveNeighbors <= 1) {
        //result = 0;
        if(result = 0){
          result = 0;
        }
        else{
            result += -1;
        }
      }
    } else if (liveNeighbors == 3) { 
      //result = 1;
      if(result < 5){
        result += 1;
      }
      else if(result == 5){
        result = 0;
      }
    }

    return result;
  }else{ ///constant edge
    liveNeighbors += grid.data[(row - 1 + cells.rows) % cells.rows][(col - 1 + cells.cols) % cells.cols];
    liveNeighbors += grid.data[(row - 1 + cells.rows) % cells.rows][col];
    liveNeighbors += grid.data[(row - 1 + cells.rows) % cells.rows][(col + 1 + cells.cols) % cells.cols]; 
    liveNeighbors += grid.data[row][(col - 1 + cells.cols) % cells.cols];
    liveNeighbors += grid.data[row][(col + 1 + cells.cols)%cells.cols]; 
    liveNeighbors += grid.data[(row + 1 + cells.rows) % cells.rows][(col - 1 + cells.cols) % cells.cols];
    liveNeighbors += grid.data[(row + 1 + cells.rows) % cells.rows][col];
    liveNeighbors += grid.data[(row + 1 + cells.rows) % cells.rows][(col + 1 + cells.cols) % cells.cols]; 

    // 2. evaluate Game of Life Rules
    let result = currentCell; // default to stasis

    if(currentCell == 1) {
      if(liveNeighbors >= 4 || liveNeighbors <= 1) {
        //result = 0;
        if(result = 0){
          result = 0;
        }
        else{
            result += -1;
        }
      }
    } else if (liveNeighbors == 3) { 
      //result = 1;
      result = 1;
      if(result < 5){
        result += 1;
      }
      else if(result = 5){
        result = 0;
      }
    } 

    return result;
  }


}

function computeNextGeneration() {

  if(cyclic){
    for(y = 0; y < cells.rows; y++) {
      for(x = 0; x < cells.cols; x++) {
        nextGen.data[y][x] = processRule(cells, y, x);
      }
    }
  } else {
    for(y = 1; y < cells.rows-1; y++) {
      for(x = 1; x < cells.cols-1; x++) {
        nextGen.data[y][x] = processRule(cells, y, x);
      }
    }
  }
  

  // swap grid objects 
  let temp = cells;
  cells = nextGen;
  nextGen = temp;
}

function draw(timeStamp) {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0,0,w,h);

  // draw current generation of cells 
  ctx.fillStyle = 'lightgreen';
  for(let y = 0; y < cells.rows; y++) {
    for(let x = 0; x < cells.cols; x++) {

      if(cells.data[y][x] == 1) {
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth); 
      }
    }
  }

  ctx.fillStyle = 'limegreen';
  for(let y = 0; y < cells.rows; y++) {
    for(let x = 0; x < cells.cols; x++) {

      if(cells.data[y][x] == 2) {
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth); 
      }
    }
  }

  ctx.fillStyle = 'green';
  for(let y = 0; y < cells.rows; y++) {
    for(let x = 0; x < cells.cols; x++) {

      if(cells.data[y][x] == 3) {
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth); 
      }
    }
  }

  ctx.fillStyle = 'darkgreen';
  for(let y = 0; y < cells.rows; y++) {
    for(let x = 0; x < cells.cols; x++) {

      if(cells.data[y][x] == 4) {
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth); 
      }
    }
  }

  if(run){
    computeNextGeneration();
  }
}

let counter = 0;
function animate(t) {
  // use modulus and check to divide the frame rate 
  if(counter % 2 == 0) {
    draw();
  } 

  counter += 1;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener('resize', updateCanvasSize);

///sliding nav functions///////////////////////////
//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_push
function openNav() {
  document.getElementById("controls").style.width = "200px";
  document.getElementById("controls").style.paddingLeft = "20px";
  document.getElementById("main").style.marginLeft = "200px";
}

function closeNav() {
  document.getElementById("controls").style.width = "0";
  document.getElementById("controls").style.paddingLeft = "0px";
  document.getElementById("main").style.marginLeft= "0";
}
//////////////////////////////////////////////////