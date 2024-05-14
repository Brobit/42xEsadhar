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
		this.arrayOfMaskingCube = [];

		 if (this.debug.active)
		 {
		 	this.debugCube = this.debug.ui.addFolder('playable cube');
			this.debug3d = this.debug.ui.addFolder('3d paint');
		 }

		this.setMainCube();
		this.playWithAsset();
		this.setMaskLayout();
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

		return new Promise ((resolve, reject) => {
			loader.load(
				'cube-soleil-levant.glb',
				(gltf) => {
					this.asset = gltf;
					gltf.scene.scale.set(0.05, 0.05, 0.05);
					gltf.scene.position.set(0.075, 2.375, 0.825);
					// change the renderOrder to 2 to see the 3d model : default 0
					// gltf.scene.renderOrder = 0;
					scene.add(gltf.scene);
					if (debug.active)
						debug3d.add(gltf.scene, 'visible');
					resolve(gltf);
				},
				(xhr) => {
					console.log((xhr.loaded / xhr.total * 100) + '% loaded');
				},
				(error) => {
					reject(error);
				}
			);
		})
	}

	async playWithAsset()
	{
		try {
			await this.setWorld();
			// console.log(this.asset);
		} catch (error) {
			console.error('ca fonctionne pas', error);
		}
		this.arrayOfCubeAsset = this.asset.scene.children;

		for (const cube of this.arrayOfCubeAsset)
		{
			cube.material.transparent = true;
			// cube.material.opacity = false;
		}
	}

	setMaskLayout()
	{
		const material = new THREE.MeshPhongMaterial({
			polygonOffset : 1,
			polygonOffsetFactor : -1,
			polygonOffsetUnits : -1,
		});

		const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

		const mesh = new THREE.Mesh(geometry, material.clone());
		mesh.material.color.set(0xff0000);
		// mesh.material.wireframe = true;

		for (let y = -0.45; y < 0.5; y += 0.1)
		{
			for (let x = -0.45; x < 0.5; x += 0.1)
			{
				for (let z = -0.45; z < 0.5; z += 0.1)
				{
					const maskingCube = mesh.clone();
					// uncomment to allow transparency
					mesh.material.transparent = true;
					mesh.material.colorWrite = false;
					mesh.renderOrder = -1;
					maskingCube.position.set(x, y, z);
					
					// create the perimeter of the masking cube
					const maskingCubePerimeter = {
						"xPos" : maskingCube.position.x + 0.05,
						"xNeg" : maskingCube.position.x - 0.05,
						"zNeg" : maskingCube.position.z - 0.05,
						"zPos" : maskingCube.position.z + 0.05,
						"yNeg" : maskingCube.position.y - 0.05,
						"yPos" : maskingCube.position.y + 0.05
					};
					this.arrayOfMaskingCube.push({
						"mesh" : maskingCube,
						"material" : maskingCube.material,
						"geometry" : maskingCube.geometry,
						"perimeter" : maskingCubePerimeter});
					this.scene.add(maskingCube);
				}
			}
		}
	}
}
export { MainCube };
