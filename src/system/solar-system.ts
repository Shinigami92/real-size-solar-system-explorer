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

		const sol: Star = new Star({
			name: 'Sol',
			equatorialRadius: 696_342_000
		});
		this.add(sol);
		this.star = sol;

		const earth: Planet = new Planet({
			name: 'Earth',
			equatorialRadius: 60_378_100,
			rotationSpeed: 0,
			orbit: {
				pivot: this,
				semimajorAxis: 149_600_000_000,
				orbitalSpeed: 29_780,
				orbitalInclination: 7.155
			},
			material: new MeshPhongMaterial({
				bumpMap: textureLoader.load('assets/textures/earth/8081_earthbump10k.jpg'),
				map: textureLoader.load('assets/textures/earth/8081_earthmap10k.jpg'),
				specularMap: textureLoader.load('assets/textures/earth/8081_earthspec10k.jpg')
			})
		});
		this.planets.push(earth);

		const moon: Moon = new Moon({
			name: 'Earth',
			equatorialRadius: 1_737_000,
			rotationSpeed: 0,
			orbit: {
				pivot: earth,
				semimajorAxis: 384_400_000,
				orbitalSpeed: 1_022,
				orbitalInclination: 5.156
			},
			material: new MeshStandardMaterial({
				bumpMap: textureLoader.load('assets/textures/moon/moonbump4k.jpg'),
				map: textureLoader.load('assets/textures/moon/moonmap4k.jpg')
			})
		});
		earth.moons.push(moon);
	}
}
