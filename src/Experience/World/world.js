import * as THREE from 'three'
import Experience from "../experience";
import Debug from '../Utils/debug';

export default class World
{
	constructor()
	{
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		this.cubeDivision = 10;
		this.planeDivision = 40;

		if (this.debug.active)
		{
			this.debugCube = this.debug.ui.addFolder('main cube');
			this.debugPlane = this.debug.ui.addFolder('test plane');
			const axesHelper = new THREE.AxesHelper(3);
			this.scene.add(axesHelper);
		}

		this.setCubeCreation();
		this.setOnePlaneCreation();
	}

	// create test cube
	setCubeCreation()
	{
		// Cube creation
		const cube = {};
		cube.color = '#62a0ea';
		const geometry = new THREE.BoxGeometry(
			1, 1, 1,
			this.cubeDivision, this.cubeDivision, this.cubeDivision
		);
		const material = new THREE.MeshBasicMaterial({
			color : cube.color,
			side : THREE.DoubleSide,
			wireframe : true
		});
		const testCube = new THREE.Mesh(geometry, material);

		// Cube debugging
		if (this.debug.active)
		{
			this.debugCube
				.addColor(cube, 'color')
				.onChange(() => {
					material.color.set(cube.color)
			});

			cube.subdivision = 1;

			this.debugCube
				.add(cube, 'subdivision')
				.min(1)
				.max(20)
				.step(1)
				.onFinishChange(() => {
					testCube.geometry.dispose();
					testCube.geometry = new THREE.BoxGeometry(
						1, 1, 1,
						cube.subdivision, cube.subdivision, cube.subdivision 
					);
			});

			this.debugCube
				.add(material, 'wireframe');
		}

		this.scene.add(testCube);
	}

	setOnePlaneCreation()
	{
		const planeObject = {};
		planeObject.color = '#5e5c64';
		const geometry = new THREE.PlaneGeometry(
			1, 1,
			this.planeDivision, this.planeDivision
		);
		const material = new THREE.MeshBasicMaterial({
			color : planeObject.color,
			side : THREE.DoubleSide,
			wireframe : true
		});
		const plane = new THREE.Mesh(geometry, material);
		plane.rotateX(Math.PI / 2);
		this.scene.add(plane);

		// Plane debugging
		if (this.debug.active)
		{
			this.debugPlane
				.addColor(planeObject, 'color')
				.onChange(() => {
					material.color.set(planeObject.color)
			});

			this.debugPlane
				.add(plane.position, 'y', -0.5, 0.5, 0.1);

			planeObject.subdivision = 1;

			this.debugPlane
				.add(planeObject, 'subdivision')
				.min(1)
				.max(50)
				.step(1)
				.onFinishChange(() => {
					plane.geometry.dispose();
					plane.geometry = new THREE.PlaneGeometry(
						1, 1,
						planeObject.subdivision, planeObject.subdivision
					);
			});

			this.debugPlane
				.add(material, 'wireframe');
		}

	}
}
