"use strict";

const DEFENDER_MOVE_STEP =  2; // percent of the game area per key press
const DEFENDER_WIDTH     = 40; // width of the defender sprite (triangle) in px
const DEFENDER_HEIGHT    = 50; // height of the defender sprite (triangle) in px

const SHOT_LENGTH     = 12; // length of a shot in px
const SHOT_SPEED      = 6;  // shot movement per animation frame in px

let canvas    = null;
let context2d = null;

let defenderLeft   = 50; // current horizontal position of the defender in percent of the game area
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

    document.querySelectorAll( "[data-control]" )
            .forEach( function ( control ) {

                control.addEventListener( "click", handleControlClick );
    });
});


/*
 * Handles clicks on the on-screen controls for moving the defender and firing shots.
 */
function handleControlClick( event ) {

    const control = event.currentTarget.dataset.control;

    performUserAction( control, canvas, context2d );
}


/*
 * Clears the game area and redraws the defender and active shots.
 */
function redrawGameArea( canvas, ctx ) {

    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    drawDefender( canvas, ctx );
    drawShots( ctx );
}


/*
 * Draws the defender at its current position on the canvas.
 */
function drawDefender( canvas, ctx ) {

    const baseX = ( canvas.width * defenderLeft ) / 100;
    const baseY =   canvas.height; // base line rests on the bottom of the game area

    ctx.fillStyle = "#fff"; // pure white
    ctx.beginPath();
    ctx.moveTo( baseX, baseY );
    ctx.lineTo( baseX + DEFENDER_WIDTH, baseY );
    ctx.lineTo( baseX + DEFENDER_WIDTH / 2, baseY - DEFENDER_HEIGHT );
    ctx.closePath();
    ctx.fill();
}


/*
 * Draws all active shots as short vertical lines.
 */
function drawShots( ctx ) {

    ctx.strokeStyle = "#fff";
    ctx.lineWidth   = 4;

    shotsArray.forEach( function ( shot ) {

        ctx.beginPath();
        ctx.moveTo( shot.x, shot.y );
        ctx.lineTo( shot.x, shot.y + SHOT_LENGTH );
        ctx.stroke();
    });
}


/*
 * Fires a shot from the defender's tip at its current horizontal position.
 */
function fireShot() {

    const shot = {
        x: ( canvas.width * defenderLeft ) / 100 + DEFENDER_WIDTH / 2,
        y:   canvas.height - DEFENDER_HEIGHT
    };

    shotsArray.push( shot );

    if ( animationFrame === null ) {

        animationFrame = window.requestAnimationFrame( animateShots );
    }
}


/*
 * Advances shots until they leave the top of the game area.
 */
function animateShots() {

    animationFrame = null;

    shotsArray.forEach( function ( shot ) {

        shot.y -= SHOT_SPEED;
    });
    shotsArray = shotsArray.filter( function ( shot ) { // remove shots that have left the game area

        return shot.y + SHOT_LENGTH >= 0;
    });

    redrawGameArea( canvas, context2d );

    if ( shotsArray.length > 0 ) {

        animationFrame =
            window.requestAnimationFrame( animateShots );
    }
}


/*
 * Moves the defender by the given delta and redraws the game area.
 *
 * @param {number} delta - The change in horizontal position (in percent of the game area);
 *                         positive values move the defender to the right, negative values
 *   move it to the left.
 */
function moveDefender( delta, canvas, ctx ) {

    const maxDefenderLeft = ( canvas.width - DEFENDER_WIDTH ) / canvas.width * 100;
    defenderLeft = Math.min( Math.max( defenderLeft + delta, 0 ), maxDefenderLeft );
    redrawGameArea( canvas, ctx );
}


/*
 * Handles keyboard events and moves the defender accordingly.
 */
function handleKeydown( event, canvas, ctx ) {

    if ( event.key === "ArrowLeft" ) {

        event.preventDefault();

        performUserAction( "left", canvas, ctx );

    } else if ( event.key === "ArrowRight" ) {

        event.preventDefault();

        performUserAction( "right", canvas, ctx );

    } else if ( event.key  === "ArrowUp" ||
                event.code === "Space"   ||
                event.key === " "
              ) {

        event.preventDefault();

        performUserAction( "fire", canvas, ctx );
    }
}


/*
 * Executes a control action from either a keyboard key or a tapped button.
 */
function performUserAction( control, canvas, ctx ) {

    if ( control === "left" ) {

        moveDefender( -DEFENDER_MOVE_STEP, canvas, ctx );

    } else if ( control === "right" ) {

        moveDefender( DEFENDER_MOVE_STEP, canvas, ctx );

    } else if ( control === "fire" ) {

        fireShot();
    }
}
