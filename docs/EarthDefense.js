"use strict";

const MOVE_STEP     = 2; // percent of the game area per key press
const CANNON_WIDTH  = 40; // width of the cannon sprite (triangle) in px
const CANNON_HEIGHT = 50; // height of the cannon sprite (triangle) in px

let canvas  = null;
let context = null;

let cannonLeft = 50; // percent of the game area (canvas width) the cannon base starts at


/*
 * Registers the game area canvas and starts the game loop when the window has loaded.
 */
window.addEventListener("load", function () {

    canvas  = document.getElementById("gameArea");
    context = canvas.getContext("2d");

    redrawGameArea(canvas, context);

    document.addEventListener("keydown", function (event) {

        handleKeydown(event, canvas, context);
    });
});

/*
 * Draws the cannon at its current position on the canvas.
 */
function drawCannon(canvas, ctx) {

    const baseX = (canvas.width * cannonLeft) / 100;
    const baseY = canvas.height; // base line rests on the bottom of the game area

    ctx.fillStyle = "#fff"; // pure white
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX + CANNON_WIDTH, baseY);
    ctx.lineTo(baseX + CANNON_WIDTH / 2, baseY - CANNON_HEIGHT);
    ctx.closePath();
    ctx.fill();
}

/*
 * Clears the game area and redraws the cannon.
 */
function redrawGameArea(canvas, ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCannon(canvas, ctx);
}

/*
 * Moves the cannon by the given delta and redraws the game area.
 */
function moveCannon(delta, canvas, ctx) {

    const maxCannonLeft = (canvas.width - CANNON_WIDTH) / canvas.width * 100;
    cannonLeft = Math.min(Math.max(cannonLeft + delta, 0), maxCannonLeft);
    redrawGameArea(canvas, ctx);
}

/*
 * Handles keyboard events and moves the cannon accordingly.
 */
function handleKeydown(event, canvas, ctx) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        moveCannon(-MOVE_STEP, canvas, ctx);

    } else if (event.key === "ArrowRight") {

        event.preventDefault();

        moveCannon(MOVE_STEP, canvas, ctx);
    }
}
