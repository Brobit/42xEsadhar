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
		this.setOrbitInstance();
		this.setControls();
	}

	setInstance()
	{
		this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
		this.instance.position.set(0, 0.05, 0.2);
		this.scene.add(this.instance);
	}

	setOrbitInstance()
	{
		this.orbitInstance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
		this.orbitInstance.position.set(0, 0.05, 0.2);
		this.scene.add(this.orbitInstance);
	}

	setControls()
	{
		this.controls = new OrbitControls(this.orbitInstance, this.canvas);
		this.controls.enableDamping = true;
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
