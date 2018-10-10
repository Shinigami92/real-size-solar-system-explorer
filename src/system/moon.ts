import { Mesh, MeshPhongMaterial, MeshStandardMaterial } from 'three';
import { OrbitOption, Planetoid } from './planetoid';

export interface MoonOption {
	name: string;
	equatorialRadius: number;
	rotationSpeed: number;
	rotationPeriod?: number;
	orbit: OrbitOption;
	material?: MeshStandardMaterial | MeshPhongMaterial;
	mesh?: Mesh;
}

export class Moon extends Planetoid {
	constructor({ name, equatorialRadius, rotationSpeed = 0, rotationPeriod = 0, orbit, material, mesh }: MoonOption) {
		super({ name, equatorialRadius, rotationSpeed, rotationPeriod, orbit, material, mesh });
	}
}
