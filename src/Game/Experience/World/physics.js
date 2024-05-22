import * as THREE from 'three';
import * as CANNON from "cannon-es";
import gsap from "gsap";
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
		this.camera = this.experience.camera;
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

		// get info about the masking cube
		this.arrayOfMaskingCube = this.experience.mainCube.arrayOfMaskingCube;
		// get the info about the assetOfCubeAsset
		this.arrayOfCubeAsset = this.experience.mainCube.arrayOfCubeAsset;

		this.plane = this.experience.world.plane;

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

		//create the body template
		const ennemyShape = new CANNON.Sphere(this.sphereSize);

		for (; this.ennemyAlive < this.ennemyMaxNumber ; this.ennemyAlive++)
		{
			const x = Math.random() - 0.5;
			const y = this.cubeBody.position.y;
			const z = Math.random() - 0.5; 

			const ennemyMaterial = new THREE.MeshBasicMaterial({
				color : "#62a0ea",
				transparent : true
			});

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
			ennemyMesh.renderOrder = -2;

			this.scene.add(ennemyMesh);
			this.world.addBody(ennemyBody);

			this.ennemyCubeArray.push({mesh : ennemyMesh, body : ennemyBody});
		}
		// console.log(this.ennemyCubeArray);
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

	removeMaskingCube(cubeRemoved)
	{
		// console.log(this.arrayOfCubeAsset)
		// cubeRemoved.mesh.position.y += 4;
		// console.log(cubeRemoved.mesh.position.y , cubeRemoved.ennemyCubePerimeter.yNeg, cubeRemoved.ennemyCubePerimeter.yPos);
		// for (const cube of this.arrayOfCubeAsset)
		// {
			// if ((cube.fakePosition.x > cubeRemoved.ennemyCubePerimeter.xNeg
			// 	&& cube.fakePosition.x < cubeRemoved.ennemyCubePerimeter.xPos)
			// && (cube.fakePosition.z > cubeRemoved.ennemyCubePerimeter.zNeg
			// 	&& cube.fakePosition.z < cubeRemoved.ennemyCubePerimeter.zPos))
			// && (cube.fakePosition.y > cubeRemoved.ennemyCubePerimeter.yNeg
			// 	&& cube.fakePosition.y < cubeRemoved.ennemyCubePerimeter.yPos))
			// if (cube.position.y > cubeRemoved.ennemyCubePerimeter.yNeg
			// 	&& cube.position.y < cubeRemoved.ennemyCubePerimeter.yPos)
			// {
			// 	if (cube.visible == false)
			// 	{
			// 		cube.visible = true;
			// 		// console.log(cube);
			// 	}
			// }

			// console.log(cube.fakePosition);
			// if (cube.fakePosition.y > 0.35
			// 	&& cube.fakePosition.y < 0.4)
			// {
			// 	console.log(cube.fakePosition);
			// 	if (cube.visible == false)
			// 	{
			// 		cube.visible = true;
			// 		// console.log(cube);
			// 	}
			// }
		// }

		for (const maskingCube of this.arrayOfMaskingCube)
		{
			// if ((cubeRemoved[0].mesh.position.x > maskingCube.perimeter.xNeg
			// 	&& cubeRemoved[0].mesh.position.x < maskingCube.perimeter.xPos)
			// && (cubeRemoved[0].mesh.position.z > maskingCube.perimeter.zNeg
			// 	&& cubeRemoved[0].mesh.position.z < maskingCube.perimeter.zPos)
			// && (cubeRemoved[0].mesh.position.y > maskingCube.perimeter.yNeg
			// 	&& cubeRemoved[0].mesh.position.y < maskingCube.perimeter.yPos))
			// {
			// 	// console.log(maskingCube);
			// 	// console.log('pilou');
			//
			// 	// const maskingCubeBody = new CANNON.Body({
			// 	// 	mass : 0,
			// 	// 	shape : new CANNON.Box(new CANNON.Vec3(0.1 / 2, 0.1 / 2, 0.1 / 2)),
			// 	// 	position : maskingCube.mesh.position
			// 	// });
			// 	// this.world.addBody(maskingCubeBody);
			// 	// const sphereBody = new CANNON.Body({
			// 	// 	mass : 0,
			// 	// 	shape : new CANNON.Sphere(0.05),
			// 	// 	position : maskingCube.mesh.position
			// 	// })
			// 	// sphereBody.position.y -= 0.03;
			// 	// this.world.addBody(sphereBody);
				// const index = this.arrayOfMaskingCube.indexOf(maskingCube);
				// maskingCube.mesh.renderOrder = 0;
				// maskingCube.geometry.dispose();
				// maskingCube.material.dispose();
				// this.scene.remove(maskingCube.mesh);
				// this.arrayOfMaskingCube.splice(index, 1);




			if ((cubeRemoved.mesh.position.x > maskingCube.perimeter.xNeg
				&& cubeRemoved.mesh.position.x < maskingCube.perimeter.xPos)
			&& (cubeRemoved.mesh.position.z > maskingCube.perimeter.zNeg
				&& cubeRemoved.mesh.position.z < maskingCube.perimeter.zPos)
			&& (cubeRemoved.mesh.position.y > maskingCube.perimeter.yNeg
				&& cubeRemoved.mesh.position.y < maskingCube.perimeter.yPos))
			{
				const index = this.arrayOfMaskingCube.indexOf(maskingCube);
				// maskingCube.mesh.renderOrder = 0;
				// maskingCube.geometry.dispose();
				// maskingCube.material.dispose();

				// maskingCube.mesh.material.transparent = false;
				// maskingCube.mesh.material.colorWrite = true;
				maskingCube.material.color.set(this.getRandomColor());
				maskingCube.mesh.visible = true;
				console.log(maskingCube);

				// this.scene.remove(maskingCube.mesh);
				// console.log(this.arrayOfMaskingCube[index]);
				this.arrayOfMaskingCube.splice(index, 1);
			}
		}
	}

	getRandomColor()
	{
		const colorChoice = Math.random() * 4;
		if (colorChoice >= 0 && colorChoice < 1)
			return (this.getRandomColorGreen());
		else if (colorChoice >= 1 && colorChoice < 2)
			return (this.getRandomColorBlue());
		else if (colorChoice >= 2 && colorChoice < 3)
			return (this.getRandomColorRose());
		else
			return (this.getRandomColorBrown());
	}

	getRandomColorGreen()
	{
		const r = Math.floor(Math.random() * 23) + 49;
		const g = Math.floor(Math.random() * 123) + 51;
		const b = Math.floor(Math.random() * 19) + 39;

		return (this.convertToHex(r, g, b));
	}

	getRandomColorBlue()
	{
		const r = Math.floor(Math.random() * 57) + 63;
		const g = Math.floor(Math.random() * 48) + 121;
		const b = Math.floor(Math.random() * 40) + 170;

		return (this.convertToHex(r, g, b));
	}

	getRandomColorRose()
	{
		const r = Math.floor(Math.random() * 54) + 238;
		const g = Math.floor(Math.random() * 87) + 161;
		const b = Math.floor(Math.random() * 67) + 208;

		return (this.convertToHex(r, g, b));
	}

	getRandomColorBrown()
	{
		const r = Math.floor(Math.random() * 36) + 133;
		const g = Math.floor(Math.random() * 36) + 88;
		const b = Math.floor(Math.random() * 51) + 68;

		return (this.convertToHex(r, g, b));
	}
	
	convertToHex(r, g, b)
	{
		const hexR = r.toString(16).padStart(2, '0');
		const hexG = g.toString(16).padStart(2, '0');
		const hexB = b.toString(16).padStart(2, '0');

		const color = `#${hexR}${hexG}${hexB}`;
		return (color);
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

		if (!this.camera.controls)
		{
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
					// const speed = 0.075;
					const speed = 0.125;
					direction.scale(speed, ennemyCube.body.velocity);

					// update the mesh position & quaternian
					ennemyCube.mesh.position.copy(ennemyCube.body.position);
					ennemyCube.mesh.quaternion.copy(ennemyCube.body.quaternion);
					// console.log(ennemyCube.mesh.position);
				}
			}

			for (const ennemyCube of this.ennemyCubeArray)
			{
				if (ennemyCube.body.sleepState === 1 || ennemyCube.body.sleepState === 2)
				{
					// gsap.to(ennemyCube.mesh.material, {
					// 	duration : 2,
					// 	opacity : 0,
					// 	onComplete : () => {
					// 		this.world.removeBody(ennemyCube.body);
					// 		this.scene.remove(ennemyCube.mesh);
					// 	}
					// })

					const normPos = new THREE.Vector3();
					normPos.copy(ennemyCube.mesh.position).normalize();
					const ennemyCubePerimeter = {
						"xPos" : normPos.x + 0.05,
						"xNeg" : normPos.x - 0.05,
						"zNeg" : normPos.z - 0.05,
						"zPos" : normPos.z + 0.05,
						"yNeg" : normPos.y,
						"yPos" : normPos.y + 0.05
					};

					ennemyCube.ennemyCubePerimeter = ennemyCubePerimeter;
					this.removeMaskingCube(ennemyCube);

					this.world.removeBody(ennemyCube.body);
					this.scene.remove(ennemyCube.mesh);
					const index = this.ennemyCubeArray.indexOf(ennemyCube);
					const removed = this.ennemyCubeArray.splice(index, 1);
					this.ennemyAlive--;
				}
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
