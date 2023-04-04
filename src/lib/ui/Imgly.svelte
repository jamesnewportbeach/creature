<script>
	import CreativeEditorSDK from '@cesdk/cesdk-js';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import debounce from 'lodash/debounce';

	const dispatch = createEventDispatcher();

	let container, editorInstance, engine;

	export let config = {};

	const updateConfig = (c) => {
			if (editorInstance) editorInstance.dispose();
			if (container && config) {
				CreativeEditorSDK.init(container, c).then((instance) => {
					engine = instance.engine;
				});
			}
		},
		getBlockProperties = (block) => {
			const b = engine.block;
			const o = {
				blendMode: b.getBlendMode(block),
				blur: b.getBlur(block),
				opacity: b.getOpacity(block),
				rotation: b.getRotation(block),

				h: b.getHeight(block),
				hMode: b.getHeightMode(block),
				w: b.getWidth(block),
				wMode: b.getWidthMode(block),

				x: b.getPositionX(block),
				xMode: b.getPositionXMode(block),
				y: b.getPositionY(block),
				yMode: b.getPositionYMode(block)
			};
			console.log(o);
			return o;
		},
		setBlockProperties = (block) => {
			const b = engine.block;
			//b.setWidth(block, 0.4);
			//b.setHeight(block, 0.2);
		};

	let star, page;

	const resize = debounce((e) => {
			// updateConfig(config);
		}, 500),
		handleChange = (e) => {
			// getBlockProperties(star);

			editorInstance
				.save()
				.then((sceneAsString) => {
					if (sceneAsString) {
						console.log('SAVING SCENE...');
						let decodedString = atob(sceneAsString);
						var substring = decodedString.slice(3);
						let d = JSON.parse(substring);
						dispatch('change', d);
					}
				})
				.catch((error) => {
					console.error('Save failed', error);
				});
		};

	$: configChange = updateConfig(config);

	onMount(async () => {
		const { el, children, class: _, config, ...props } = $$props;
		CreativeEditorSDK.init(container, config).then(async (instance) => {
			editorInstance = instance;
			engine = editorInstance.engine;
			const editor = engine.editor;

			/*
			const scene = engine.scene.create();

			page = engine.block.create('page');
			setBlockProperties(page);

			engine.block.appendChild(scene, page);

			star = engine.block.create('shapes/star');
			engine.block.appendChild(page, star);
*/

			editor.onStateChanged(() => {
				console.log('STOPPED EDITING');
				handleChange();
			});

			engine.event.subscribe([], (events) => {
				//console.log('EDITING IN PROGRESS...');
				handleChange();
				//events.forEach((event) => {
				//if (engine.block.isValid(event.block)) {
				//console.log('Event:', event.type, event.block);
				//console.log('Block type:', engine.block.getType(event.block));
				//console.log(getBlockProperties(event.block));
				//}
				//});
			});
		});
	});

	onDestroy(() => {
		if (editorInstance) editorInstance.dispose();
	});
</script>

<svelte:window on:resize={resize} />

<div class="h-full w-full" bind:this={container} />
