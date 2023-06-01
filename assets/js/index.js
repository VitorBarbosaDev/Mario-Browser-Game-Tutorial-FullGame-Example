// Select the canvas element from the HTML document
const canvas = document.querySelector('canvas');

// Get the 2D rendering context for the canvas
const c = canvas.getContext('2d');

// Set the canvas width and height to match the window's inner width and height
canvas.width  = 1024;
canvas.height = 576;


let platformImage = new Image();
platformImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/platform.png";

let hillsImage = new Image();
hillsImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/hills.png";

let backgroundImage = new Image();
backgroundImage.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/background.png";

let platformTall = new Image();
platformTall.src = "/Mario-Browser-Game-Tutorial-FullGame-Example/assets/images/platformSmallTall.png";

// Create an array of all your image assets
let imageAssets = [platformImage, hillsImage, backgroundImage, platformTall];

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
	             init();
	             animate();
             })
       .catch(error =>
              {
	              // An error occurred while loading the images
	              console.error("An error occurred while loading the images: ", error);
              });


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
		this.width    = 30;
		this.height   = 30;
		this.color    = 'red';
		this.speed    = 10;
		this.jumpHeight = -40;
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
		new Platform({x: platformImage.width * 4 + 300 + platformImage.width-platformTall.width, y: 470 - 200, image: platformTall}),
		new Platform({x: platformImage.width * 4 + 200 + platformImage.width-platformTall.width , y: 470 - 100, image: platformTall}),
		new Platform({x: platformImage.width * 3 + 300, y: 470, image: platformImage}),
		new Platform({x: platformImage.width * 4 +300-2, y: 470, image: platformImage}),
		new Platform({x: platformImage.width * 5 +560, y: 470, image: platformImage}),
		
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
let platforms = [

];

let genericObjects = [
	
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
	
	if (keys.right.pressed && player.position.x < 400)
		{
			player.velocity.x = player.speed;
		}
	else if (keys.left.pressed && player.position.x > 100)
		{
			player.velocity.x = -player.speed;
		}
	else
		{
			player.velocity.x = 0;
			if (keys.right.pressed)
				{
					scrollOffset += player.speed;;
					platforms.forEach(platform =>
					                  {
						                  platform.position.x -= player.speed;;
					                  });
					genericObjects.forEach(genericObject =>
					                       {
						                       genericObject.position.x -= 3;
					                       });
				}
			else if (keys.left.pressed)
				{
					scrollOffset -= player.speed;
					platforms.forEach(platform =>
					                  {
						                  platform.position.x += player.speed;;
					                  });
					genericObjects.forEach(genericObject =>
					                       {
						                       genericObject.position.x += 3;
					                       });
				}
		}
	
	
	//Win Condition
	if (scrollOffset > platformImage.width * 5 + 560-50)
		{
			console.log("You win!");
		}
	
	//Lose Condition
	if (player.position.y > canvas.height)
		{
			console.log("You Lose");
			init();
		}
	
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
				break;
			case 'KeyA':
				keys.left.pressed = true;
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