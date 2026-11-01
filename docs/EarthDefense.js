"use strict";

const cannon = document.getElementById("cannon");
const MOVE_STEP = 2; // percent of the game area per key press

let cannonLeft = 50;

function moveCannon(delta) {
    cannonLeft = Math.min(Math.max(cannonLeft + delta, 5), 70);
    cannon.style.left = cannonLeft + "%";
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCannon(-MOVE_STEP);
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCannon(MOVE_STEP);
    }
});
