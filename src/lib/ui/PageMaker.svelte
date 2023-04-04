<script lang="ts">
	import Moveable from 'svelte-moveable';
	import { LoremIpsum } from 'lorem-ipsum';
	import InfiniteViewer from '$lib/common/InfiniteViewer.svelte';
	import Guides from '$lib/common/Guides.svelte';
	import { onMount } from 'svelte';
	import { Frame } from 'scenejs';
	import type VanillaGuides from '@scena/guides';
	import debounce from 'lodash/debounce';

	import { selectedPageObjects } from '$lib/stores/ui-store';

	// import MoveableHelper from '$lib/ui/MoveableHelper';
	// const helper = new MoveableHelper();

	const lorem = new LoremIpsum({
		sentencesPerParagraph: {
			max: 8,
			min: 4
		},
		wordsPerSentence: {
			max: 16,
			min: 4
		}
	});

	const options = {
			useBeforeRender: false,
			useRender: false,
			createAuto: true
		},
		frameMap = new Map();

	let masterZoom = 0.5,
		pixelsToInchRatio = 96,
		scrollerRef: InfiniteViewer,
		pageBorder: HTMLElement,
		isPinchStart: boolean = false,
		isShiftKeyDown: boolean = false,
		items: [],
		innerHeight: number = 0,
		innerWidth: number = 0,
		targets: [],
		moveable: Moveable,
		scroller: HTMLElement,
		guides1: VanillaGuides,
		guides2: VanillaGuides,
		horizontalGuidelines: Guides,
		verticalGuidelines: Guides,
		throttleRotate: number = 0,
		mainScrollLeft: number = 0,
		mainScrollTop: number = 0;

	$: mainScrollLeft;
	$: mainScrollTop;
	$: items = [];

	const resetPositions = () => {
			console.log('resetting...');
			guides1.setState({
				zoom: masterZoom * pixelsToInchRatio
			});
			guides2.setState({
				zoom: masterZoom * pixelsToInchRatio
			});
			//refreshGuidelines();
			// moveable.updateRect();
			//guides1.resize();
			//guides2.resize();
		},
		handleRefresh = debounce((e) => {
			resetPositions();
		}, 300),
		onScroll = (e) => {
			//mainScrollTop = e.detail.scrollTop;
			//mainScrollLeft = e.detail.scrollLeft;
			guides1.setState({
				scrollPos: e.detail.scrollLeft
			});
			guides2.setState({
				scrollPos: e.detail.scrollTop
			});

			moveable.updateRect();
			// handleRefresh();
		},
		onPinch = (e) => {
			masterZoom = e.detail.zoom;

			guides1.setState({
				zoom: masterZoom * pixelsToInchRatio
			});
			guides2.setState({
				zoom: masterZoom * pixelsToInchRatio
			});

			//handleRefresh();
		},
		onResizeWindow = () => {
			//handleRefresh();
		},
		styleString = (style) => {
			return Object.entries(style)
				.map(([k, v]) => `${k}:${v}`)
				.join(';');
		},
		newFrame = (el) => {
			const frame = new Frame({
				transform: {
					translateX: '0px',
					translateY: '0px',
					rotate: '0deg',
					scaleX: 1,
					scaleY: 1
				}
			});
			frameMap.set(el, frame);
			return frame;
		},
		getFrame = (target) => {
			return frameMap.get(target) || newFrame(target);
		},
		onRender = ({ target }) => {
			console.log(target);
			target.style.cssText += getFrame(target).toCSS();
		},
		onDragStart = ({ target, set }) => {
			const frame = getFrame(target);
			set([
				parseFloat(frame.get('transform', 'translateX')),
				parseFloat(frame.get('transform', 'translateY'))
			]);
		},
		onDrag = ({ target, beforeTranslate }) => {
			const frame = getFrame(target);
			frame.set('transform', 'translateX', `${beforeTranslate[0]}px`);
			frame.set('transform', 'translateY', `${beforeTranslate[1]}px`);
		},
		onScaleStart = ({ target, dragStart, set }) => {
			const frame = getFrame(target);
			set([frame.get('transform', 'scaleX'), frame.get('transform', 'scaleY')]);
			dragStart && onDragStart(dragStart);
		},
		onScale = ({ target, scale, drag }) => {
			const frame = getFrame(target);
			console.log(frame);
			frame.set('transform', 'scaleX', scale[0]);
			frame.set('transform', 'scaleY', scale[1]);
			onDrag(drag);
		},
		onResizeStart = (e) => {
			e.dragStart && onDragStart(e.dragStart);
			e.setOrigin(['%', '%']);
		},
		onResize = (e) => {
			testResize(e);
			testRender(e.target);
		},
		onRotateStart = ({ target, set, dragStart }) => {
			const frame = getFrame(target);
			set(parseFloat(frame.get('transform', 'rotate')));

			dragStart && onDragStart(dragStart);
		},
		onRotate = ({ target, beforeRotate, drag }) => {
			const frame = getFrame(target);
			frame.set('transform', 'rotate', `${beforeRotate}deg`);
			drag && onDrag(drag);
		},
		onMouseDown = (e) => {
			const target = e.target;
			if (scroller === target) {
				targets = [];
				return;
			}

			console.log(moveable.isMoveableElement(target));

			if (moveable.isMoveableElement(target) || targets.indexOf(target) > -1) {
				return;
			}
			if (isShiftKeyDown) {
				targets = [...targets, target];
			} else {
				targets = [target];
			}

			setTimeout(() => {
				moveable.dragStart(e);
			});
		},
		onClickGroup = (e) => {
			const target = e.inputTarget;

			if (!target.classList.contains('target')) {
				return;
			}
			const index = targets.indexOf(target);
			if (isShiftKeyDown) {
				if (index === -1) {
					targets = [...targets, target];
				} else {
					targets.splice(index, 1);
					targets = [...targets];
				}
			} else {
				targets = [target];
			}
		},
		setGuides = () => {
			horizontalGuidelines = [...guides1.getGuides(), (innerHeight - 30) / 2];
			verticalGuidelines = [...guides2.getGuides(), (innerWidth - 30) / 2];
		},
		onKeyDown = (e) => {
			isShiftKeyDown = e.key === 'Shift';
			throttleRotate = isShiftKeyDown ? 30 : 0;
		},
		onKeyUp = (e) => {
			isShiftKeyDown = false;
			throttleRotate = isShiftKeyDown ? 30 : 0;
		},
		render = (target: HTMLElement | SVGElement, frame: Frame = getFrame(target)) => {
			target.style.cssText += frame.toCSS();
		},
		createFrame = (el: HTMLElement | SVGElement, properites = {}) => {
			const frame = new Frame({
				transform: {
					translate: '0px, 0px',
					rotate: '0deg',
					scale: '1, 1'
				}
			});

			frame.set(properites);
			frameMap.set(el, frame);
			return frame;
		},
		testFrame = (e: any) => {
			const target = e.target;
			const frame = getFrame(target);

			if (frame) {
				return frame;
			}
			if (!options?.createAuto) {
				if (e.stop) {
					e.stop();
					return;
				}
			}
			return createFrame(target);
		},
		testDrag = (e) => {
			const target = e.target;
			const translate = e.translate;
			const frame = getFrame(target);
			const tx = `${translate[0]}px`;
			const ty = `${translate[1]}px`;

			if (frame.has('transform', 'translate')) {
				frame.set('transform', 'translate', `${tx},${ty}`);
			} else {
				frame.set('transform', 'translateX', tx);
				frame.set('transform', 'translateY', ty);
			}
		},
		testResize = (e) => {
			const target = e.target;
			const frame = getFrame(target);
			frame.set('width', `${e.width}px`);
			frame.set('height', `${e.height}px`);
			console.log(e);
			console.log(e.target.id);
			testDrag(e.drag);
		},
		testScale = (e) => {
			const frame = testFrame(e);
			const scale = e.scale;
			testDrag(e.drag);
			frame.set('transform', 'scale', `${scale[0]},${scale[1]}`);
		},
		testRotate = (e) => {
			const frame = testFrame(e);
			const rotate = e.rotate;
			testDrag(e.drag);
			frame.set('transform', 'rotate', `${rotate}deg`);
		},
		testRender = (target, frame = getFrame(target)) => {
			if (!options?.useRender) {
				render(target, frame);
			}
		},
		getOrderIndex = (frame: Frame, functionName: string) => {
			const orders = frame.getOrders(['transform']) || [];
			return orders.indexOf(functionName);
		},
		setTranasform = (e: OnTransformStartEvent, frame: Frame, functionName: string) => {
			const orderIndex = getOrderIndex(frame, functionName);
			if (options?.useBeforeRender) {
				e.setTransformIndex(orderIndex);
			} else {
				e.setTransform(frame.toCSSObject().transform || [], orderIndex);
			}
		},
		refreshGuidelines = () => {
			const centerX = innerWidth / 2 + 15;
			const centerY = innerHeight / 2;

			moveable.verticalGuidelines = [...guides2.getGuides(), centerX];
			moveable.horizontalGuidelines = [...guides1.getGuides(), centerY];
		};

	onMount(() => {
		setGuides();
		refreshGuidelines();

		items = [
			{
				id: 'pageRightBorder',
				tagName: 'div',
				className: 'target absolute border-dashed border-2 border-black/50',
				clickable: false,
				style: {
					top: '0px',
					left: '499px',
					width: '500px',
					height: '800px'
				}
			},
			{
				id: 'pageRightBorderInner',
				tagName: 'div',
				className: 'target absolute border-dotted border-2 border-black/25',
				clickable: false,
				style: {
					top: '20px',
					left: '519px',
					width: '460px',
					height: '760px'
				}
			},
			{
				id: 'pageLeftBorder',
				tagName: 'div',
				className: 'target absolute border-dashed border-2 border-black/50',
				clickable: false,
				style: {
					top: '0px',
					left: '0px',
					width: '500px',
					height: '800px'
				}
			},
			{
				id: 'pageLeftBorderInner',
				tagName: 'div',
				className: 'target absolute border-dotted border-2 border-black/25',
				clickable: false,
				style: {
					top: '20px',
					left: '20px',
					width: '460px',
					height: '760px'
				}
			},
			{
				id: 'smapleTextBox',
				tagName: 'div',
				text: lorem.generateSentences(5),
				className:
					'target absolute text-ellipsis overflow-hidden text-justify dark:text-white rounded bg-slate-300 dark:bg-slate-900 shadow-lg',
				style: {
					top: '100px',
					left: '200px',
					width: '200px',
					height: '100px',
					padding: '20px',
					'line-height': 1.5
				}
			}
		];

		document.querySelectorAll('.target').forEach((el) => {
			const targetObj = items.find((d) => d.id === el.id);
			createFrame(el, { clickable: targetObj.clickable });
		});

		targets = [].slice.call(document.querySelectorAll('.target'));
	});
</script>

<svelte:window
	on:resize={onResizeWindow}
	on:keydown={onKeyDown}
	on:keyup={onKeyUp}
	bind:innerWidth
	bind:innerHeight
/>

<!-- svelte:body style="overscroll-behavior: none" / -->

<div class="relative h-full w-full">
	<div class="absolute bg-black top-0 left-0 z-30" style="width: 30px; height: 30px;" />

	<div class="absolute w-full top-0 left-0 z-20 h-12">
		<Guides
			bind:guides={guides1}
			scrollPos={mainScrollLeft}
			type="horizontal"
			backgroundColor="#000"
			displayDragPos={true}
			zoom={pixelsToInchRatio * masterZoom}
			range={[-10000, 10000]}
			unit={1}
			rulerStyle={{ left: '30px', width: 'calc(100% - 30px)', height: '30px' }}
		/>
	</div>
	<div class="absolute h-full top-0 left-0 z-20 w-12">
		<Guides
			bind:guides={guides2}
			scrollPos={mainScrollTop}
			type="vertical"
			backgroundColor="#444"
			displayDragPos={true}
			zoom={pixelsToInchRatio * masterZoom}
			range={[-10000, 10000]}
			unit={1}
			rulerStyle={{ top: '30px', height: 'calc(100% - 30px)', width: '30px' }}
		/>
	</div>
	<!-- 		pinchThreshold={1}
-->
	<InfiniteViewer
		bind:this={scrollerRef}
		zoom={masterZoom}
		className="relative"
		style="top: 30px; left: 30px; width: calc(100% - 30px); height: calc(100% - 30px)"
		on:scroll={onScroll}
		on:pinch={onPinch}
	>
		<div
			style="width: 10000px; height: 10000px;"
			class="left-0 top-0 z-1 relative"
			bind:this={scroller}
			on:mousedown={onMouseDown}
		>
			<Moveable
				bind:this={moveable}
				className="moveable"
				zoom={masterZoom}
				target={targets}
				origin={true}
				pinchable={true}
				snappable={true}
				snapGridWidth={20}
				snapGridHeight={20}
				snapCenter={true}
				draggable={true}
				resizable={true}
				rotatable={true}
				{throttleRotate}
				{horizontalGuidelines}
				{verticalGuidelines}
				on:scroll={({ direction }) => {
					//console.log('scrolling....');
					//scrollerRef.scrollBy(direction[0], direction[1]);
				}}
				on:dragStart={({ detail }) => {
					onDragStart(detail);
				}}
				on:drag={({ detail }) => {
					onDrag(detail);
				}}
				on:dragGroupStart={({ detail }) => {
					detail.events.forEach(onDragStart);
				}}
				on:dragGroup={({ detail }) => {
					detail.events.forEach(onDrag);
				}}
				on:scaleStart={({ detail }) => onScaleStart(detail)}
				on:scale={({ detail }) => onScale(detail)}
				on:scaleGroupStart={({ detail }) => {
					detail.events.forEach(onScaleStart);
				}}
				on:scaleGroup={({ detail }) => {
					detail.events.forEach(onScale);
				}}
				on:resizeStart={({ detail }) => onResizeStart(detail)}
				on:resize={({ detail }) => onResize(detail)}
				on:rotateStart={({ detail }) => onRotateStart(detail)}
				on:rotate={({ detail }) => onRotate(detail)}
				on:rotateGroupStart={({ detail }) => {
					detail.events.forEach(onRotateStart);
				}}
				on:rotateGroup={({ detail }) => {
					detail.events.forEach(onRotate);
				}}
				on:pinchStart={() => {
					isPinchStart = true;
				}}
				on:pinch={({ clientX, clientY }) => {
					console.log(clientX + ' ' + clientY);
				}}
				on:render={({ detail }) => {
					console.log(detail);
					onRender(detail);
				}}
				on:renderEnd={({ detail }) => {
					isPinchStart = false;
				}}
				on:renderGroup={({ detail }) => {
					detail.targets.forEach((target) => onRender({ target }));
				}}
				on:clickGroup={(e) => {
					onClickGroup(e.detail);
				}}
				on:click={(e) => {
					if (isShiftKeyDown) {
						selectedPageObjects.update((n) => n.splice(n.length, 0, e.detail.target.id));
					} else {
						selectedPageObjects.set([e.detail.target.id]);
					}
				}}
			/>
			{#each items as item}
				<svelte:element
					this={item.tagName}
					id={item.id}
					class={item.className}
					style={styleString(item.style)}
					>{#if item.text}{item.text}{/if}</svelte:element
				>
			{/each}
		</div>
	</InfiniteViewer>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600&display=swap');
	@import url('https://fonts.googleapis.com/css?family=Roboto:100&display=swap');

	:global(.scena-guide) {
		background: blue !important;
	}

	:global(html, body) {
		touch-action: none;
	}

	:global(.moveable) {
		z-index: 10;
	}
</style>
