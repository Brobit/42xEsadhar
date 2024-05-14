import * as THREE from 'three';
import Experience from "../experience";
import gsap from "gsap";
import JoystickController from "joystick-controller";

export default class JoystickHandler
{
	constructor()
	{
		this.experience = new Experience();

		// get worlds
		this.world = this.experience.physicalWorld.world;

		// get the cube info
		this.cube = this.experience.mainCube.finalCube;
		this.cubeBody = this.experience.physicalWorld.cubeBody;

		// get the ennemy cube info
		this.ennemyCubeArray = this.experience.physicalWorld.ennemyCubeArray;
		this.ennemyMaterial = this.experience.physicalWorld.ennemyMaterial;

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
		this.isInOrbitControl = false;
		this.start = 0;
		
		// timeout setter
		this.throttle = null;

		// cooldown setter
		this.moveCameraLeftCooldown = false;
		this.moveCameraRightCooldown = false;
		this.goUpCooldown = false;
		this.goDownCooldown = false;
		this.dashCooldown = false;

		// Object to track active keys
		this.activeKeys = {};

		// Speed of movement
		this.speed = 0.3;
		this.dashSpeed = 1.5;

		// check if the player is in a dash movement
		this.isInDash = false;

		// check if there is a collision
		this.isCollide = false;

		// init velocity modifier
		this.vz = this.vx = 0;
		
		this.initJoy();
		this.checkCollision();
		this.checkOrientation();
		this.update();
	}

	initJoy()
	{
		const joystickLeft = new JoystickController({
			containerClass : "button",
			controllerClass : "button_color",
			opacity : 0.7,
			maxRange : 50,
			x : '17.5%',
			y : '10%',
			hideContextMenu : true
		}, (data) => {
			if (!this.camera.controls)
			{
				if (this.cameraPosition == this.angle.base)
					this.move(data.angle, this.speed);
				else if (this.cameraPosition == this.angle.quarter)
					// this.move(data.angle, this.speed);
					this.moveQuarter(data.angle, this.speed);
				else if (this.cameraPosition == this.angle.half)
					this.moveHalf(data.angle, this.speed);
				else if (this.cameraPosition == this.angle.threeQuarter)
					this.moveThreeQuarter(data.angle, this.speed);
			}
		});

		const camButton = new JoystickController({
			containerClass : "button",
			joystickClass : "button_color",
			opacity : 0.7,
			radius : 20,
			joystickRadius : 20,
			maxRange : 0,
			x : '40%',
			y : '5%',
			hideContextMenu : true
		}, (data) => {
				console.log(this.camera.controls);
			if (!this.isInOrbitControl && this.start != 0)
			{
				if (!this.camera.controls)
					this.camera.setControls();
				else if (this.camera.controls)
				{
					this.camera.removeControls();
					this.camera.instance.position.copy(this.experience.mainCube.finalCube.position).add(this.cameraPosition);
					this.camera.instance.lookAt(this.experience.mainCube.finalCube.position);
				}
				this.isInOrbitControl = true;
				setTimeout(() => {this.isInOrbitControl = false;}, 1000);
			}
			this.start++;
		});

		const dashButton = new JoystickController({
			containerClass : "button",
			joystickClass : "button_color",
			opacity : 0.7,
			radius : 20,
			joystickRadius : 20,
			maxRange : 0,
			x : '60%',
			y : '5%',
			hideContextMenu : true
		}, (data) => {
			this.executeDash();
		});

		const joystickRight = new JoystickController({
			containerClass : "button",
			controllerClass : "button_color",
			opacity : 0.7,
			maxRange : 50,
			x : '82.5%',
			y : '10%',
			hideContextMenu : true
		}, (data) => {
			console.log(data, "joystick right");
			if ((data.angle < 0 && data.angle >= -0.25) || (data.angle > 0 && data.angle <= 0.25)) // move the camera clockwise
				this.moveCameraRight();
			else if (data.angle < -1.25 && data.angle >= -1.75) // go to the level above
				this.goUp();
			else if ((data.angle < -2.75 && data.angle >= -3.2) || (data.angle > 2.75 && data.angle <= 3.2)) // move the camera counter clockwise
				this.moveCameraLeft();
			else if (data.angle > 1.25 && data.angle <= 1.75) // go to the level under
				this.goDown();
		});
	}

	move(angle, speed)
	{
		if ((angle <= 0.25 && angle > 0) || (angle < 0 && angle >= -0.25)) // right
		{
			this.vx = speed;
			this.vz = 0;
		}
		else if (angle < -0.25 && angle >= -1) // upper right
		{
			this.vx = speed;
			this.vz = -speed;
		}
		else if (angle < -1 && angle >= -2) // up
		{
			this.vx = 0;
			this.vz = -speed;
		}
		else if (angle < -2 && angle >= -2.75) // upper left
			this.vx = this.vz = -speed;
		else if ((angle < -2.75 && angle >= -3.2) || (angle > 2.75 && angle <= 3.2)) // left
		{
			this.vx = -speed;
			this.vz = 0;
		}
		else if (angle > 2 && angle <= 2.75) // down left
		{
			this.vx = -speed;
			this.vz = speed;
		}
		else if (angle > 1 && angle <= 2) // down
		{
			this.vx = 0;
			this.vz = speed;
		}
		else if (angle > 0.25 && angle <= 1) // down right
			this.vx = this.vz = speed;
		else
			this.vx = this.vz = 0;
	}

	moveQuarter(angle, speed)
	{
		if ((angle <= 0.25 && angle > 0) || (angle < 0 && angle >= -0.25)) // right
		{
			this.vx = 0;
			this.vz = -speed;
		}
		else if (angle < -0.25 && angle >= -1) // upper right
			this.vx = this.vz = -speed;
		else if (angle < -1 && angle >= -2) // up
		{
			this.vx = -speed;
			this.vz = 0;
		}
		else if (angle < -2 && angle >= -2.75) // upper left
		{
			this.vx = -speed;
			this.vz = speed;
		}
		else if ((angle < -2.75 && angle >= -3.2) || (angle > 2.75 && angle <= 3.2)) // left
		{
			this.vx = 0;
			this.vz = speed;
		}
		else if (angle > 2 && angle <= 2.75) // down left
			this.vx = this.vz = speed;
		else if (angle > 1 && angle <= 2) // down
		{
			this.vx = speed;
			this.vz = 0;
		}
		else if (angle > 0.25 && angle <= 1) // down right
		{
			this.vx = speed;
			this.vz = -speed;
		}
		else
			this.vx = this.vz = 0;
	}

	moveHalf(angle, speed)
	{
		if ((angle <= 0.25 && angle > 0) || (angle < 0 && angle >= -0.25)) // right
		{
			this.vx = -speed;
			this.vz = 0;
		}
		else if (angle < -0.25 && angle >= -1) // upper right
		{
			this.vx = -speed;
			this.vz = speed;
		}
		else if (angle < -1 && angle >= -2) // up
		{
			this.vx = 0;
			this.vz = speed;
		}
		else if (angle < -2 && angle >= -2.75) // upper left
			this.vx = this.vz = speed;
		else if ((angle < -2.75 && angle >= -3.2) || (angle > 2.75 && angle <= 3.2)) // left
		{
			this.vx = speed;
			this.vz = 0;
		}
		else if (angle > 2 && angle <= 2.75) // down left
		{
			this.vx = speed;
			this.vz = -speed;
		}
		else if (angle > 1 && angle <= 2) // down
		{
			this.vx = 0;
			this.vz = -speed;
		}
		else if (angle > 0.25 && angle <= 1) // down right
			this.vx = this.vz = -speed;
		else
			this.vx = this.vz = 0;
	}

	moveThreeQuarter(angle, speed)
	{
		if ((angle <= 0.25 && angle > 0) || (angle < 0 && angle >= -0.25)) // right
		{
			this.vx = 0;
			this.vz = speed;
		}
		else if (angle < -0.25 && angle >= -1) // upper right
			this.vx = this.vz = speed;
		else if (angle < -1 && angle >= -2) // up
		{
			this.vx = speed;
			this.vz = 0;
		}
		else if (angle < -2 && angle >= -2.75) // upper left
		{
			this.vx = speed;
			this.vz = -speed;
		}
		else if ((angle < -2.75 && angle >= -3.2) || (angle > 2.75 && angle <= 3.2)) // left
		{
			this.vx = 0;
			this.vz = -speed;
		}
		else if (angle > 2 && angle <= 2.75) // down left
			this.vx = this.vz = -speed;
		else if (angle > 1 && angle <= 2) // down
		{
			this.vx = -speed;
			this.vz = 0;
		}
		else if (angle > 0.25 && angle <= 1) // down right
		{
			this.vx = -speed;
			this.vz = speed;
		}
		else
			this.vx = this.vz = 0;
	}

	executeDash()
	{
		if (!this.dashCooldown)
		{
			if (this.vx == this.speed)
				this.vx = this.dashSpeed;
			else if (this.vx == -this.speed)
				this.vx = -this.dashSpeed;
			if (this.vz == this.speed)
				this.vz = this.dashSpeed;
			else if (this.vz == -this.speed)
				this.vz = -this.dashSpeed;
			if (!this.dashCooldown)
				setTimeout(() => {this.dashCooldown = true}, 0.25 * 1000);
		}
		setTimeout(() => {this.dashCooldown = false}, 2 * 1000);
	}

	moveCameraLeft()
	{
		if (this.moveCameraLeftCooldown)
			return ;

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

		this.moveCameraLeftCooldown = true;

		setTimeout( () => {
			this.moveCameraLeftCooldown = false;
		}, 1500);
	}

	moveCameraRight()
	{
		if (this.moveCameraRightCooldown)
			return ;

		gsap.to(this.cube.rotation,
		{
				duration : 0.5,
				delay : 0.05,
				y : -Math.PI / 2,
				onComplete : () => {
					this.cube.rotation.set(0, 0, 0);
				}
		});

		if (this.cameraPosition == this.angle.base)
		{
			this.camera.instance.position.set(this.angle.threeQuarter);
			this.cameraPosition = this.angle.threeQuarter;
		}
		else if (this.cameraPosition == this.angle.threeQuarter)
		{
			this.camera.instance.position.set(this.angle.half);
			this.cameraPosition = this.angle.half;
		}
		else if (this.cameraPosition == this.angle.half)
		{
			this.camera.instance.position.set(this.angle.quarter);
			this.cameraPosition = this.angle.quarter;
		}
		else if (this.cameraPosition == this.angle.quarter)
		{
			this.camera.instance.position.set(this.angle.base);
			this.cameraPosition = this.angle.base;
		}
		this.camera.instance.rotateY(-Math.PI / 2).rotateZ(-Math.PI / 12).rotateX(-Math.PI / 12);

		this.moveCameraRightCooldown = true;

		setTimeout( () => {
			this.moveCameraRightCooldown = false;
		}, 1500);
	}

	goUp()
	{
		if (this.goUpCooldown)
			return ;

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

		this.goUpCooldown = true;

		setTimeout( () => {
			this.goUpCooldown = false;
		}, 2000);
	}

	goDown()
	{
		if (this.goDownCooldown)
			return ;

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
		
		this.goDownCooldown = true;

		setTimeout( () => {
			this.goDownCooldown = false;
		}, 2000);
	}

	checkCollision()
	{
		this.cubeBody.addEventListener('collide', (ennemyCube) => {
			if (ennemyCube.body.material == this.ennemyMaterial)
			{
				if (this.isInDash == true)
				{
					ennemyCube.body.collisionFilterGroup = 2;
					ennemyCube.body.sleep();
					this.isCollide = true;
				}
			}
		});
	}

	checkOrientation()
	{
		window.addEventListener("orientationchange", () => {
			if (window.screen.orientation.type.includes("landscape"))
			{
				let divLandscapeOrientation = document.createElement("div");
				divLandscapeOrientation.style.position = "relative";
				divLandscapeOrientation.style.width = "100%";
				divLandscapeOrientation.style.height = "100%";
				divLandscapeOrientation.textContent = "Pour jouer, mettez le téléphone en mode portrait";
				divLandscapeOrientation.style.color = "white";
				divLandscapeOrientation.style.backgroundColor = "black";
				divLandscapeOrientation.style.zIndex = "12";
				divLandscapeOrientation.style.display = "flex";
				divLandscapeOrientation.style.justifyContent = "center";
				divLandscapeOrientation.style.alignItems = "center";
				divLandscapeOrientation.id = "divLandscapeOrientation";
				document.body.appendChild(divLandscapeOrientation);
			}
			else if (window.screen.orientation.type.includes("portrait"))
			{
				if (document.body.contains(divLandscapeOrientation))
					document.body.removeChild(divLandscapeOrientation);
			}
		});
	}

	update()
	{
		if (this.vx == this.dashSpeed || this.vx == -this.dashSpeed
			|| this.vz == this.dashSpeed || this.vz == -this.dashSpeed)
			this.isInDash = true;
		else
			this.isInDash = false
		
		if (!this.camera.controls)
		{
			this.cubeBody.velocity.x = this.vx;
			this.cubeBody.velocity.z = this.vz;
		}

		if (!this.camera.controls)
			this.camera.instance.position.copy(this.cube.position).add(this.cameraPosition);

		// recall update function to update in continue
		window.requestAnimationFrame(() => {
			this.update();
		})
	}
}
