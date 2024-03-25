import * as THREE from 'three';
import CANNON from "cannon";
import Experience from "../experience";

export default class PhysicalWorld
{
	constructor()
	{
		this.experience = new Experience();
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);
		this.cubeSize = this.experience.mainCube.cubeSize;
		this.mainCubePosition = this.experience.mainCube.position;
		this.clock = new THREE.Clock();
		this.oldElapsedTime = 0;

		this.setCubeBody();
	}

	setCubeBody()
	{
		this.cubeShape = new CANNON.Box(new CANNON.Vec3(this.cubeSize, this.cubeSize, this.cubeSize));
		this.cubeBody = new CANNON.Body({
			mass : 1,
			position : this.mainCubePosition,
			shape : this.cubeShape
		});
		this.world.addBody(this.cubeBody);

		window.requestAnimationFrame(() => {
			this.tick();
		});
	}

	tick()
	{
		const elapsedTime = this.clock.getElapsedTime();
		const deltaTime = elapsedTime - this.oldElapsedTime;
		this.oldElapsedTime = elapsedTime;

		this.world.step(1 / 60, deltaTime, 3);
		console.log(this.cubeBody.position.y);
		window.requestAnimationFrame(() => {
			this.tick();
		})
	}
}

//export { PhysicalWorld };
