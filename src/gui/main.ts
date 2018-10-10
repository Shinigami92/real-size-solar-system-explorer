import { GUI } from 'dat.gui';
import { PerspectiveCamera } from 'three';

const mainGui: GUI = new GUI({ width: 300 });

export function initMainGui(camera: PerspectiveCamera): void {
	const solFolder: GUI = mainGui.addFolder('Sol');
	solFolder.add(
		{
			'Travel 1'(): void {
				camera.position.set(1047299300, -446626200, 1372115600);
				camera.rotation.set(0.3, 0.58, 0.23, 'YZX');
			}
		},
		'Travel 1'
	);

	const planetFolder: GUI = mainGui.addFolder('Planets');

	const mercuryFolder: GUI = planetFolder.addFolder('Mercury');
	mercuryFolder.add(
		{
			'Travel 1'(): void {
				camera.position.set(14913000, -3413955500, 57812408500);
				camera.rotation.set(-0.01, 0.7, 0.04, 'YZX');
			}
		},
		'Travel 1'
	);

	const venusFolder: GUI = planetFolder.addFolder('Venus');
	venusFolder.add(
		{
			'Travel 1'(): void {
				camera.position.set(27149800, -7284690100, 107967306100);
				camera.rotation.set(-0.01, 0.78, 0.02, 'YZX');
			}
		},
		'Travel 1'
	);

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

	const marsFolder: GUI = planetFolder.addFolder('Mars');
	marsFolder.add(
		{
			'Travel 1'(): void {
				camera.position.set(12305100, -22441044600, 226839506300);
				camera.rotation.set(0.04, 0.49, 0.01, 'YZX');
			}
		},
		'Travel 1'
	);
	marsFolder.add(
		{
			'Phobos Travel 1'(): void {
				camera.position.set(92000, -22442076900, 226841131100);
				camera.rotation.set(0.51, 1.21, -0.21, 'YZX');
			}
		},
		'Phobos Travel 1'
	);
	marsFolder.add(
		{
			'Deimos Travel 1'(): void {
				camera.position.set(46600, -22443607300, 226855156200);
				camera.rotation.set(0.02, 0.7, 0.18, 'YZX');
			}
		},
		'Deimos Travel 1'
	);
}
