import * as THREE from 'three'
import Experience from "./experience";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera
{
	constructor()
	{
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.cameraOffset = new THREE.Vector3(0, 0.05, 0.2);

		this.setInstance();
		// comment line under for prod
		// this.setControls();
	}

	setInstance()
	{
		if (navigator.maxTouchPoints <= 1)
			this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.01, 100);
		else
			this.instance = new THREE.PerspectiveCamera(65, this.sizes.width / this.sizes.height, 0.01, 100);
		// comment line under for prod
		// this.instance.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
		this.scene.add(this.instance);
	}

	setControls()
	{
		this.controls = new OrbitControls(this.instance, this.canvas);
		if (navigator.maxTouchPoints <= 1)
		{
			this.controls.minDistance = 2.2;
			this.controls.maxDistance = 3.2;
		}
		else if (navigator.maxTouchPoints > 1)
		{
			this.controls.minDistance = 4.2;
			this.controls.maxDistance = 5.2;
		}
		this.controls.maxPolarAngle = 1.8;
		this.controls.minPolarAngle = 1.1;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.15;
		this.controls.enablePan = true;
		this.controls.enableZoom = true;
	}

	removeControls()
	{
		this.controls.enabled = false;
		this.controls = null;
		// this.cameraPosition = (this.experience.keyboardHandler ? this.experience.keyboardHandler.cameraPosition : this.experience.joystickhandler.cameraPosition);
		// this.instance.position.copy(this.experience.mainCube.finalCube.position).add(this.cameraPosition);
	}

	resize()
	{
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update()
	{
		if (this.controls)
			this.controls.update();
	}
}
