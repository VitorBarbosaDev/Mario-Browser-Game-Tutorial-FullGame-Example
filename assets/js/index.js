// Select the canvas element from the HTML document
const canvas = document.querySelector('canvas');

// Get the 2D rendering context for the canvas
const c = canvas.getContext('2d');

// Set the canvas width and height to match the window's inner width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Log the context to the console for debugging
console.log(c);

let platformImage = new Image();
platformImage.src = "/assets/images/platform.png";


console.log(platformImage);
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
	constructor({x,y,image})
	{
		this.position = {x: x, y: y};
		this.width = 60;
		this.height = 10;
		
		this.image = image;
	}

	draw()
	{
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}

}

// Create a new player object
const player = new Player();
//Create a new platform array object
const platforms = [
	new Platform({x: 100, y: 200, image: platformImage}),
	new Platform({x: 200, y: 300, image: platformImage}),
	new Platform({x: 300, y: 400, image: platformImage})
];

const keys = {
	right: {pressed: false},
	left: {pressed: false},
};

// Update the player's state
player.update();


let scrollOffset = 0;

// Define the animate function to update the game state and redraw the canvas
function animate()
{
	// Request the next animation frame
	requestAnimationFrame(animate);
	// Clear the canvas
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	platforms.forEach(platform =>
	                  {
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
	                  });
	
	// Update the player's state
	player.update();
	
	if (keys.right.pressed && player.position.x < 400)
		{
			player.velocity.x = 5;
		}
	else if (keys.left.pressed && player.position.x > 100)
		{
			player.velocity.x = -5;
		}
	else
		{
			player.velocity.x = 0;
			if(keys.right.pressed){
				scrollOffset += 5;
				platforms.forEach(platform =>
				                  {
					                  platform.position.x -= 5;
				                  });
			}
			else if(keys.left.pressed){
				scrollOffset -= 5;
				platforms.forEach(platform =>
				                  {
					                  platform.position.x += 5;
				                  });
				
			}
		}
	
	if(scrollOffset > 2000){
		console.log("You win!");
	}

}

// Start the animation loop
platformImage.onload = function ()
	{
		// Start the animation loop
		animate();
	};


window.addEventListener('keydown', (event) =>
{
	let jumpHeight = -30;
	switch (event.code)
		{
			case 'Space':
				player.velocity.y = jumpHeight;
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
				player.velocity.y = jumpHeight;
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