import {
	Math,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	Object3D,
	SphereGeometry
} from 'three';

export interface OrbitOption {
	pivot: Object3D;
	semimajorAxis: number;
	orbitalSpeed: number;
	orbitalInclination: number;
}

export interface PlanetoidOption {
	name: string;
	equatorialRadius: number;
	rotationSpeed?: number;
	orbit?: OrbitOption;
	material?: MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial;
	mesh?: Mesh;
}

export class Planetoid extends Object3D {
	private equatorialRadius: number;

	private rotationSpeed: number;
	private orbitalPivot?: Object3D;
	private orbit?: OrbitOption;

	private geometry: SphereGeometry;
	private material: MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial;
	private mesh: Mesh;

	constructor({ name, equatorialRadius, rotationSpeed = 0, orbit, material, mesh }: PlanetoidOption) {
		super();
		this.name = name;
		this.equatorialRadius = equatorialRadius;
		this.rotationSpeed = rotationSpeed;
		this.orbit = orbit;

		if (this.orbit) {
			this.orbitalPivot = new Object3D();
			this.orbitalPivot.add(this);
			this.orbit.pivot.add(this.orbitalPivot);
			this.position.z = this.orbit.semimajorAxis;
			this.orbitalPivot.rotateX(Math.degToRad(this.orbit.orbitalInclination));
		}

		if (mesh === undefined) {
			this.geometry = new SphereGeometry(this.equatorialRadius, 32, 32);
			this.material = material || new MeshBasicMaterial({ color: 0xfffff00 });
			this.mesh = new Mesh(this.geometry, this.material);
		} else {
			this.mesh = mesh;
			if (material) {
				this.material = material;
				this.mesh.material = this.material;
			}
		}

		this.add(this.mesh);
	}

	public update(delta: number): void {
		if (this.orbit !== undefined && this.orbitalPivot !== undefined) {
			this.orbitalPivot.rotation.y += this.orbit.orbitalSpeed * delta;
		}
		this.mesh.rotation.y += this.rotationSpeed * delta;
	}
}
