import * as THREE from 'three';
import * as CANNON from "cannon-es";
import Experience from "../experience";
import CannonDebugger from 'cannon-es-debugger';

export default class PhysicalWorld
{
	constructor()
	{
		// get info from the scene
		this.experience = new Experience();

		this.debug = this.experience.debug;

		this.cube = this.experience.mainCube.finalCube;
		this.cubeSize = this.experience.mainCube.cubeSize;
		this.mainCubePosition = this.experience.mainCube.position;

		this.camera = this.experience.camera.instance;
		this.camera.lookAt(this.cube.position);
		this.cameraOffset = this.experience.camera.cameraOffset;

		// create cannon js world
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);

		// instanciate cannon debugger
		this.cannonDebugger = new CannonDebugger(this.experience.scene, this.world, {
			onInit(body, mesh) {
				window.addEventListener('keydown', (event) => {
					if (event.key == 'e')
						mesh.visible = !mesh.visible;
				})
			}
			}
		);
		if (this.debug.active)
			this.debug.ui.addFolder("appuyer sur 'e' pour afficher/retirer l'affichage de la physique")

		// create material for physics
		this.defaultMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.defaultMaterial,
			{
				friction: 0.1,
				restitution: 0.3
			}
		)
		this.world.addContactMaterial(this.defaultContactMaterial);
		this.world.defaultContactMaterial = this.defaultContactMaterial;

		this.setCubeBody();
		this.setPlanesBody();
		this.setBorder();

		this.setKeyListener();
		this.update();

	}

	toggleDebuger()
	{
		if (this.cannonIsActive)
		{
			this.cannonDebugger.disable();
			this.cannonIsActive = false;
		}
		else
		{
			this.cannonDebugger.enable();
			this.cannonIsActive = true;
		}
	}

	setCubeBody()
	{
		this.cubeShape = new CANNON.Sphere(0.011);
		this.cubeBody = new CANNON.Body({
			mass : 1,
			shape : this.cubeShape,
			linearDamping : 0.5,
			angularDamping : 1,
			material : this.defaultMaterial
		});
		this.cubeBody.position.set(0, 0.011, 0);
		this.world.addBody(this.cubeBody);
	}

	setPlanesBody()
	{
		const planeShape = new CANNON.Plane();
		this.planeBody = new CANNON.Body();
		this.planeBody.mass = 0;
		this.planeBody.position.y = 0.001;;
		this.planeBody.material = this.defaultMaterial;
		this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5);
		this.planeBody.addShape(planeShape);
		this.world.addBody(this.planeBody);
	}

	setBorder()
	{
		const border1 = new CANNON.Plane();
		const border2 = new CANNON.Plane();
		const border3 = new CANNON.Plane();
		const border4 = new CANNON.Plane();
		this.borderBody1 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0.499, 0, 0), // facing x axea
			shape : border1
		});
		this.borderBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), Math.PI * 0.5);
		this.borderBody2 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(-0.499, 0, 0), // facing -x axes
			shape : border2
		});
		this.borderBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5);
		this.borderBody3 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0, 0, 0.499), // facing z axes
			shape : border3
		});
		this.borderBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
		this.borderBody4 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0, 0, -0.499), // facing -z axes
			shape : border4
		});

		this.world.addBody(this.borderBody1);
		this.world.addBody(this.borderBody2);
		this.world.addBody(this.borderBody3);
		this.world.addBody(this.borderBody4);
	}
	
	setKeyListener()
	{
		this.throttle = null;

		// Object to track active keys
		this.activeKeys = {};

		// Speed of movement
		this.speed = 0.3;

		this.vz = this.vx = 0;

		window.addEventListener('keydown', (event) => {
			// Update activeKeys object
			this.activeKeys[event.key] = true;
			console.log(this.activeKeys[event.key]);

			// // Calculate velocity changes based on active keys
			this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
			this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W
			
			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
			
			this.throttle = setTimeout(() => {
				this.throttle = null;
			}, 1000);
		});

		document.addEventListener('keyup', (event) => {
			// Update activeKeys object
			this.activeKeys[event.key] = false;

			// Reset cube velocity
			this.vx = (this.activeKeys["d"] ? this.speed : 0) - (this.activeKeys["a"] ? this.speed : 0); // D - A
			this.vz = (this.activeKeys["s"] ? this.speed : 0) - (this.activeKeys["w"] ? this.speed : 0); // S - W

			// Reset throttle timer
			if (this.throttle) {
				clearTimeout(this.throttle);
				this.throttle = null;
			}
		});
	}

	update()
	{
		// enable physical debugger
		if (this.debug.active)
			this.cannonDebugger.update();
		
		// Apply velocity changes
		this.cubeBody.velocity.x = this.vx;
		this.cubeBody.velocity.z = this.vz;

		// apply the physical world to the cube in the scene
		this.cube.position.copy(this.cubeBody.position);

		// update camera to follow the player
		const objectPosition = new THREE.Vector3();
		this.cube.getWorldPosition(objectPosition);
		this.camera.position.copy(objectPosition).add(this.cameraOffset);


		// update wrld at 60hz
		this.world.fixedStep();

		// recall tick function to update in continue
		  window.requestAnimationFrame(() => {
		  	this.update();
		  })
	}
}

//export { PhysicalWorld };
