import {
	AmbientLight,
	Clock,
	// FogExp2,
	Math as ThreeMath,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	Object3D,
	PerspectiveCamera,
	PointLight,
	Scene,
	SphereGeometry,
	Texture,
	TextureLoader,
	WebGLRenderer
} from 'three';
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
const solEquatorialRadius: number = 696_342_000;
const earthEquatorialRadius: number = 6_378_100;
const moonEquatorialRadius: number = 1_737_000;

// distances
const distanceEarthToSun: number = 152_100_000_000;
const distanceMoonToEarth: number = 384_400_000;

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

	// Sun
	const sunPivot: Object3D = new Object3D();

	const sunLight: PointLight = new PointLight(0xffffff, 1);
	sunPivot.add(sunLight);

	const sunGeometry: SphereGeometry = new SphereGeometry(solEquatorialRadius, 32, 32);
	const sunMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffff00 });
	const sunSphere: Mesh = new Mesh(sunGeometry, sunMaterial);
	sunPivot.add(sunSphere);

	scene.add(sunPivot);

	// Earth
	const earthPivot: Object3D = new Object3D();
	earthPivot.position.set(0, 0, distanceEarthToSun);

	const earthGeometry: SphereGeometry = new SphereGeometry(earthEquatorialRadius, 32, 32);
	const earthColorMap: Texture = new TextureLoader().load('assets/textures/earth/8081_earthmap10k.jpg');
	const earthBumpMap: Texture = new TextureLoader().load('assets/textures/earth/8081_earthbump10k.jpg');
	const earthSpecMap: Texture = new TextureLoader().load('assets/textures/earth/8081_earthspec10k.jpg');
	const earthMaterial: MeshPhongMaterial = new MeshPhongMaterial({
		map: earthColorMap,
		bumpMap: earthBumpMap,
		specularMap: earthSpecMap
	});
	const earthSphere: Mesh = new Mesh(earthGeometry, earthMaterial);
	earthSphere.rotateX(ThreeMath.degToRad(7.155));
	earthPivot.add(earthSphere);

	sunPivot.add(earthPivot);

	// Moon
	const moonPivot: Object3D = new Object3D();
	moonPivot.position.set(distanceMoonToEarth, 0, 0);

	const moonGeometry: SphereGeometry = new SphereGeometry(moonEquatorialRadius, 32, 32);
	const moonColorMap: Texture = new TextureLoader().load('assets/textures/moon/moonmap4k.jpg');
	const moonBumpMap: Texture = new TextureLoader().load('assets/textures/moon/moonbump4k.jpg');
	const moonMaterial: MeshStandardMaterial = new MeshStandardMaterial({
		map: moonColorMap,
		bumpMap: moonBumpMap
	});
	const moonSphere: Mesh = new Mesh(moonGeometry, moonMaterial);
	moonPivot.add(moonSphere);

	earthPivot.add(moonPivot);

	camera.position.set(396157656, 1820796, 152098504138);
	camera.rotation.set(ThreeMath.degToRad(173.64), ThreeMath.degToRad(129.95), ThreeMath.degToRad(185.04), 'XYZ');

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
