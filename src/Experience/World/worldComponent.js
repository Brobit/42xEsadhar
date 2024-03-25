import * as THREE from 'three';
import Experience from "../experience";
import PhysicalWorld from './physics';

class MainCube
{
	constructor()
	{
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		this.cubeSize = 0.02;
		this.position = new THREE.Vector3(0, 0.011, 0);

		 if (this.debug.active)
		 {
		 	this.debugCube = this.debug.ui.addFolder('playable cube');
		 }

		this.setMainCube();
	}

	setMainCube()
	{
		const cube = {};
		cube.color = '#8e8e92';
		const geometry = new THREE.BoxGeometry(
			this.cubeSize, this.cubeSize, this.cubeSize
		);
		const material = new THREE.MeshBasicMaterial({
			color : cube.color
		});
		const finalCube = new THREE.Mesh(geometry, material);
		finalCube.position.set(0, 0.011, 0);
		this.scene.add(finalCube);

		 if (this.debug.active)
		 {
			this.debugCube
				.addColor(cube, 'color')
				.onChange(() => {
					material.color.set(cube.color);
			});
			
			cube.size = 0.1;
			this.debugCube
				.add(cube, 'size')
				.min(0.001)
				.max(0.1)
				.step(0.001)
				.onChange(() =>{
					finalCube.geometry.dispose();
					finalCube.geometry = new THREE.BoxGeometry(
						cube.size, cube.size, cube.size
					);
			});
			cube.positionY = 0;
			this.debugCube
				.add(cube, 'positionY')
				.min(0)
				.max(0.1)
				.step(0.001)
				.onChange(() => {
				finalCube.position.y = cube.positionY;
			});
		 }
	}
}

class EnnemyCube
{
	constructor()
	{
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
	}
}

export { MainCube, EnnemyCube };
