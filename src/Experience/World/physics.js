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

		// get debug info
		this.debug = this.experience.debug;

		// get player cube info
		this.cube = this.experience.mainCube.finalCube;
		this.cubeSize = this.experience.mainCube.cubeSize;
		this.mainCubePosition = this.experience.mainCube.position;

		// get camera info
		this.camera = this.experience.camera.instance;
		this.cameraOffset = this.experience.camera.cameraOffset;

		// get the three.js scene]
		this.scene = this.experience.scene;

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

		this.setMaterial();

		this.world.addContactMaterial(this.defaultContactMaterial);
		this.world.defaultContactMaterial = this.defaultContactMaterial;

		// general variable
		this.sphereSize = 0.011;

		// create variable for the ennemy cube
		this.ennemyCubeArray = [];
		this.ennemyAlive = 0;
		this.ennemyMaxNumber = 5;

		// check collision
		this.ObjectCollisionMatrix = new CANNON.ObjectCollisionMatrix();

		this.setCubeBody();
		this.setEnnemyCube();
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

	setMaterial()
	{
		// create material for physics
		this.defaultMaterial = new CANNON.Material('default');
		this.playerMaterial = new CANNON.Material('player');
		this.ennemyMaterial = new CANNON.Material('ennemy');

		// tell the beahavior if to material collide
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.defaultMaterial,
			{
				friction: 0.1,
				restitution: 0.1
			}
		);

		this.playerEnvironnmentContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.playerMaterial,
			{
				friction : 0.1,
				restitution : 0.1
			}
		);

		this.ennemyEnvironmentContactMaterial = new CANNON.ContactMaterial(
			this.defaultMaterial,
			this.ennemyMaterial,
			{
				friction : 0.1,
				restitution : 0.1
			}
		);
		
		this.playerEnnemyCollisionContactMaterial = new CANNON.ContactMaterial(
			this.playerMaterial,
			this.ennemyMaterial,
			{
				friction : 0.1,
				restitution : 0.5
			}
		);
	}

	setCubeBody()
	{
		this.cubeShape = new CANNON.Sphere(this.sphereSize);
		this.cubeBody = new CANNON.Body({
			mass : 1,
			shape : this.cubeShape,
			linearDamping : 0.5,
			angularDamping : 1,
			material : this.playerMaterial,
			collisionFilterGroup : 1,
			collisionFilterMask : 1
		});
		this.cubeBody.position.set(0, 0.011, 0);
		this.world.addBody(this.cubeBody);
	}

	setEnnemyCube()
	{
		// create the mesh template
		const ennemyGeometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
		const ennemyMaterial = new THREE.MeshBasicMaterial({color : "#62a0ea"});

		//create the body template
		const ennemyShape = new CANNON.Sphere(this.sphereSize);

		for (; this.ennemyAlive < this.ennemyMaxNumber ; this.ennemyAlive++)
		{
			const x = Math.random() - 0.5;
			const y = this.cubeBody.position.y;
			const z = Math.random() - 0.5; 

			// create the mesh
			const ennemyMesh = new THREE.Mesh(ennemyGeometry, ennemyMaterial);

			// create the body
			const ennemyBody = new CANNON.Body({
				mass : 1,
				shape : ennemyShape,
				linearDamping : 0.5,
				angularDamping : 1,
				material : this.ennemyMaterial,
				collisionFilterGroup : 1,
				collisionFilterMask : 1
			});
			ennemyBody.position.set(x, y, z);
			ennemyMesh.position.copy(ennemyBody.position);

			this.scene.add(ennemyMesh);
			this.world.addBody(ennemyBody);

			this.ennemyCubeArray.push({mesh : ennemyMesh, body : ennemyBody});
		}
		console.log(this.ennemyCubeArray);
		for (const e of this.ennemyCubeArray)
		{
			console.log(e.mesh.isObject3D);
		}
	}

	setPlanesBody()
	{
		const planeShape = new CANNON.Plane();
		this.planeBody = new CANNON.Body({
			mass : 0,
			position : new CANNON.Vec3(0, 0.001, 0),
			material : this.defaultMaterial,
			shape : planeShape,
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

		// check if there is always 5 ennemy cube
		if (this.ennemyAlive < this.ennemyMaxNumber)
			this.setEnnemyCube();

		// update ennemy mesh position with their bodies
		for (const ennemyCube of this.ennemyCubeArray) {
			// move the ennemyCube if it is not asleep
			if (ennemyCube.body.sleepState == 0)
			{
				// compute direction to the player cube
				const direction = new CANNON.Vec3();
				this.cubeBody.position.vsub(ennemyCube.body.position, direction);
				direction.y = 0;
				direction.normalize();

				// get the roatation betwwen forward and direction vector
				const forward = new CANNON.Vec3(0, 0, 1);
				ennemyCube.body.quaternion.setFromVectors(forward, direction);

				//apply movement
				const speed = 0.075;
				direction.scale(speed, ennemyCube.body.velocity);

				// update the mesh position & quaternian
				ennemyCube.mesh.position.copy(ennemyCube.body.position);
				ennemyCube.mesh.quaternion.copy(ennemyCube.body.quaternion);
			}
		}

		// update wrld at 60hz
		this.world.fixedStep(1/120);

		// recall update function to update in continue
		  window.requestAnimationFrame(() => {
		  	this.update();
		  })
	}
}
