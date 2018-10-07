import { AmbientLight, Clock, FogExp2, Math as ThreeMath, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
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

init();

function init(): void {
	scene = new Scene();
	scene.fog = new FogExp2(0x0d0d0d, 0.0000125);

	camera = new PerspectiveCamera(65, aspect, 0.1, 1e6);
	scene.add(camera);
	camera.rotation.reorder('YXZ');
	camera.lookAt(scene.position);

	controls = new FlyControls(camera);
	controls.dragToLook = true;
	controls.movementSpeed = 250;
	controls.rollSpeed = Math.PI / 6;

	scene.add(new AmbientLight(0x404040));

	renderer = new WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(screenWidth, screenHeight);
	// renderer.sortObjects = false;
	renderer.domElement.id = 'viewport';

	// stats = new Stats();

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
	hudCamStats.innerHTML = `Camera:
 Pos: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}
 Rot: pitch=${pitch.toFixed(2)}, yaw=${yaw.toFixed(2)}, roll=${roll.toFixed(2)}
 Speed: ${controls.movementSpeed}`;
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
