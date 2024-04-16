import * as THREE from 'three'
import Experience from "../experience";
import gsap from "gsap";

export default class KeyboardHandler
{
	constructor()
	{
		this.experience = new Experience();

		// get worls
		this.world = this.experience.physicalWorld.world;

		// get the cube info
		this.cube = this.experience.mainCube.finalCube;
		this.cubeBody = this.experience.physicalWorld.cubeBody;

		// get the ennemy cube info
		this.ennemyCubeArray = this.experience.physicalWorld.ennemyCubeArray;

		// get the plane info
		this.plane = this.experience.world.plane;
		this.planeBody = this.experience.physicalWorld.planeBody;
		this.planePosition = 5;

		// get camera info
		this.camera = this.experience.camera;
		this.camera.instance.rotateX(-Math.PI / 12);
		this.angle = {
			base : new THREE.Vector3(0, 0.05, 0.2),
			quarter : new THREE.Vector3(0.2, 0.05, 0),
			half : new THREE.Vector3(0, 0.05, -0.2),
			threeQuarter : new THREE.Vector3(-0.2, 0.05, 0)
		}
		this.cameraPosition = this.angle.base;
		this.debug = this.experience.debug;
		if (this.debug.active)
		{
			this.debug.ui.addFolder('press space to dash');
			this.debugCamera = this.debug.ui.addFolder('debug camera');
			this.debugCamera.add(this.camera.instance.position, 'x', -Math.PI / 2, Math.PI / 2, 0.01).listen();
			this.debugCamera.add(this.camera.instance.position, 'y', -Math.PI / 2, Math.PI / 2, 0.01).listen();
			this.debugCamera.add(this.camera.instance.position, 'z', -Math.PI / 2, Math.PI / 2, 0.01).listen();
			this.debugCamera.hide();
		}

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

			// execute the movement
			if (this.cameraPosition == this.angle.base)
				this.move();
			else if (this.cameraPosition == this.angle.quarter)
				this.moveQuarter();
			else if (this.cameraPosition == this.angle.half)
				this.moveHalf();
			else if (this.cameraPosition == this.angle.threeQuarter)
				this.moveThreeQuarter();

			// execute the dash
			if (this.activeKeys[" "])
			{
				if (this.cameraPosition == this.angle.base)
					this.dash();
				else if (this.cameraPosition == this.angle.quarter)
					this.dashQuarter();
				else if (this.cameraPosition == this.angle.half)
					this.dashHalf();
				else if (this.cameraPosition == this.angle.threeQuarter)
					this.dashThreeQuarter();
			}

			// rotate the camera depend of the right/left arroe
			if (this.activeKeys["ArrowLeft"])
				this.moveCameraLeft();
			else if (this.activeKeys["ArrowRight"])
				this.moveCameraRight();
			else if (this.activeKeys["ArrowUp"])
				this.goUp();
			else if (this.activeKeys["ArrowDown"])
				this.goDown();

			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
			
			this.throttle = setTimeout(() => {
				this.throttle = null;
			}, 1000);
		});

		window.addEventListener('keyup', (event) => {
			// Update activeKeys object
			this.activeKeys[event.key] = false;

			// reseting the azerty input
			if (event.key === "z")
				this.activeKeys["w"] = false;
			if (event.key === "q")
				this.activeKeys["a"] = false;

			// Reset cube velocity
			if (this.cameraPosition == this.angle.base)
				this.move();
			else if (this.cameraPosition == this.angle.quarter)
				this.moveQuarter();
			else if (this.cameraPosition == this.angle.half)
				this.moveHalf();
			else if (this.cameraPosition == this.angle.threeQuarter)
				this.moveThreeQuarter();

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
		this.vx = (this.activeKeys["d"] ? this.dashSpeed : 0) - (this.activeKeys["a"] ? this.dashSpeed : 0); // D - A
		this.vz = (this.activeKeys["s"] ? this.dashSpeed : 0) - (this.activeKeys["w"] ? this.dashSpeed : 0); // S - W
	}

	moveQuarter()
	{
		// Calculate velocity changes based on active keys
		this.vz = (this.activeKeys["a"] ? this.speed : 0) - (this.activeKeys["d"] ? this.speed : 0); // A - D
		this.vx = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W
	}

	dashQuarter()
	{
		// Calculate velocity changes based on active keys
		this.vz = (this.activeKeys["a"] ? this.dashSpeed : 0) - (this.activeKeys["d"] ? this.dashSpeed : 0);
		this.vx = (this.activeKeys["s"] ? this.dashSpeed : 0) - (this.activeKeys["w"] ? this.dashSpeed : 0);
	}

	moveHalf()
	{
		// Calculate velocity changes based on active keys
		this.vx = (this.activeKeys["a"] ? this.speed : 0) - (this.activeKeys["d"] ? this.speed : 0); // A - D
		this.vz = (this.activeKeys["w"] ? this.speed : 0) - (this.activeKeys["s"] ? this.speed : 0); // W - S
	}

	dashHalf()
	{
		this.vx = (this.activeKeys["a"] ? this.dashSpeed : 0) - (this.activeKeys["d"] ? this.dashSpeed : 0);
		this.vz = (this.activeKeys["w"] ? this.dashSpeed : 0) - (this.activeKeys["s"] ? this.dashSpeed : 0);
	}

	moveThreeQuarter()
	{
		// Calculate velocity changes based on active keys
		this.vz = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
		this.vx = (this.activeKeys["w"] ? this.speed : 0) - (this.activeKeys["s"] ? this.speed : 0); // W - S
	}

	dashThreeQuarter()
	{
		this.vz = (this.activeKeys["d"] ? this.dashSpeed : 0) - (this.activeKeys["a"] ? this.dashSpeed : 0);
		this.vx = (this.activeKeys["w"] ? this.dashSpeed : 0) - (this.activeKeys["s"] ? this.dashSpeed : 0);
	}

	moveCameraLeft()
	{
		// if (this.debug.active)
		// {
		// 	this.debugCamera.show();
		// }
		gsap.to(this.cube.rotation,
		{
				duration : 0.5,
				delay : 0.05,
				y : Math.PI / 2,
				onComplete : () => {
					this.cube.rotation.set(0, 0, 0);
				}
		});
		if (this.cameraPosition == this.angle.base)
		{
			this.camera.instance.position.set(this.angle.quarter);
			this.cameraPosition = this.angle.quarter;
		}
		else if (this.cameraPosition == this.angle.quarter)
		{
			this.camera.instance.position.set(this.angle.half);
			this.cameraPosition = this.angle.half;
		}
		else if (this.cameraPosition == this.angle.half)
		{
			this.camera.instance.position.set(this.angle.threeQuarter);
			this.cameraPosition = this.angle.threeQuarter;
		}
		else if (this.cameraPosition == this.angle.threeQuarter)
		{
			this.camera.instance.position.set(this.angle.base);
			this.cameraPosition = this.angle.base;
		}
		this.camera.instance.rotateY(Math.PI / 2).rotateZ(Math.PI / 12).rotateX(-Math.PI / 12);
	}

	moveCameraRight()
	{
//		const cubeRota = this.cube.rotation;
		gsap.to(this.cube.rotation,
		{
				duration : 0.5,
				delay : 0.05,
				y : -Math.PI / 2,
		});
		this.cube.rotation.set(0, 0, 0);

		if (this.cameraPosition == this.angle.base)
		{
			this.camera.instance.position.set(this.angle.threeQuarter);
		 	this.camera.instance.rotateY(-Math.PI / 2).rotateZ(-Math.PI / 12).rotateX(-Math.PI / 12);
			this.cameraPosition = this.angle.threeQuarter;
		}
		else if (this.cameraPosition == this.angle.threeQuarter)
		{
			this.camera.instance.position.set(this.angle.half);
		 	this.camera.instance.rotateY(-Math.PI / 2).rotateZ(-Math.PI / 12).rotateX(-Math.PI / 12);
			this.cameraPosition = this.angle.half;
		}
		else if (this.cameraPosition == this.angle.half)
		{
			this.camera.instance.position.set(this.angle.quarter);
		 	this.camera.instance.rotateY(-Math.PI / 2).rotateZ(-Math.PI / 12).rotateX(-Math.PI / 12);
			this.cameraPosition = this.angle.quarter;
		}
		else if (this.cameraPosition == this.angle.quarter)
		{
			this.camera.instance.position.set(this.angle.base);
		 	this.camera.instance.rotateY(-Math.PI / 2).rotateZ(-Math.PI / 12).rotateX(-Math.PI / 12);
			this.cameraPosition = this.angle.base;
		}
	}

	goUp()
	{
		if (this.planeBody.position.y <= 0.301 )
		{
			// animation for the player cube
			gsap.to(this.planeBody.position,
			{
					duration : 1,
					ease : "power4.out",
					y : this.planeBody.position.y + 0.1,
					onUpdate : () => {
						this.plane.position.copy(this.planeBody.position);
					},
			});
		}
	}

	goDown()
	{
		console.log(this.planeBody.position);
		if (this.planeBody.position.y > -0.4)
		{
			// animation for the player cube
			gsap.to(this.cubeBody.position,
			{
					duration : 1,
					ease : "sine.in",
					y : this.cubeBody.position.y - 0.1,
			});

			// animation for the ennemy cube
			for (const ennemy of this.ennemyCubeArray)
			{
				gsap.to(ennemy.body.position,
				{
						duration : 1,
						ease : "sine.in",
						y : ennemy.body.position.y - 0.1,
				});
			}

			// animation for the plane
			gsap.to(this.planeBody.position,
			{
					duration : 1,
					delay : 0.2,
					ease : "power1.out",
					y : this.planeBody.position.y - 0.1,
					onUpdate : () => {
						this.plane.position.copy(this.planeBody.position);
					},
			});
		}
	}

	update()
	{
		// Apply velocity changes
		this.cubeBody.velocity.x = this.vx;
		this.cubeBody.velocity.z = this.vz;

		this.camera.instance.position.copy(this.cube.position).add(this.cameraPosition);

		// recall update function to update in continue
		window.requestAnimationFrame(() => {
			this.update();
		})
	}
}
