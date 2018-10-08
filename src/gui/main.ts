import { GUI } from 'dat.gui';
import { PerspectiveCamera } from 'three';

const mainGui: GUI = new GUI({ width: 300 });

export function initMainGui(camera: PerspectiveCamera): void {
	const planetFolder: GUI = mainGui.addFolder('Planets');
	const earthFolder: GUI = planetFolder.addFolder('Earth');
	earthFolder.add(
		{
			'Travel 1'(): void {
				camera.position.set(-147531800, -18545116900, 148369874000);
				camera.rotation.set(-0.5, -2.37, 0.16, 'YZX');
			}
		},
		'Travel 1'
	);
	earthFolder.add(
		{
			'Travel 2'(): void {
				camera.position.set(-73967500, -18628315600, 148980385000);
				camera.rotation.set(-0.13, -0.28, -0.68, 'YZX');
			}
		},
		'Travel 2'
	);
}
