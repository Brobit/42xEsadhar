import * as THREE from 'three';
import Sizes from "./Utils/sizes";
import Time from "./Utils/time";
import Camera from "./camera.js"
import Renderer from './renderer.js';
import World from './World/world.js';
import Debug from './Utils/debug.js';
import Light from './Utils/light.js';

let instance = null;

export default class Experience
{
	constructor(canvas)
	{
		// singleton
		if (instance)
		{
			return instance;
		}
		instance = this;

		// options
		this.canvas = canvas;

		// setup
		this.debug = new Debug();
		this.sizes = new Sizes();
		this.time = new Time();
		this.scene = new THREE.Scene();
		this.camera = new Camera();
		this.renderer = new Renderer();
		this.light = new Light();
		this.world = new World();
		console.log(navigator.maxTouchPoints);
		// if (navigator.maxTouchPoints <= 1)
			// this.keyboardHandler = new KeyboardHandler();
		// else if (navigator.maxTouchPoints > 1)
			// this.joystickhandler = new JoystickHandler();

		// resize event
		this.sizes.on('resize', () =>
		{
			this.resize();
		});

		// time tick event
		this.time.on('tick', () =>
		{
			this.update()
		})
	}

	resize()
	{
		this.camera.resize();
		this.renderer.resize();
	}

	update()
	{
		this.camera.update();
		this.renderer.update();
	}
}
