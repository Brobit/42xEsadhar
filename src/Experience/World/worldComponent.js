import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Experience from "../experience";

class MainCube
{
	constructor()
	{
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		this.cubeSize = 0.02;
		this.position = new THREE.Vector3(0, 0.011, 0);
		this.asset = {};

		 if (this.debug.active)
		 {
		 	this.debugCube = this.debug.ui.addFolder('playable cube');
			this.debug3d = this.debug.ui.addFolder('3d paint');
		 }

		this.setMainCube();
		this.setWorld();
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
		this.finalCube = new THREE.Mesh(geometry, material);
		this.finalCube.position.set(0, 0.012, 0);
		this.scene.add(this.finalCube);

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
					this.finalCube.geometry.dispose();
					this.finalCube.geometry = new THREE.BoxGeometry(
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
				this.finalCube.position.y = cube.positionY;
			});
		 }
	}

	setWorld()
	{
		const loader = new GLTFLoader();
		const scene = this.scene;
		const debug = this.debug;
		const debug3d = this.debug3d;

		loader.load(
			'./cube-soleil-levant.glb',
			function (gltf) {
				gltf.scene.scale.set(0.05, 0.05, 0.05);
				gltf.scene.position.x = 0.075;
				gltf.scene.position.y = 2.37;
				gltf.scene.position.z = 0.825;
				gltf.scene.visible = false;
				const assets = gltf;
				console.log(assets);
				scene.add(gltf.scene);
				if (debug.active)
					debug3d.add(gltf.scene, 'visible');
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},
			function (gltf) {
				console.log(gltf);
			}
		);
		
	}
}
export { MainCube };
