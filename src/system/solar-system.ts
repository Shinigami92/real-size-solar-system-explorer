import {
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	Object3D,
	OBJLoader,
	TextureLoader
} from 'three';
import 'three/examples/js/loaders/OBJLoader';
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
			equatorialRadius: 696_342_000,
			material: new MeshBasicMaterial({
				map: textureLoader.load('assets/textures/sol/sunmap.jpg')
			})
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

		// Venus
		const venus: Planet = new Planet({
			name: 'Venus',
			equatorialRadius: 6_051_800,
			rotationSpeed: 1.81,
			orbit: {
				pivot: this,
				semimajorAxis: 108_208_000_000,
				orbitalSpeed: 9.727_777_8,
				orbitalInclination: 3.86
			},
			// material: new MeshStandardMaterial({
			// 	bumpMap: textureLoader.load('assets/textures/venus/venusbump.jpg'),
			// 	map: textureLoader.load('assets/textures/venus/venusmap.jpg')
			// }),
			material: new MeshStandardMaterial({
				bumpMap: textureLoader.load('assets/textures/venus/venusbump.jpg'),
				map: textureLoader.load('assets/textures/venus/8k_venus_surface.jpg')
				// map: textureLoader.load('assets/textures/venus/8k_venus_atmosphere.jpg')
			})
		});
		this.planets.push(venus);

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
			// material: new MeshPhongMaterial({
			// 	bumpMap: textureLoader.load('assets/textures/earth/8081_earthbump10k.jpg'),
			// 	map: textureLoader.load('assets/textures/earth/8081_earthmap10k.jpg'),
			// 	specularMap: textureLoader.load('assets/textures/earth/8081_earthspec10k.jpg')
			// }),
			material: new MeshPhongMaterial({
				bumpMap: textureLoader.load('assets/textures/earth/8081_earthbump10k.jpg'),
				map: textureLoader.load('assets/textures/earth/8k_earth_daymap.jpg'),
				normalMap: textureLoader.load('assets/textures/earth/8k_earth_normal_map.png'),
				specularMap: textureLoader.load('assets/textures/earth/8k_earth_specular_map.png')
			})
		});
		this.planets.push(earth);

		// Moon
		const moon: Moon = new Moon({
			name: 'Moon',
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

		// Mars
		const mars: Planet = new Planet({
			name: 'Mars',
			equatorialRadius: 3_396_200,
			rotationSpeed: 241.17, // 241.17 m/s
			orbit: {
				pivot: this,
				semimajorAxis: 227_939_200_000,
				orbitalSpeed: 24_007, // 24.007 km/s
				orbitalInclination: 5.65
			},
			material: new MeshPhongMaterial({
				bumpMap: textureLoader.load('assets/textures/mars/marsbump1k.jpg'),
				map: textureLoader.load('assets/textures/mars/8k_mars.jpg'),
				normalMap: textureLoader.load('assets/textures/mars/mars_1k_normal.jpg')
			})
		});
		this.planets.push(mars);

		const objLoader: OBJLoader = new OBJLoader();

		// Phobos
		objLoader.load(
			'assets/objects/mars/Phobos Oberst.obj',
			(object: Group) => {
				// console.log(object);
				const mesh: Mesh = object.children[0] as Mesh;
				mesh.scale.setScalar(2_200);
				const phobos: Moon = new Moon({
					name: 'Phobos',
					equatorialRadius: 22_000, // (26,8 × 22,4 × 18,4) km
					rotationSpeed: 0,
					orbit: {
						pivot: mars,
						semimajorAxis: 9_378_000,
						orbitalSpeed: 2_139_000, // 2,139 km/s
						orbitalInclination: 1.075
					},
					material: new MeshStandardMaterial({
						bumpMap: textureLoader.load('assets/textures/mars/phobosbump.jpg'),
						map: textureLoader.load('assets/textures/mars/Phobos Grayscale.jpg')
					}),
					mesh
				});
				mars.moons.push(phobos);
			},
			(xhr: ProgressEvent) => console.debug(`${(xhr.loaded / xhr.total) * 100}% loaded`),
			(error: ErrorEvent) => console.warn('An error happened', error)
		);

		// Deimos
		objLoader.load(
			'assets/objects/mars/Deimos Thomas.obj',
			(object: Group) => {
				// console.log(object);
				const mesh: Mesh = object.children[0] as Mesh;
				mesh.scale.setScalar(1_220);
				const deimos: Moon = new Moon({
					name: 'Deimos',
					equatorialRadius: 12_200, // (15,0 × 12,2 × 10,4) km
					rotationSpeed: 0,
					orbit: {
						pivot: mars,
						semimajorAxis: 23_459_000, // 23.459 km
						orbitalSpeed: 1_351_000, // 1,351 km/s
						orbitalInclination: 0.93
					},
					material: new MeshStandardMaterial({
						bumpMap: textureLoader.load('assets/textures/mars/deimosbump.jpg'),
						map: textureLoader.load('assets/textures/mars/Deimos Grayscale.jpg')
					}),
					mesh
				});
				mars.moons.push(deimos);
			},
			(xhr: ProgressEvent) => console.debug(`${(xhr.loaded / xhr.total) * 100}% loaded`),
			(error: ErrorEvent) => console.warn('An error happened', error)
		);
	}
}
