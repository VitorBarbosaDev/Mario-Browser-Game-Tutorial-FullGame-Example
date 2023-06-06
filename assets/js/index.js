// Select the canvas element from the HTML document
const canvas = document.querySelector('canvas');

// Get the 2D rendering context for the canvas
const c = canvas.getContext('2d');

// Set the canvas width and height to match the window's inner width and height
canvas.width  = 1024;
canvas.height = 576;

//Import Assets
let platformImage = new Image();
platformImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/platform.png";

let hillsImage = new Image();
hillsImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/hills.png";

let backgroundImage = new Image();
backgroundImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/background.png";

let platformTall = new Image();
platformTall.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/platformSmallTall.png";

let spriteRunLeft    = new Image();
spriteRunLeft.src    = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/spriteRunLeft.png";
let spriteRunRight   = new Image();
spriteRunRight.src   = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/spriteRunRight.png";
let spriteStandRight = new Image();
spriteStandRight.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/spriteStandRight.png";
let spriteStandLeft  = new Image();
spriteStandLeft.src  = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/spriteStandLeft.png";
//Import Player

// Create an array of all your image assets
let imageAssets = [platformImage, hillsImage, backgroundImage, platformTall, spriteRunLeft, spriteRunRight, spriteStandRight, spriteStandLeft];

// Create a promise for each image asset that resolves when the image loads
let imagePromises = imageAssets.map(image =>
                                    {
	                                    return new Promise((resolve, reject) =>
	                                                       {
		                                                       image.onload  = resolve;
		                                                       image.onerror = reject;
	                                                       });
                                    });

// Wait for all the image assets to load before starting the game
Promise.all(imagePromises)
       .then(() =>
             {
	             // All images have loaded, start the game
	             displayMenu();
             })
       .catch(error =>
              {
	              // An error occurred while loading the images
	              console.error("An error occurred while loading the images: ", error);
              });


let lastKey;

let canStartGame = true;

// Define the gravity constant for the game
const gravity = .5;

// Define the Player class
class Player
{
	constructor()
	{
		// Initialize the player's position, velocity, dimensions, and color
		this.position   = {x: 100, y: 100};
		this.velocity   = {x: 0, y: 0};
		this.width      = 33;
		this.height     = 75;
		this.color      = 'red';
		this.speed      = 10;
		this.jumpHeight = -40;
		this.image      = spriteStandRight;
		this.frames     = 0;
		this.alive = true;
		this.sprites    = 
			{
			stand: {right: spriteStandRight, left: spriteStandLeft,cropWidth:177,width:33},
				run:{right: spriteRunRight, left: spriteRunLeft,cropWidth:341, width: 63.9375},
			}
		this.currentSprite = this.sprites.stand.right;
		this.currentCropWidth = 177;
	};
	
	
	// Define the draw method to draw the player on the canvas
	draw()
	{
		/*	c.fillStyle = this.color;
		 c.fillRect(this.position.x, this.position.y, this.width, this.height);*/
		c.drawImage(this.currentSprite, this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400, this.position.x, this.position.y, this.width, this.height);
	}
	
	// Define the update method to update the player's position and velocity
	update()
	{
		this.frames++;
		if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left) || this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
			{
				this.frames = 0;
			}
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
		/*	else
		 {
		 this.velocity.y = 0;
		 }*/
		
	}
}

class Platform
{
	constructor({x, y, image})
	{
		this.position = {x: x, y: y};
		this.image    = image;
		this.width    = image.width;
		this.height   = image.height;
		
		
	}
	
	draw()
	{
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
	
}

class GenericObject
{
	constructor({x, y, image})
	{
		this.position = {x: x, y: y};
		this.image    = image;
		this.width    = image.width;
		this.height   = image.height;
	}
	
	draw()
	{
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
	
}


function init()
{


// Create a new player object
	player    = new Player();
//Create a new platform array object
	platforms = [
		new Platform({x: -1, y: 470, image: platformImage}),
		new Platform({x: platformImage.width - 3, y: 470, image: platformImage}),
		new Platform({x: platformImage.width * 2 + 100, y: 470, image: platformImage}),
		new Platform({
			             x: platformImage.width * 4 + 300 + platformImage.width - platformTall.width,
			             y: 470 - 200,
			             image: platformTall,
		             }),
		new Platform({
			             x: platformImage.width * 4 + 200 + platformImage.width - platformTall.width,
			             y: 470 - 100,
			             image: platformTall,
		             }),
		new Platform({x: platformImage.width * 3 + 300, y: 470, image: platformImage}),
		new Platform({x: platformImage.width * 4 + 300 - 2, y: 470, image: platformImage}),
		new Platform({x: platformImage.width * 5 + 560, y: 470, image: platformImage}),
	
	];
	
	genericObjects = [
		//Background
		new GenericObject({x: -1, y: -1, image: backgroundImage}),
		//Hills
		new GenericObject({x: 20, y: -1, image: hillsImage}),
		new GenericObject({x: 500 * 2, y: -1, image: hillsImage}),
	];
	
	
	scrollOffset = 0;
}

// Create a new player object
let player    = new Player();
//Create a new platform array object
let platforms = [];

let genericObjects = [];



const keys = {
	right: {pressed: false},
	left: {pressed: false},
};

// Update the player's state
player.update();


let scrollOffset = 0;

let animationFrameId;

// Define the animate function to update the game state and redraw the canvas
function animate()
{
	// Cancel the previous animation frame request
	if (animationFrameId)
		{
			cancelAnimationFrame(animationFrameId);
		}
	
	// Request the next animation frame
	animationFrameId = requestAnimationFrame(animate);
	
	// Clear the canvas
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	
	
	
	genericObjects.forEach(genericObject =>
	                       {
		                       genericObject.draw();
	                       });
	
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
	
	if(player.alive)
		{
			if (keys.right.pressed && player.position.x < 400)
				{
					player.velocity.x = player.speed;
				}
			else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0))
				{
					player.velocity.x = -player.speed;
				}
			else
				{
					player.velocity.x = 0;
					if (keys.right.pressed)
						{
							scrollOffset += player.speed;
							platforms.forEach(platform =>
							                  {
								                  platform.position.x -= player.speed;
								                  ;
							                  });
							genericObjects.forEach(genericObject =>
							                       {
								                       genericObject.position.x -= 3;
							                       });
						}
					else if (keys.left.pressed && scrollOffset > 0)
						{
							scrollOffset -= player.speed;
							platforms.forEach(platform =>
							                  {
								                  platform.position.x += player.speed;
								                  ;
							                  });
							genericObjects.forEach(genericObject =>
							                       {
								                       genericObject.position.x += 3;
							                       });
						}
				}
			
			
			if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right)
				{
					player.frames           = 1;
					player.currentSprite    = player.sprites.run.right;
					player.currentCropWidth = player.sprites.run.cropWidth;
					player.width            = player.sprites.run.width;
				}
			else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left)
				{
					player.frames           = 1;
					player.currentSprite    = player.sprites.run.left;
					player.currentCropWidth = player.sprites.run.cropWidth;
					player.width            = player.sprites.run.width;
				}
			else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left)
				{
					player.frames           = 1;
					player.currentSprite    = player.sprites.stand.left;
					player.currentCropWidth = player.sprites.stand.cropWidth;
					player.width            = player.sprites.stand.width;
				}
			else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right)
				{
					player.frames           = 1;
					player.currentSprite    = player.sprites.stand.right;
					player.currentCropWidth = player.sprites.stand.cropWidth;
					player.width            = player.sprites.stand.width;
				}
		}
	// Draw the scrollOffset at the top of the canvas
	c.fillStyle = 'black';
	c.font      = '20px Arial';
	
	
	//Win Condition
	if (scrollOffset > platformImage.width * 5 + 560 - 50)
		{
			c.fillStyle = 'Green';
			c.font      = '40px Arial';
			c.fillText('You Win', (canvas.width - c.measureText('You Win').width) / 2, canvas.height / 2);
			c.fillText('Press Enter to Start', (canvas.width - c.measureText('Press Enter to Restart').width) / 2, canvas.height / 2 +100);
			console.log("You win!");
			canStartGame = true;
		}
	else if(scrollOffset < platformImage.width * 5 + 560 - 50 && player.alive){
		c.fillText('Scroll Offset: ' + scrollOffset, (canvas.width - c.measureText('Scroll Offset: ' + scrollOffset).width) / 2, 30);
	}
	
	//Lose Condition
	if (player.position.y > canvas.height)
		{
			c.fillStyle = 'red';
			c.font      = '40px Arial';
			c.fillText('You Lose', (canvas.width - c.measureText('You Lose').width) / 2, canvas.height / 2);
			console.log("You Lose");
			player.alive = false;
			setTimeout(init, 500); // Delay of 500 milliseconds (.5 seconds)
		}
	
}

// Define the displayMenu function to draw the menu on the canvas
function displayMenu()
{
	// Clear the canvas
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw the menu
	c.fillStyle = 'black';
	c.font      = '40px Arial';
	c.fillText('Press Enter to Start', (canvas.width - c.measureText('Press Enter to Start').width) / 2, canvas.height / 2);
}

window.addEventListener('keydown', (event) =>
{
	
	switch (event.code)
		{
			case 'Space':
				player.velocity.y = player.jumpHeight;
				break;
			case 'KeyD':
				keys.right.pressed = true;
				lastKey = 'right';
				break;
			case 'KeyA':
				keys.left.pressed = true;
				lastKey = 'left';
				break;
			case 'KeyS':
				player.velocity.y = 10;
				break;
			case 'KeyW':
				player.velocity.y = player.jumpHeight;
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

// Add an event listener for the Enter key
window.addEventListener('keydown', (event) =>
{
	if (event.code === 'Enter' && canStartGame)
		{
			// Start the game when the Enter key is pressed
			init();
			animate();
			canStartGame = false;
		}
});

// Add an event listener for mouse clicks on the canvas
canvas.addEventListener('click', () =>
{
	// Start the game when the canvas is clicked
	if (canStartGame)
		{
			init();
			animate();
			canStartGame = false;
		}
});