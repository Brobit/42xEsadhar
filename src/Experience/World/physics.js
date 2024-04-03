import * as THREE from 'three';
import * as CANNON from "cannon-es";
import Experience from "../experience";
import CannonDebugger from 'cannon-es-debugger';

export default class PhysicalWorld
{
	constructor()
	{
		this.experience = new Experience();
		this.debug = this.experience.debug;
		this.camera = this.experience.camera.instance;
		this.cameraOffset = this.experience.camera.cameraOffset;
		console.log(this.camera);
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);
		this.cannonDebugger = new CannonDebugger(this.experience.scene, this.world);
		this.cube = this.experience.mainCube.finalCube;
		this.cubeSize = this.experience.mainCube.cubeSize;
		this.mainCubePosition = this.experience.mainCube.position;
		console.log(this.mainCubePosition);
		this.clock = new THREE.Clock();
		this.oldElapsedTime = 0;
		this.camera.lookAt(this.cube.position);

		this.defaultMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.defaultMaterial,
			{
				friction: 0.1,
				restitution: 0.3
			}
		)
		this.world.addContactMaterial(this.defaultContactMaterial);
		this.world.defaultContactMaterial = this.defaultContactMaterial;

		this.setCubeBody();
		this.setPlanesBody();

		this.setKeyListener();
		this.update();

	}


	setCubeBody()
	{
//		this.cubeShape = new CANNON.Box(new CANNON.Vec3(this.cubeSize / 2, this.cubeSize / 2, this.cubeSize / 2));
//		console.log(this.cubeShape);
		this.cubeBody = new CANNON.Body({
			mass : 1,
			shape : new CANNON.Sphere(0.011),
			linearDamping : 0.5,
			angularDamping : 1,
			material : this.defaultMaterial
		});
		this.cubeBody.position.set(0, 0.011, 0);
		this.world.addBody(this.cubeBody);
	}

	setPlanesBody()
	{
		const planeShape = new CANNON.Plane()
		this.planeBody = new CANNON.Body()
		this.planeBody.mass = 0
		this.planeBody.position.y = 0.001;
		this.planeBody.material = this.defaultMaterial;
		this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
		this.planeBody.addShape(planeShape)
		this.world.addBody(this.planeBody)
	}

	setKeyListener()
	{
		this.throttle = null;

		// Object to track active keys
		this.activeKeys = {};

		// Speed of movement
		this.speed = 0.3;

		document.addEventListener('keydown', (event) => {
			// Update activeKeys object
			this.activeKeys[event.keyCode] = true;
			console.log(event.keyCode);

			

			// Calculate velocity changes based on active keys
			const vx = (this.activeKeys[68] ? this.speed : 0) - (this.activeKeys[65] ? this.speed : 0); // D - A
			const vz = (this.activeKeys[83] ? this.speed : 0) - (this.activeKeys[87] ? this.speed : 0); // S - W

			// Apply velocity changes
			this.cubeBody.velocity.x = vx;
			this.cubeBody.velocity.z = vz;

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
			this.activeKeys[event.keyCode] = false;

			// Reset cube velocity
			const vx = (this.activeKeys[68] ? this.speed : 0) - (this.activeKeys[65] ? this.speed : 0); // D - A
			const vz = (this.activeKeys[83] ? this.speed : 0) - (this.activeKeys[87] ? this.speed : 0); // S - W

			this.cubeBody.velocity.x = vx;
			this.cubeBody.velocity.z = vz;

			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
		});
	}

	update()
	{
		// time managment
// 		const elapsedTime = this.clock.getElapsedTime();
// 		const deltaTime = elapsedTime - this.oldElapsedTime;
// 		this.oldElapsedTime = elapsedTime;

		// enable physical debugger
		if (this.debug.active)
			this.cannonDebugger.update();

		// apply the physical world to the cube in the scene
		this.cube.position.copy(this.cubeBody.position);

		// update camera to follow the player
		const objectPosition = new THREE.Vector3();
		this.cube.getWorldPosition(objectPosition);

		this.camera.position.copy(objectPosition).add(this.cameraOffset);


		// update wrld at 60hz
		this.world.fixedStep();

		// recall tick function to update in continue
		  window.requestAnimationFrame(() => {
		  	this.update();
		  })
	}
}

//export { PhysicalWorld };
