<script>
	import { onMount } from 'svelte';
	import { Image, createIconMaterial, iconMappings, uuidv4 } from './utils';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/app-store';
	import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
	import * as THREE from 'three';
	import SnakeImage from './assets/spiny_bush_viper.jpg';
	import FontJSON from './assets/Roboto-msdf.json';
	import FontImage from './assets/Roboto-msdf.png';

	export let currentPage;

	let Graph, container, ForceGraph3D, SpriteText, SVGLoader, BufferGeometryUtils, ThreeMeshUI;

	$: outerHeight = 0;
	$: outerWidth = 0;

	let selectedNodes = new Set();

	function bodyClick(event) {
		console.log(event);
		//m.x = event.clientX;
		//m.y = event.clientY;
	}

	const openBubble = (n) => {
		console.log(n);
	};

	onMount(async () => {
		const threeMeshUIModule = await import('three-mesh-ui/src/three-mesh-ui');
		ThreeMeshUI = threeMeshUIModule.default;

		const SVGLoaderModule = await import('three/examples/jsm/loaders/SVGLoader');
		SVGLoader = SVGLoaderModule.SVGLoader;

		const BufferGeometryUtilsModule = await import('three/examples/jsm/utils/BufferGeometryUtils');
		BufferGeometryUtils = BufferGeometryUtilsModule.BufferGeometryUtils;

		const spriteTextModule = await import('three-spritetext');
		SpriteText = spriteTextModule.default;

		const forceGraphModule = await import('3d-force-graph');
		ForceGraph3D = forceGraphModule.default;

		Graph = ForceGraph3D()(container)
			.linkDirectionalParticles(-1)
			.linkDirectionalParticleColor(() => 'lime')
			.linkDirectionalParticleWidth(1)
			.linkDirectionalArrowLength(2)
			.linkDirectionalArrowRelPos(1)
			.linkCurvature(0.02)
			.linkColor((node) => {
				return node.selected ? 'lime' : 'white';
			})
			.nodeColor((node) => (selectedNodes.has(node) ? 'lime' : 'blue'))
			.linkOpacity(0.5)
			/*
			.onNodeDragEnd((node) => {
				node.fx = node.x;
				node.fy = node.y;
				node.fz = node.z;
			})
			*/
			.onNodeHover((node) => (container.style.cursor = true))
			.onNodeClick((node) => {
				// Aim at node from outside it
				const distance = 80;
				const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

				openBubble(node);

				Graph.cameraPosition(
					{
						x: node.x * distRatio,
						y: node.y * distRatio,
						z: node.z * distRatio
					}, // new position
					node, // lookAt ({ x, y, z })
					1500 // ms transition duration
				);

				activeNodeStore.set(node.id);
				Graph.nodeThreeObject(Graph.nodeThreeObject());
			})
			.nodeThreeObject((node) => {
				const sprite = new SpriteText(node.label);
				sprite.material.depthWrite = false; // make sprite background transparent
				sprite.color = '#ffffff';
				sprite.textHeight = 1;
				sprite.backgroundColor = $activeNodeStore === node.id ? 'blue' : 'red';
				sprite.borderRadius = 3;
				sprite.padding = 8;
				sprite.borderColor = 'green';
				return sprite;

				/*
				new THREE.TextureLoader().load(SnakeImage, (texture) => {
					leftSubBlock.set({
						backgroundTexture: texture
					});
				});
				*/

				const testPanel = new ThreeMeshUI.Block({
					width: 1.2,
					height: 0.7,
					padding: 0.2,
					fontFamily: FontJSON,
					fontTexture: FontImage,
					fontColor: new THREE.Color(0xffffff),
					backgroundOpacity: 0
				});

				const text = new ThreeMeshUI.Text({
					content:
						'Some text to be displayed s udsdufiauhsdiu fiausdhf iuasdhif uaisdufhai sudhf iauh'
				});

				testPanel.add(text);
				//Graph.scene().add(testPanel);
				//return testPanel;

				//const sprite = Image(SnakeImage);
				//return sprite;

				// return makeTextPanel();

				/* new THREE.Mesh(
                            new THREE.TorusKnotGeometry(
                                Math.random() * 10,
                                Math.random() * 2
                            ),
                            new THREE.MeshLambertMaterial({
                                color: Math.round(
                                    Math.random() * Math.pow(2, 24)
                                ),
                                transparent: true,
                                opacity: 0.75,
                            }));*/

				/*

                        return new THREE.Mesh(
                                new THREE.CylinderGeometry(5, 5, 20),
                                //new THREE.DodecahedronGeometry(5),
                                new THREE.MeshLambertMaterial({
                                    color: Math.round(
                                        Math.random() * Math.pow(2, 24)
                                    ),
                                    transparent: true,
                                    opacity: 0.75,
                                })
                            );

                    new THREE.BoxGeometry(Math.random() * 20, Math.random() * 20, Math.random() * 20),
                    new THREE.ConeGeometry(Math.random() * 10, Math.random() * 20),
                    new THREE.CylinderGeometry(Math.random() * 10, Math.random() * 10, Math.random() * 20),
                    new THREE.DodecahedronGeometry(Math.random() * 10),
                    new THREE.SphereGeometry(Math.random() * 10),
                    new THREE.TorusGeometry(Math.random() * 10, Math.random() * 2),
                    new THREE.TorusKnotGeometry(Math.random() * 10, Math.random() * 2)
                    
                    const sprite = Image("/static/mogwai.jpg");
                    return sprite;
                    */
			});

		Graph.d3Force('charge').strength(-200);

		const testMesh = new THREE.Mesh(
			//new THREE.CylinderGeometry(5, 5, 20),
			new THREE.DodecahedronGeometry(10),
			new THREE.MeshLambertMaterial({
				color: Math.round(Math.random() * Math.pow(2, 24)),
				transparent: true,
				opacity: 0.75
			})
		);

		const room = new THREE.LineSegments(
			new BoxLineGeometry(200, 200, 200, 10, 10, 10).translate(0, 3, 0),
			new THREE.LineBasicMaterial({ color: 0x808080 })
		);
		// Graph.scene().add(room);

		// Graph.scene().add(testMesh);

		Graph.scene().background = new THREE.Color(0x000033);

		//ThreeMeshUI.update();

		const testPanel = new ThreeMeshUI.Block({
			ref: 'testPanel',
			width: 1.2,
			height: 0.7,
			padding: 0.2,
			fontFamily: FontJSON,
			fontTexture: FontImage,
			fontColor: new THREE.Color(0xffffff),
			backgroundOpacity: 0
		}).add(
			new ThreeMeshUI.Text({
				content:
					'Some text to be displayed s udsdufiauhsdiu fiausdhf iuasdhif uaisdufhai sudhf iauh'
			})
		);

		testPanel.position.set(0, 0, 0);
		testPanel.rotation.x = 0;

		console.log(room);
		console.log(testPanel);

		Graph.scene().add(testPanel);
		ThreeMeshUI.update();

		nodesStore.subscribe((nodes) => {
			Graph.graphData({ nodes, links: $edgesStore });
			console.log({ nodes: $nodesStore, links: $edgesStore });
		});

		edgesStore.subscribe((links) => {
			Graph.graphData({ nodes: $nodesStore, links });
			console.log({ nodes: $nodesStore, links: $edgesStore });
		});
	});

	const resize = () => {};
</script>

<svelte:window on:resize={resize} bind:outerHeight bind:outerWidth on:click={bodyClick} />

<div bind:this={container} class="absolute z-0" />
