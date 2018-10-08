import { MeshPhongMaterial, MeshStandardMaterial, Object3D, TextureLoader } from 'three';
import { Moon } from './moon';
import { Planet } from './planet';
import { Star } from './star';

export class SolarSystem extends Object3D {
	public star: Star;

	public planets: Planet[] = [];

	constructor() {
		super();

		const textureLoader: TextureLoader = new TextureLoader();

		// Sol
		const sol: Star = new Star({
			name: 'Sol',
			equatorialRadius: 696_342_000
		});
		this.add(sol);
		this.star = sol;

		// Mercury
		const mercury: Planet = new Planet({
			name: 'Mercury',
			equatorialRadius: 2_439_700,
			rotationSpeed: 3_026,
			orbit: {
				pivot: this,
				semimajorAxis: 57_909_050_000,
				orbitalSpeed: 13_156.111,
				orbitalInclination: 3.38
			},
			material: new MeshStandardMaterial({
				bumpMap: textureLoader.load('assets/textures/mercury/mercurybump.jpg'),
				map: textureLoader.load('assets/textures/mercury/mercurymap.jpg')
			})
		});
		this.planets.push(mercury);

		// Earth
		const earth: Planet = new Planet({
			name: 'Earth',
			equatorialRadius: 60_378_100,
			rotationSpeed: 0,
			orbit: {
				pivot: this,
				semimajorAxis: 149_600_000_000,
				orbitalSpeed: 8.272_222_2,
				orbitalInclination: 7.155
			},
			material: new MeshPhongMaterial({
				bumpMap: textureLoader.load('assets/textures/earth/8081_earthbump10k.jpg'),
				map: textureLoader.load('assets/textures/earth/8081_earthmap10k.jpg'),
				specularMap: textureLoader.load('assets/textures/earth/8081_earthspec10k.jpg')
			})
		});
		this.planets.push(earth);

		// Moon
		const moon: Moon = new Moon({
			name: 'Earth',
			equatorialRadius: 1_737_000,
			rotationSpeed: 0,
			orbit: {
				pivot: earth,
				semimajorAxis: 384_400_000,
				orbitalSpeed: 0.283_888_89,
				orbitalInclination: 5.156
			},
			material: new MeshStandardMaterial({
				bumpMap: textureLoader.load('assets/textures/moon/moonbump4k.jpg'),
				map: textureLoader.load('assets/textures/moon/moonmap4k.jpg')
			})
		});
		earth.moons.push(moon);

		this.updateMatrixWorld(true);
		console.log('mercury position:', mercury.getWorldPosition(this.position));
	}
}
