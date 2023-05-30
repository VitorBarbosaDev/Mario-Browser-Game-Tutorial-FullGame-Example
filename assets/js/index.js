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
class Player
{
	constructor()
	{
		// Initialize the player's position, velocity, dimensions, and color
		this.position = {x: 100, y: 100};
		this.velocity = {x: 0, y: 0};
		this.width = 30;
		this.height = 30;
		this.color = 'red';
	}

	// Define the draw method to draw the player on the canvas
	draw()
	{
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	// Define the update method to update the player's position and velocity
	update()
	{
		this.draw();
		this.checkBounds();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
	}

	checkBounds()
	{

		// If the player is not at the bottom of the canvas, apply gravity
		if (this.position.y + this.height + this.velocity.y <= canvas.height)
			{
				this.velocity.y += gravity;
			}
		// If the player is at the bottom of the canvas, set the vertical velocity to 0
		else
			{
				this.velocity.y = 0;
			}

	}
}

class Platform
{
	constructor()
	{
		this.position = {x: 200, y: 800};
		this.width = 60;
		this.height = 10;
		this.color = 'red';
	}

	draw()
	{
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

}

// Create a new player
const player = new Player();
const platform = new Platform();


const keys = {
	right: {pressed: false},
	left: {pressed: false},
};

// Update the player's state
player.update();

// Define the animate function to update the game state and redraw the canvas
function animate()
{
	// Request the next animation frame
	requestAnimationFrame(animate);
	// Clear the canvas
	c.clearRect(0, 0, canvas.width, canvas.height);
	

	platform.draw();

	if (player.position.y + player.height + player.velocity.y >= platform.position.y
		&& player.position.y < platform.position.y
		&& player.position.x + player.width >= platform.position.x
		&& player.position.x <= platform.position.x + platform.width)
		{
			player.velocity.y = 0;
			player.position.y = platform.position.y - player.height;
		}
	else
		{
			player.velocity.y += gravity;
		}
	
	// Update the player's state
	player.update();
	
	if (keys.right.pressed)
		{
			player.velocity.x = 5;
		}
	else if (keys.left.pressed)
		{
			player.velocity.x = -5;
		}
	else
		{
			player.velocity.x = 0;
		}

}

// Start the animation loop
animate();


window.addEventListener('keydown', (event) =>
{
	switch (event.code)
		{
			case 'Space':
				player.velocity.y = -20;
				break;
			case 'KeyD':
				keys.right.pressed = true;
				break;
			case 'KeyA':
				keys.left.pressed = true;
				break;
			case 'KeyS':
				player.velocity.y = 10;
				break;
			case 'KeyW':
				player.velocity.y = -20;
				break;
		}
});

window.addEventListener('keyup', (event) =>
{
	if (event.code === 'KeyD')
		{
			keys.right.pressed = false;
		}
	else if (event.code === 'KeyA')
		{
			keys.left.pressed = false;
		}
});