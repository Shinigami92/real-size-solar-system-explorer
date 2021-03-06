import { AmbientLight, Clock, Math as ThreeMath, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { initMainGui } from './gui/main';
import { SolarSystem } from './system/solar-system';
import { FlyControls } from './three/examples/js/controls/FlyControls';
import { EffectComposer } from './three/examples/js/postprocessing/EffectComposer';
import { RenderPass } from './three/examples/js/postprocessing/RenderPass';

// Project
let screenWidth: number = window.innerWidth;
let screenHeight: number = window.innerHeight;
let aspect: number = screenWidth / screenHeight;

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let composer: EffectComposer;
let controls: FlyControls;
// var stats: any;

const CLOCK: Clock = new Clock();
let tick: number = 0;

let hud: HTMLDivElement;
let hudCamStats: HTMLPreElement;

const SPEED_OF_LIGHT: number = 299_792_458; // in m/s

// sizes in meter

// radius
// const solEquatorialRadius: number = 696_342_000;
const earthEquatorialRadius: number = 6_378_100;
// const moonEquatorialRadius: number = 1_737_000;

// distances
const distanceEarthToSun: number = 152_100_000_000;
// const distanceMoonToEarth: number = 384_400_000;

let SOLAR_SYSTEM: SolarSystem;

init();

function init(): void {
	scene = new Scene();
	// scene.fog = new FogExp2(0x0d0d0d, 0.000000000125);

	camera = new PerspectiveCamera(65, aspect, 10, 1_000_000_000_000);
	scene.add(camera);
	camera.rotation.reorder('YXZ');
	camera.lookAt(scene.position);
	camera.position.set(10_000_000, 1_000_000, distanceEarthToSun + earthEquatorialRadius * 3);

	controls = new FlyControls(camera);
	controls.dragToLook = true;
	controls.movementSpeed = SPEED_OF_LIGHT / 10; // speed of light m/s
	controls.rollSpeed = Math.PI / 6;

	scene.add(new AmbientLight(0x101010));

	renderer = new WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(screenWidth, screenHeight);
	// renderer.sortObjects = false;
	renderer.domElement.id = 'viewport';

	// stats = new Stats();

	initMainGui(camera);

	hud = document.createElement('div');
	hud.id = 'hud';
	hudCamStats = document.createElement('pre');
	hud.appendChild(hudCamStats);

	document.body.appendChild(renderer.domElement);
	// document.body.appendChild(stats.dom);
	document.body.appendChild(hud);
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keypress', onKeyPress, false);
	document.addEventListener('keyup', onKeyUp, false);

	composer = new EffectComposer(renderer);

	const renderPass: RenderPass = new RenderPass(scene, camera);
	renderPass.renderToScreen = true;
	composer.addPass(renderPass);

	SOLAR_SYSTEM = new SolarSystem();
	SOLAR_SYSTEM.position.set(0, 0, 0);
	scene.add(SOLAR_SYSTEM);

	setTimeout(() => {
		for (const planet of SOLAR_SYSTEM.planets) {
			console.log(planet.name, planet.getWorldPosition(scene.position));
			for (const moon of planet.moons) {
				console.log(planet.name, moon.name, moon.getWorldPosition(scene.position));
			}
		}
	}, 10_000);

	camera.position.set(-147531800, -18545116900, 148369874000);
	camera.rotation.set(-0.5, -2.37, 0.16, 'YZX');

	console.log(scene);

	animate();
}

function animate(): void {
	requestAnimationFrame(animate);
	const delta: number = CLOCK.getDelta();
	tick += delta * 1.0;
	if (tick < 0) {
		tick = 0;
	}

	controls.update(delta);
	composer.render(delta);
	// stats.update();

	const pitch: number = ThreeMath.radToDeg(camera.rotation.x);
	let yaw: number = -ThreeMath.radToDeg(camera.rotation.y);
	let roll: number = -ThreeMath.radToDeg(camera.rotation.z);
	if (yaw <= 0) {
		yaw += 360;
	}
	if (roll <= 0) {
		roll += 360;
	}

	const cameraPositionX: string = `${(camera.position.x / 1_000).toFixed(1)} km`;
	const cameraPositionY: string = `${(camera.position.y / 1_000).toFixed(1)} km`;
	const cameraPositionZ: string = `${(camera.position.z / 1_000).toFixed(1)} km`;
	hudCamStats.innerHTML = `Camera:
 Pos: x=${cameraPositionX}, y=${cameraPositionY}, z=${cameraPositionZ}
 Rot: pitch=${pitch.toFixed(2)}, yaw=${yaw.toFixed(2)}, roll=${roll.toFixed(2)}
      x=${camera.rotation.x.toFixed(2)}, y=${camera.rotation.y.toFixed(2)}, z=${camera.rotation.z.toFixed(2)}
 Speed: ${controls.movementSpeed} m/s, ${controls.movementSpeed / SPEED_OF_LIGHT} c`;

	for (const planet of SOLAR_SYSTEM.planets) {
		planet.update(delta);
		for (const moon of planet.moons) {
			moon.update(delta);
		}
	}
}

function onWindowResize(): void {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	aspect = screenWidth / screenHeight;

	renderer.setSize(screenWidth, screenHeight);

	camera.aspect = aspect;
	camera.updateProjectionMatrix();

	composer.reset();
}

function onKeyDown(event: KeyboardEvent): void {
	// console.log('keydown', event);
	switch (event.keyCode) {
		case 107: // NumpadAdd | +
		case 187: // BracketRight | +
			controls.movementSpeed *= 2;
			break;
		case 109: // NumpadSubtract | -
		case 189: // Slash | -
			controls.movementSpeed /= 2;
			break;
		case 16: // ShiftLeft
			if (!event.repeat) {
				controls.movementSpeed *= 2;
			}
			break;
	}
}

function onKeyPress(event: KeyboardEvent): void {
	// console.log('keypress', event);
	switch (event.keyCode) {
	}
}

function onKeyUp(event: KeyboardEvent): void {
	// console.log('keyup', event);
	switch (event.keyCode) {
		case 16: // ShiftLeft
			controls.movementSpeed /= 2;
			break;
	}
}
