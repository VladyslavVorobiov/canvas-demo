const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//drawFilledRect();
//drawUnfilledRect();

//drawFilledCircle();
//drawUnfilledCircle();

//drawTriangle();

//drawTextWithGradient();

//replaySavedDrawing();

function drawFilledRect() {
  const rectWidth = 100;
  const rectHeight = 200;

  // Sets the color used to fill the drawing
  ctx.fillStyle = "green";

  // Draws a "filled" rectangle
  ctx.fillRect(canvas.width/2, canvas.height/2, rectWidth, rectHeight);
}

function drawUnfilledRect() {
  const rectWidth = 100;
  const rectHeight = 200;

  // Sets the current line width
  ctx.lineWidth = 10;

  // Sets color for rect line
  ctx.strokeStyle = 'red';

  // Draws a "unfilled" rectangle
  ctx.strokeRect(canvas.width/2, canvas.height/2, rectWidth, rectHeight);
}

function drawFilledCircle() {
  const radius = 100;
  const startingAngle = 0;
  const endingAngle = Math.PI * 2;
  
  ctx.fillStyle = "blue";

  // Begins a path (or resets the current path)
  ctx.beginPath();

  ctx.arc(canvas.width/2, canvas.height/2, radius, startingAngle, endingAngle);
  
  // Fills the current drawing (path)
  ctx.fill();
}

function drawUnfilledCircle() {
  const radius = 100;
  const startingAngle = 0;
  const endingAngle = Math.PI * 2;

  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.arc(canvas.width/2, canvas.height/2, radius, startingAngle, endingAngle);
  
  // Draws defined path 
  ctx.stroke();
}

function drawTriangle() {
  const triangleSide = 100;

  ctx.lineWidth = 5;
  ctx.strokeStyle = 'orange';

  ctx.beginPath();

  // Moves the path to the specified point in the canvas, without creating a line
  ctx.moveTo(canvas.width/2, canvas.height/2);

  // Adds a new point and creates a line to that point from the last specified point
  ctx.lineTo(canvas.width/2 - triangleSide/2, canvas.height/2 + triangleSide);
  ctx.lineTo(canvas.width/2 + triangleSide/2, canvas.height/2 + triangleSide);

  // Creates a path from the current point back to the starting point
  ctx.closePath();

  ctx.stroke();
}

function drawTextWithGradient() {
  const text = "Meetup about Canvas";
  const textSize = ctx.measureText(text);
  const grad = ctx.createLinearGradient(canvas.width/2 - textSize.width, 0, canvas.width/2 + textSize.width, 0);

  grad.addColorStop('0', 'magenta');
  grad.addColorStop('.5', 'blue');
  grad.addColorStop('1', 'red');

  ctx.fillStyle = grad;

  ctx.font = '30px Roboto';
  
  ctx.fillText(text, canvas.width/2 - textSize.width, canvas.height/2);
}

function replaySavedDrawing() {
  let isMouseDown = false;
  const coords = [];
  const COORDS_KEY_LOCAL_STORAGE = 'coords';

  const keySave = 83;
  const keyReplay = 82;
  const keyClear = 67;

  ctx.lineWidth = 10 * 2;

  canvas.addEventListener('mousedown', function () {
    isMouseDown = true;
  });

  canvas.addEventListener('mouseup', function () {
    isMouseDown = false;
    ctx.beginPath();
    coords.push('mouseup');
  });

  canvas.addEventListener('mousemove', function (e) {

    if(isMouseDown) {
      coords.push([e.clientX, e.clientY]);

      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(e.clientX, e.clientY, 10, 0 , Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
  });

  document.addEventListener('keydown', function (e) {

    switch (e.keyCode) {
      case keySave:

        saveCoords(coords);
        console.log('Saved');
        break;

      case keyReplay:
      
        console.log('Replaying ...');

        const savedCoords = JSON.parse(localStorage.getItem(COORDS_KEY_LOCAL_STORAGE));
        clearCanvas(ctx, canvas);
        replayDrawing(ctx, savedCoords);
        break;

      case keyClear:
        
      coords.length = 0;  
      clearCanvas(ctx, canvas);
      console.log('Cleared');
        break;
    
      default:
        break;
    }
  });

  function saveCoords(coords) {
    localStorage.setItem(COORDS_KEY_LOCAL_STORAGE, JSON.stringify(coords));
  }

  function clearCanvas(ctx, canvas) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'black';
  }

  function replayDrawing(ctx, coords) {

    const timer = setInterval( () => {
      if(!coords.length) {
        clearInterval(timer);
        ctx.beginPath();
        return;
      }

      const currentCoord = coords.shift();
      const currentEvent = {
        clientX: currentCoord[0],
        clientY: currentCoord[1],
      };

      ctx.lineTo(currentEvent.clientX, currentEvent.clientY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(currentEvent.clientX, currentEvent.clientY, 10, 0 , Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(currentEvent.clientX, currentEvent.clientY);

    }, 30);
  }
}



