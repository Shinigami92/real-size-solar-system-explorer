import { MeshPhongMaterial, MeshStandardMaterial } from 'three';
import { Moon } from './moon';
import { OrbitOption, Planetoid } from './planetoid';

export interface PlanetOption {
	name: string;
	equatorialRadius: number;
	rotationSpeed: number;
	rotationPeriod?: number;
	orbit: OrbitOption;
	material: MeshStandardMaterial | MeshPhongMaterial;
}

export class Planet extends Planetoid {
	public moons: Moon[] = [];
	constructor({ name, equatorialRadius, rotationSpeed = 0, rotationPeriod = 0, orbit, material }: PlanetOption) {
		super({ name, equatorialRadius, rotationSpeed, rotationPeriod, orbit, material });
	}
}
