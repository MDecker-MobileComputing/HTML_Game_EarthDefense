"use strict";

const MOVE_STEP     = 2; // percent of the game area per key press
const CANNON_WIDTH  = 40; // width of the cannon sprite (triangle) in px
const CANNON_HEIGHT = 50; // height of the cannon sprite (triangle) in px
const SHOT_LENGTH   = 12; // length of a projectile in px
const SHOT_SPEED    = 6; // projectile movement per animation frame in px

let canvas    = null;
let context2d = null;

let cannonLeft     = 50; // current horizontal position of the cannon in percent of the game area
let shotsArray     = [];
let animationFrame = null;


/*
 * Registers the game area canvas and starts the game loop when the window has loaded.
 */
window.addEventListener( "load", function () {

    canvas    = document.getElementById( "gameArea" );
    context2d = canvas.getContext( "2d" );

    redrawGameArea( canvas, context2d );

    document.addEventListener( "keydown", function ( event ) {

        handleKeydown( event, canvas, context2d );
    });
});


/*
 * Draws the cannon at its current position on the canvas.
 */
function drawCannon( canvas, ctx ) {

    const baseX = ( canvas.width * cannonLeft ) / 100;
    const baseY = canvas.height; // base line rests on the bottom of the game area

    ctx.fillStyle = "#fff"; // pure white
    ctx.beginPath();
    ctx.moveTo( baseX, baseY );
    ctx.lineTo( baseX + CANNON_WIDTH, baseY );
    ctx.lineTo( baseX + CANNON_WIDTH / 2, baseY - CANNON_HEIGHT );
    ctx.closePath();
    ctx.fill();
}


/*
 * Draws all active projectiles as short vertical lines.
 */
function drawShots( ctx ) {

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;

    shotsArray.forEach( function ( shot ) {

        ctx.beginPath();
        ctx.moveTo( shot.x, shot.y );
        ctx.lineTo( shot.x, shot.y + SHOT_LENGTH );
        ctx.stroke();
    });
}


/*
 * Clears the game area and redraws the cannon and active projectiles.
 */
function redrawGameArea( canvas, ctx ) {

    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    drawCannon( canvas, ctx );
    drawShots( ctx );
}


/*
 * Advances projectiles until they leave the top of the game area.
 */
function animateShots() {

    animationFrame = null;

    shotsArray.forEach( function ( shot ) {

        shot.y -= SHOT_SPEED;
    });
    shotsArray = shotsArray.filter( function ( shot ) {

        return shot.y + SHOT_LENGTH >= 0;
    });

    redrawGameArea( canvas, context2d );

    if ( shotsArray.length > 0 ) {

        animationFrame = window.requestAnimationFrame( animateShots );
    }
}


/*
 * Fires a projectile from the cannon's tip at its current horizontal position.
 */
function fireShot() {

    shotsArray.push( {
        x: ( canvas.width * cannonLeft ) / 100 + CANNON_WIDTH / 2,
        y: canvas.height - CANNON_HEIGHT
    } );

    if ( animationFrame === null ) {

        animationFrame = window.requestAnimationFrame( animateShots );
    }
}


/*
 * Moves the cannon by the given delta and redraws the game area.
 */
function moveCannon( delta, canvas, ctx ) {

    const maxCannonLeft = ( canvas.width - CANNON_WIDTH ) / canvas.width * 100;
    cannonLeft = Math.min( Math.max( cannonLeft + delta, 0 ), maxCannonLeft );
    redrawGameArea( canvas, ctx );
}


/*
 * Handles keyboard events and moves the cannon accordingly.
 */
function handleKeydown( event, canvas, ctx ) {

    if ( event.key === "ArrowLeft" ) {

        event.preventDefault();

        moveCannon( -MOVE_STEP, canvas, ctx );

    } else if ( event.key === "ArrowRight" ) {

        event.preventDefault();

        moveCannon( MOVE_STEP, canvas, ctx );

    } else if ( event.key === "ArrowUp" || event.code === "Space" || event.key === " " ) {

        event.preventDefault();

        fireShot();
    }
}
