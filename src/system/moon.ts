import { MeshPhongMaterial, MeshStandardMaterial } from 'three';
import { OrbitOption, Planetoid } from './planetoid';

export interface MoonOption {
	name: string;
	equatorialRadius: number;
	rotationSpeed: number;
	orbit: OrbitOption;
	material: MeshStandardMaterial | MeshPhongMaterial;
}

export class Moon extends Planetoid {
	constructor({ name, equatorialRadius, rotationSpeed = 0, orbit, material }: MoonOption) {
		super({ name, equatorialRadius, rotationSpeed, orbit, material });
	}
}
