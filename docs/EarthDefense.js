"use strict";

const DEFENDER_MOVE_STEP =  2; // percent of the game area per key press
const DEFENDER_WIDTH     = 40; // width  of the defender sprite (triangle) in px
const DEFENDER_HEIGHT    = 50; // height of the defender sprite (triangle) in px

const ALIEN_SHIP_RADIUS = 15; // radius of an alien ship (ball) in px
const ALIEN_SHIP_SPEED  = 20; // alien ship movement per second in px
const ALIEN_SHIP_ACCELERATION = 1; // increase in alien ship speed per second squared in px

const SHOT_LENGTH =  12; // length of a shot in px
const SHOT_SPEED  = 360; // shot movement per second in px

let canvas    = null;
let context2d = null;
let aliensShotDownDisplay = null;
let aliensShotDown = 0;

let defenderLeft = 50; // current horizontal position of the defender in percent of the game area

let animationFrame    = null;
let lastAnimationTime = null;
let alienShipSpeed    = ALIEN_SHIP_SPEED;

let shotsArray     = [];
let alienShipArray = [];

let gameOver = false;


/*
 * Registers the game area canvas and starts the game loop when the window has loaded.
 */
window.addEventListener( "load", function () {

    canvas    = document.getElementById( "gameArea" );
    context2d = canvas.getContext( "2d" );
    aliensShotDownDisplay = document.getElementById( "aliensShotDown" );

    initAlienShips( canvas );
    redrawGameArea( canvas, context2d );

    animationFrame = window.requestAnimationFrame( gameLoop );

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
    drawAlienShips( ctx );
    drawDefender( canvas, ctx );
    drawShots( ctx );
}


/*
 * Creates three alien ships, evenly distributed horizontally near the top of the game area.
 */
function initAlienShips( canvas ) {

    alienShipArray = [];

    for ( let i = 1; i <= 3; i++ ) {

        const alienShip = {
            x: canvas.width      * i / 4,
            y: ALIEN_SHIP_RADIUS * 2
        };

        alienShipArray.push( alienShip );
    }
}


/*
 * Draws all alien ships as filled balls.
 */
function drawAlienShips( ctx ) {

    ctx.fillStyle = "#fff";

    alienShipArray.forEach( function ( ship ) {

        ctx.beginPath();
        ctx.arc( ship.x, ship.y, ALIEN_SHIP_RADIUS, 0, Math.PI * 2 );
        ctx.fill();
    });
}


/*
 * Draws the defender at its current position on the canvas.
 */
function drawDefender( canvas, ctx ) {

    const baseX = ( canvas.width * defenderLeft ) / 100;
    const baseY =   canvas.height; // base line rests on the bottom of the game area

    ctx.fillStyle = "#fff"; // pure white
    ctx.beginPath();
    ctx.moveTo( baseX                     , baseY                   );
    ctx.lineTo( baseX + DEFENDER_WIDTH    , baseY                   );
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
}


/*
 * Removes shots that hit an alien ship and respawns each hit ship above the canvas.
 */
function handleShotHits( canvas ) {

    shotsArray = shotsArray.filter( function ( shot ) {

        const hitShip = alienShipArray.find( function ( ship ) {

            return shot.x >= ship.x - ALIEN_SHIP_RADIUS &&
                   shot.x <= ship.x + ALIEN_SHIP_RADIUS &&
                   shot.y <= ship.y + ALIEN_SHIP_RADIUS &&
                   shot.y + SHOT_LENGTH >= ship.y - ALIEN_SHIP_RADIUS;
        });

        if ( hitShip === undefined ) {

            return true;
        }

        aliensShotDown++;
        aliensShotDownDisplay.textContent = aliensShotDown;

        let newX = hitShip.x;

        while ( newX === hitShip.x ) {

            newX = ALIEN_SHIP_RADIUS +
                   Math.random() * ( canvas.width - 2 * ALIEN_SHIP_RADIUS );
        }

        hitShip.x = newX;
        hitShip.y = -2 * ALIEN_SHIP_RADIUS;

        return false;
    });
}


/*
 * Game loop: advances shots and alien ships, and ends the game when an alien ship touches the ground.
 */
function gameLoop( timestamp ) {

    const elapsedTime = lastAnimationTime === null
        ? 0
        : ( timestamp - lastAnimationTime ) / 1000;
    lastAnimationTime = timestamp;
    alienShipSpeed += ALIEN_SHIP_ACCELERATION * elapsedTime;

    shotsArray.forEach( function ( shot ) {

        shot.y -= SHOT_SPEED * elapsedTime;
    });
    shotsArray = shotsArray.filter( function ( shot ) { // remove shots that have left the game area

        return shot.y + SHOT_LENGTH >= 0;
    });

    alienShipArray.forEach( function ( ship ) {

        ship.y += alienShipSpeed * elapsedTime;
    });

    handleShotHits( canvas );

    alienShipArray.forEach( function ( ship ) {

        if ( ship.y + ALIEN_SHIP_RADIUS >= canvas.height ) {

            gameOver = true;
        }
    });

    redrawGameArea( canvas, context2d );

    if ( gameOver ) {

        drawGameOver( canvas, context2d );

    } else {

        animationFrame = window.requestAnimationFrame( gameLoop );
    }
}


/*
 * Draws the game-over message and restart instruction in the center of the game area.
 */
function drawGameOver( canvas, ctx ) {

    ctx.fillStyle    = "#f00";
    ctx.font         = "bold 48px sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 2 );

    ctx.fillStyle = "#fff";
    ctx.font      = "20px sans-serif";
    ctx.fillText( "Press SPACE to play another round", canvas.width / 2, canvas.height / 2 + 56 );
}


/*
 * Resets the game state and starts a new round.
 */
function restartGame( canvas, ctx ) {

    defenderLeft      = 50;
    shotsArray        = [];
    lastAnimationTime = null;
    alienShipSpeed    = ALIEN_SHIP_SPEED;
    gameOver          = false;
    aliensShotDown    = 0;
    aliensShotDownDisplay.textContent = aliensShotDown;

    initAlienShips( canvas );
    redrawGameArea( canvas, ctx );
    animationFrame = window.requestAnimationFrame( gameLoop );
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

    } else if ( event.key === "ArrowUp" ) {

        event.preventDefault();

        performUserAction( "fire", canvas, ctx );

    } else if ( event.code === "Space" || event.key === " " ) {

        event.preventDefault();

        if ( gameOver ) {

            restartGame( canvas, ctx );

        } else {

            performUserAction( "fire", canvas, ctx );
        }
    }
}


/*
 * Executes a control action from either a keyboard key or a tapped button.
 */
function performUserAction( control, canvas, ctx ) {

    if ( gameOver ) {

        return;
    }

    if ( control === "left" ) {

        moveDefender( -DEFENDER_MOVE_STEP, canvas, ctx );

    } else if ( control === "right" ) {

        moveDefender( DEFENDER_MOVE_STEP, canvas, ctx );

    } else if ( control === "fire" ) {

        fireShot();
    }
}
