import { MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, PointLight } from 'three';
import { Planetoid } from './planetoid';

export interface StarOption {
	name: string;
	equatorialRadius: number;
	material?: MeshStandardMaterial | MeshPhongMaterial | MeshBasicMaterial;
}

export class Star extends Planetoid {
	private pointLight: PointLight;

	constructor({ name, equatorialRadius, material = new MeshBasicMaterial({ color: 0xffff00 }) }: StarOption) {
		super({ name, equatorialRadius, material });
		this.pointLight = new PointLight(0xffffff, 1);
		this.add(this.pointLight);
	}
}
