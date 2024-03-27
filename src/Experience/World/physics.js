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

		this.setCubeBody();
		this.setPlanesBody();
	}
	// - 0.009
	setCubeBody()
	{
		//this.mainCubePosition.setY(0.24);
		this.cubeShape = new CANNON.Box(new CANNON.Vec3(this.cubeSize / 2, this.cubeSize / 2, this.cubeSize / 2));
//		this.cubeShape.convexPolyhedronRepresentation.updateBoundingSphereRadius(0.2);
//		this.cubeShape.updateBoundingSphereRadius(0.2);
		console.log(this.cubeShape);
		this.cubeBody = new CANNON.Body({
			mass : 0,
//			position : this.mainCubePosition,
			shape : this.cubeShape
		});
		this.cubeBody.position.set(0, 0.011, 0);
		this.world.addBody(this.cubeBody);

		 window.requestAnimationFrame(() => {
		 	this.tick();
		 });
	}

	setPlanesBody()
	{
		const floorShape = new CANNON.Plane()
		this.floorBody = new CANNON.Body()
		this.floorBody.mass = 0
		this.floorBody.position.y = 0.001;
		this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
		this.floorBody.addShape(floorShape)
		this.world.addBody(this.floorBody)
	}

	tick()
	{
		// time managment
		const elapsedTime = this.clock.getElapsedTime();
		const deltaTime = elapsedTime - this.oldElapsedTime;
		this.oldElapsedTime = elapsedTime;

		// movement
		window.addEventListener("keydown", (event) => {
		  if (event.keyCode === 87) {
				console.log('pilou')
			this.cubeBody.position.x += 0.000005;
//			this.cubeBody.applyForce(new CANNON.Vec3(100, 0, 0), this.cubeBody.position);
//			this.cubeBody.applyImpulse(new CANNON.Vec3(0.0002, 0, 0), this.cubeBody.position);
		  }
		  else if (event.keyCode === 83) {
//				console.log('pilou')
			this.cubeBody.position.x -= 0.000005;
		  }
		  else if (event.keyCode === 68) {
//				console.log('pilou')
			this.cubeBody.position.z += 0.000005;
		  }
		  else if (event.keyCode === 65) {
//				console.log('pilou')
			this.cubeBody.position.z -= 0.000005;
		  }
		});

		console.log(this.cubeBody.position)

		// doing 60hz rendering
		this.world.step(1 / 60, deltaTime, 3);

		// enable physical debugger
		if (this.debug.active)
			this.cannonDebugger.update();

		// apply the physical world to the cube in the scene
		this.cube.position.copy(this.cubeBody.position);

		// recall tick function to update in continue
		window.requestAnimationFrame(() => {
			this.tick();
		})
	}
}

//export { PhysicalWorld };
