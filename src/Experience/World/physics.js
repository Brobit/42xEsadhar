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
//		this.camera.lookAt(this.cube.position);
		this.cameraOffset = this.experience.camera.cameraOffset;

		// create cannon js world
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);

		// instanciate cannon debugger
		this.cannonDebugger = new CannonDebugger(this.experience.scene, this.world, {
			onInit(body, mesh) {
				mesh.visible = !mesh.visible;
				window.addEventListener('keydown', (event) => {
					if (event.key == 'e')
						mesh.visible = !mesh.visible;
				})
			}
			}
		);
		if (this.debug.active)
			this.debug.ui.addFolder("press 'e' to toggle physic");

		// create material for physics
		this.defaultMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.defaultMaterial,
			{
				friction: 0.1,
				restitution: 0.1
			}
		)
		this.world.addContactMaterial(this.defaultContactMaterial);
		this.world.defaultContactMaterial = this.defaultContactMaterial;

		this.setCubeBody();
		this.setPlanesBody();
		this.setBorder();

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
		this.planeBody = new CANNON.Body({
			mass : 0,
			position : new CANNON.Vec3(0, 0.001, 0),
			material : this.defaultMaterial,
		shape : planeShape
		});
		this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5);
		this.world.addBody(this.planeBody);
	}

	setBorder()
	{
		const border = new CANNON.Plane();
		this.borderBody1 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0.499, 0, 0), // facing x axea
			shape : border
		});
		this.borderBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), Math.PI * 0.5);
		this.borderBody2 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(-0.499, 0, 0), // facing -x axes
			shape : border
		});
		this.borderBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5);
		this.borderBody3 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0, 0, 0.499), // facing z axes
			shape : border
		});
		this.borderBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
		this.borderBody4 = new CANNON.Body({
			mass : 0,
			material : this.defaultMaterial,
			position : new CANNON.Vec3(0, 0, -0.499), // facing -z axes
			shape : border
		});

		this.world.addBody(this.borderBody1);
		this.world.addBody(this.borderBody2);
		this.world.addBody(this.borderBody3);
		this.world.addBody(this.borderBody4);
	}
	
	update()
	{
		// enable physical debugger
		if (this.debug.active)
			this.cannonDebugger.update();
		
		// apply the physical world to the cube in the scene
		this.cube.position.copy(this.cubeBody.position);
		this.cube.quaternion.copy(this.cubeBody.quaternion);

		// update camera to follow the player
		// update perspective camera
		// const objectPosition = new THREE.Vector3();
		// this.cube.getWorldPosition(objectPosition);
		// this.camera.position.copy(objectPosition).add(this.cameraOffset);


		// update wrld at 60hz
		this.world.fixedStep(1/120);

		// recall update function to update in continue
		  window.requestAnimationFrame(() => {
		  	this.update();
		  })
	}
}
