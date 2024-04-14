import * as THREE from 'three'
import * as CANNON from "cannon-es";
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
//			console.log(this.activeKeys);

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
			if (this.activeKeys["w"] == true || this.activeKeys["a"] == true
				|| this.activeKeys["s"] == true || this.activeKeys["d"] == true)
				this.move();
			// execute the dash
			if (this.activeKeys[" "])
				this.dash();
			// rotate the camera depend of the right/left arroe
			if (this.activeKeys["ArrowLeft"])
				this.moveCameraLeft();
			else if (this.activeKeys["ArrowRight"])
				this.moveCameraRight();

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
		this.vx = (this.activeKeys["d"] ? this.dashSpeed : 0) - (this.activeKeys["a"] ? this.dashSpeed : 0); // D - A
		this.vz = (this.activeKeys["s"] ? this.dashSpeed : 0) - (this.activeKeys["w"] ? this.dashSpeed : 0); // S - W
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
