import { MeshBasicMaterial, PointLight } from 'three';
import { Planetoid } from './planetoid';

export interface StarOption {
	name: string;
	equatorialRadius: number;
}

export class Star extends Planetoid {
	private pointLight: PointLight;

	constructor({ name, equatorialRadius }: StarOption) {
		super({
			name,
			equatorialRadius,
			material: new MeshBasicMaterial({
				color: 0xffff00
			})
		});
		this.pointLight = new PointLight(0xffffff, 1);
		this.add(this.pointLight);
	}
}
