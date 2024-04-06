import Experience from "../experience";
import gsap from "gsap";

export default class KeyboardHandler
{
	constructor()
	{
		this.experience = new Experience();
		this.cube = this.experience.mainCube.finalCube;
		this.cubeBody = this.experience.physicalWorld.cubeBody;
		this.world = this.experience.physicalWorld.world;

		// timeout setter
		this.throttle = null;
		// Object to track active keys
		this.activeKeys = {};
		// Speed of movement
		this.speed = 0.3;
		// init velocity modifier
		this.vz = this.vx = 0;

		this.setKeyListener();
		this.update();
	}

	setKeyListener()
	{
		window.addEventListener('keydown', (event) => {
			// Update activeKeys object
			this.activeKeys[event.key] = true;
			console.log(this.activeKeys);

			// Calculate velocity changes based on active keys
			if (this.activeKeys["w"] == true
				|| this.activeKeys["a"] == true
				|| this.activeKeys["s"] == true
				|| this.activeKeys["d"] == true)
				this.move();
			if (this.activeKeys[" "])
				this.dash();
			
			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
			
			this.throttle = setTimeout(() => {
				this.throttle = null;
			}, 1000);
		});

		document.addEventListener('keyup', (event) => {
			// Update activeKeys object
			this.activeKeys[event.key] = false;

			// Reset cube velocity
			this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
			this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W

			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
		});
	}

	move()
	{
			this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
			this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W
	}

	// dash()
	// {
	// 	gsap.to(this.cubeBody.position,
	// 	{
	// 		duration : 1,
	// 		delay : 1,
	// 		this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
	// 		this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W
	// 	})
	// }

	update()
	{
		// Apply velocity changes
		this.cubeBody.velocity.x = this.vx;
		this.cubeBody.velocity.z = this.vz;

		// recall update function to update in continue
		window.requestAnimationFrame(() => {
			this.update();
		})
	}
}
