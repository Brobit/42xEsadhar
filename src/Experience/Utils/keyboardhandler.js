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
		this.debug = this.experience.debug;

		if (this.debug.active)
			this.debug.ui.addFolder('press space to dash')

		// timeout setter
		this.throttle = null;
		// Object to track active keys
		this.activeKeys = {};
		// Speed of movement
		this.speed = 0.3;
		this.dashSpeed = 1.5;
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

			// try to check if the keybaord is azerty
			if (this.activeKeys["z"] == true)
			{
				// disable the z and enable the w
				this.activeKeys["z"] = false;
				this.activeKeys["w"] = true;
			}
			if (this.activeKeys["q"] == true)
			{
				// disable the q and enable the a
				this.activeKeys["q"] = false;
				this.activeKeys["a"] = true;
			}

			if (this.activeKeys["w"] == true || this.activeKeys["a"] == true
				|| this.activeKeys["s"] == true || this.activeKeys["d"] == true)
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

			// reseting the azerty input
			if (event.key === "z")
				this.activeKeys["w"] = false;
			if (event.key === "q")
				this.activeKeys["a"] = false;

			// Reset cube velocity
			this.move();

			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
		});
	}

	move()
	{
		// Calculate velocity changes based on active keys
		this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
		this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W
	}

	dash()
	{
		// this.move();
		// gsap.to(this.cubeBody.position,
		// {
		// 	duration : 0.5,
		// 	delay : 0.05,
		// 	ease : "circ.out",
		// 	z : this.vz,
		// 	x : this.vx
		// })

		this.vx = (this.activeKeys["d"] ? this.dashSpeed : 0) - (this.activeKeys["a"] ? this.dashSpeed : 0); // D - A
		this.vz = (this.activeKeys["s"] ? this.dashSpeed : 0) - (this.activeKeys["w"] ? this.dashSpeed : 0); // S - W
	}

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
