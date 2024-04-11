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
//		this.setControls();
	}

	setInstance()
	{
		this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
//		this.instance.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
		this.scene.add(this.instance);
	}

	setControls()
	{
		this.controls = new OrbitControls(this.instance, this.canvas);
		// this.controls.minDistance = 0.2;
		// this.controls.maxDistance = 0.2;
		// this.controls.maxPolarAngle = 1.25;
		// this.controls.minPolarAngle = 1.25;
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.5;
		this.controls.enablePan = false;
		this.controls.enableZoom = false;
	}

	resize()
	{
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update()
	{
//		this.controls.update();
	}
}
