import * as THREE from 'three';
import Experience from "../experience";
//import Debug from '../Utils/debug';

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
			this.debugAllPlane = this.debug.ui.addFolder('all planes');
			const axesHelper = new THREE.AxesHelper(3);
			this.scene.add(axesHelper);
		}

		this.setCubeCreation();
		this.setOnePlaneCreation();
		this.setPlanes();
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
		plane.visible = false;
		plane.rotateX(Math.PI / 2);
		this.scene.add(plane);

		// Plane debugging
		if (this.debug.active)
		{
			this.debugPlane
				.add(plane, 'visible');

			this.debugPlane
				.addColor(planeObject, 'color')
				.onChange(() => {
					material.color.set(planeObject.color)
			});

			this.debugPlane
				.add(plane.position, 'y', -0.4, 0.4, 0.1);

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

	setPlanes()
	{
		const objectToAdd = new THREE.Group();
		const planeObject = {};
		planeObject.color = '#6622aa';
		const geometry = new THREE.PlaneGeometry(
			1, 1,
			this.planeDivision, this.planeDivision
		);
		const material = new THREE.MeshBasicMaterial({
			color : planeObject.color,
			side : THREE.DoubleSide,
			wireframe : true
		});

		for (let positionY = -0.499; positionY <= 0.499; positionY += 0.1)
		{
			const plane = new THREE.Mesh(geometry, material);
			plane.rotateX(Math.PI / 2);
			plane.position.setY(positionY);
			objectToAdd.add(plane);
			
		}
		this.scene.add(objectToAdd);
		
		if (this.debug.active)
		{
			this.debugAllPlane
					.addColor(planeObject, 'color')
					.onChange(() => {
						material.color.set(planeObject.color)
			});

			this.debugAllPlane
				.add(objectToAdd.position, 'y', -0.4, 0.4, 0.1);

			planeObject.subdivision = 1;

			this.debugAllPlane
				.add(planeObject, 'subdivision')
				.min(1)
				.max(50)
				.step(1)
				.onFinishChange(() => {
					objectToAdd.clear();
					const newGeometry = new THREE.PlaneGeometry(
						1, 1,
						planeObject.subdivision, planeObject.subdivision
					);
					for (let positionY = -0.4; positionY <= 0.4; positionY += 0.1)
					{
						const plane = new THREE.Mesh(newGeometry, material);
						plane.rotateX(Math.PI / 2);
						plane.position.setY(positionY);
						objectToAdd.add(plane);
					};
				});

			this.debugAllPlane
				.add(material, 'wireframe');
		}
	}
}
