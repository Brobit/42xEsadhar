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
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);
		this.cannonDebugger = new CannonDebugger(this.experience.scene, this.world);
		console.log(this.cannonDebugger);
		this.cube = this.experience.mainCube.finalCube;
		this.cubeSize = this.experience.mainCube.cubeSize;
		this.mainCubePosition = this.experience.mainCube.position;
		console.log(this.mainCubePosition);
		this.clock = new THREE.Clock();
		this.oldElapsedTime = 0;

		this.moveDistance = 10;
		this.localVelocity = new CANNON.Vec3();

		this.setCubeBody();
		this.setPlanesBody();
//		this.setGroundBody();

		this.setKeyListener();
		this.tick();
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
		});
		this.cubeBody.position.set(0, 0.011, 0);
		this.world.addBody(this.cubeBody);

		/* Add: track state of current throttle timer */
		this.throttle;
		/* Add: When keyup happens, just reset the throttle timer */
		document.addEventListener('keyup', () => {
		  if (this.throttle) {
			clearTimeout(this.throttle);
			this.throttle = null;
		  }
		})


//		this.tick();
//		requestAnimationFrame(() => this.tick());
	}

	setPlanesBody()
	{
		const planeShape = new CANNON.Plane()
		this.planeBody = new CANNON.Body()
		this.planeBody.mass = 0
		this.planeBody.position.y = 0.001;
		this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
		this.planeBody.addShape(planeShape)
		this.world.addBody(this.planeBody)
	}

	setKeyListener()
	{
		this.throttle = null;

		window.addEventListener('keydown', (event) => {
//	 		console.log('pilou')
//			console.log(deltaTime);
			switch (event.keyCode) {
				case 87: // W
//					this.cubeBody.velocity.x += 0.2;
						this.cubeBody.applyForce(new CANNON.Vec3(4, 0, 0), this.cubeBody.position);
					break;
				case 83: // S
//					this.cubeBody.velocity.x -= 0.2;
						this.cubeBody.applyForce(new CANNON.Vec3(-4, 0, 0), this.cubeBody.position);
					break;
				case 68: // D
//					this.cubeBody.velocity.z += 0.2;
						this.cubeBody.applyForce(new CANNON.Vec3(0, 0, 4), this.cubeBody.position);
					break;
				case 65: // A
//					this.cubeBody.velocity.z -= 0.2;
						this.cubeBody.applyForce(new CANNON.Vec3(0, 0, -4), this.cubeBody.position);
					break;
				default:
					break;
			};

			// reset throttle timer
			if (this.throttle)
			{
				clearTimeout(this.throttle);
				this.throttle = null;
			}

			this.throttle = setTimeout(() => {
				this.throttle = null;
			}, 250);

		});

		window.addEventListener('keyup', () => {
			if (this.throttle)
			{
				clearTimeout(this.throttle);
				this.throttle = null;
			}
		});
	}

	tick()
	{
		// time managment
// 		const elapsedTime = this.clock.getElapsedTime();
// 		const deltaTime = elapsedTime - this.oldElapsedTime;
// 		this.oldElapsedTime = elapsedTime;
//
// 		// movement
//
// 		if (!this.throttle)
// 		{
// 			window.addEventListener("keydown", (event) => {
// //	 			console.log('pilou')
// 				console.log(deltaTime);
// 				switch (event.keyCode) {
// 					case 87: // W
// 						this.cubeBody.velocity.x += 0.2;
// //						this.cubeBody.applyForce(new CANNON.Vec3(0.5, 0, 0), this.cubeBody.position);
// 						break;
// 					case 83: // S
// 						this.cubeBody.velocity.x -= 0.2;
// //						this.cubeBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), this.cubeBody.position);
// 						break;
// 					case 68: // D
// 						this.cubeBody.velocity.z += 0.2;
// //						this.cubeBody.applyForce(new CANNON.Vec3(0, 0, 0.5), this.cubeBody.position);
// 						break;
// 					case 65: // A
// 						this.cubeBody.velocity.z -= 0.2;
// //						this.cubeBody.applyForce(new CANNON.Vec3(0, 0, -0.5), this.cubeBody.position);
// 						break;
// 					default:
// 						break;
// 				}
// 			});
// 			this.throttle = setTimeout(() => {
// 			  this.throttle = null;
// 			}, 1000);
// 		}
//

		// enable physical debugger
		if (this.debug.active)
			this.cannonDebugger.update();

		// apply the physical world to the cube in the scene
		this.cube.position.copy(this.cubeBody.position);
		this.world.fixedStep();

		// recall tick function to update in continue
		 window.requestAnimationFrame(() => {
		 	this.tick();
		 })
	}
}

//export { PhysicalWorld };
