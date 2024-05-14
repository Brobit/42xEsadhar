import * as THREE from 'three';
import Experience from '../experience';

export default class Light
{
	constructor()
	{
		this.experience = new Experience();
		this.scene = this.experience.scene;
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(ambientLight);
	}
}
