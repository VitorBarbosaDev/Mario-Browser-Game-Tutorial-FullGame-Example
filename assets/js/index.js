// Select the canvas element from the HTML document
const canvas = document.querySelector('canvas');

// Get the 2D rendering context for the canvas
const c = canvas.getContext('2d');

// Set the canvas width and height to match the window's inner width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Log the context to the console for debugging
console.log(c);

// Define the gravity constant for the game
const gravity = .5;

// Define the Player class
class Player {
	constructor() {
		// Initialize the player's position, velocity, dimensions, and color
		this.position = {x: 100, y: 100};
		this.velocity = {x: 0, y: 0};
		this.width = 30;
		this.height = 30;
		this.color = 'red';
	}

	// Define the draw method to draw the player on the canvas
	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	// Define the update method to update the player's position and velocity
	update() {
		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x; 
		
		this.checkBounds()
	}
	
	checkBounds(){
		// Define the padding
		const padding = 5;

		// If the player is not at the bottom of the canvas, apply gravity
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity;
		}
		// If the player is at the bottom of the canvas, set the vertical velocity to 0
		else {
			this.velocity.y = 0;
		}
		// If the player is not at the left or right edge of the canvas, apply horizontal velocity
		if (this.position.x + this.width + this.velocity.x <= canvas.width - padding && this.position.x + this.velocity.x >= padding) {
			this.velocity.x += 0;
		}
		// If the player is at the left or right edge of the canvas, set the horizontal velocity to 0
		else {
			this.velocity.x = 0;
		}
	}

	moveRight() {
		const padding = 5;
		this.velocity.x = 5;
		this.checkBounds();
		if (this.position.x + this.width > canvas.width - padding) {
			this.velocity.x = 0;
		}
	}

	moveLeft() {
		const padding = 5;
		this.velocity.x = -5;
		this.checkBounds();
		if (this.position.x < padding) {
			this.velocity.x = 0;
		}
	}


}

// Create a new player
const player = new Player();

// Update the player's state
player.update();

// Define the animate function to update the game state and redraw the canvas
function animate() {
	// Request the next animation frame
	requestAnimationFrame(animate);
	// Clear the canvas
	c.clearRect(0, 0, canvas.width, canvas.height);
	// Update the player's state
	player.update();
}

// Start the animation loop
animate();


window.addEventListener('keydown', (event) => {
	// If the player presses the space bar, jump
	if (event.code === 'Space') {
		player.velocity.y = -10;
	}
	else if (event.code === 'KeyA') {
		player.moveLeft();
	}
	else if (event.code === 'KeyD') {
		player.moveRight();
	}
});