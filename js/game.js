// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//player status and direction
var dir = 'right'

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

//create bullet
function makeBullet(dir) {
	if(dir === "right"){
		// Hero image
		var bulletImage = new Image();
		bulletImage.src = "image/bullet/bullet_" + dir + ".png";
		ctx.drawImage(bulletImage, hero.x + 32, hero.y + 32);
	}
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


window.addEventListener('mousemove', draw, false);

var posX = 0;
var posY = 0;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    alert(evt.clientX - rect.left);
    posX = parseInt((evt.clientX - rect.left / 512)/32);
    posY = parseInt((evt.clientY - rect.top / 480)/32);   
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


function draw(e) {
    var pos = getMousePos(canvas, e);
	pos.x = posX;
	pos.y = posY;
}


// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		dir = "up";
		makeBullet(dir);
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		dir = "down";
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		dir = "left";
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		dir = "right";
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
		heroImage.src = "images/idle/idle_" + dir + "/survivor-idle_rifle_0.png";
	
	
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + posX + " " + posY, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
