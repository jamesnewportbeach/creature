<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import Icon from "$lib/Icon/Icon.svelte";

    const dispatch = createEventDispatcher();

    export let settingsStore;
    export let db;
    export let sensor;
    export let width;
    export let height;
    export let left;
    export let top;
    export let resizable = true;
    export let draggable = true;
    export let removable = true;
    export let id;
    export let container;
    export let xPerPx;
    export let yPerPx;
    export let gapX = 0;
    export let gapY = 0;
    export let item = [];
    export let max;
    export let min;
    export let cols;
    export let nativeContainer;

    const handleMouseOver = (e) => {
        hovered = true;
        dispatch("nodeMouseOver", e);
    };

    const handleMouseOut = (e) => {
        hovered = false;
        dispatch("handleMouseOut", e);
    };

    const handleRightClick = (e) => {
        dispatch("nodeRightClick", e);
    };

    const handleRemove = () => {
        dispatch("remove", { id: id });
    };

    let hovered,
        shadowElement,
        shadow = {},
        active = false,
        initX,
        initY,
        capturePos = {
            x: 0,
            y: 0,
        },
        cordDiff = { x: 0, y: 0 },
        newSize = { width, height },
        trans = false,
        anima;

    const inActivate = () => {
        const shadowBound = shadowElement.getBoundingClientRect();
        const xdragBound = rect.left + cordDiff.x;
        const ydragBound = rect.top + cordDiff.y;
        cordDiff.x = shadow.x * xPerPx + gapX - (shadowBound.x - xdragBound);
        cordDiff.y = shadow.y * yPerPx + gapY - (shadowBound.y - ydragBound);
        active = false;
        trans = true;
        clearTimeout(anima);
        anima = setTimeout(() => {
            trans = false;
        }, 100);
        dispatch("pointerup", {
            id,
        });
    };

    let repaint = (cb) => {
        dispatch("repaint", {
            id,
            shadow,
            onUpdate: cb,
        });
    };

    // Autoscroll
    let _scrollTop = 0,
        containerFrame,
        rect,
        scrollElement,
        movableContainer;

    const getContainerFrame = (element) => {
        if (element === document.documentElement || !element) {
            const { height, top, right, bottom, left } =
                nativeContainer.getBoundingClientRect();
            return {
                top: Math.max(0, top),
                bottom: Math.min(window.innerHeight, bottom),
            };
        }
        return element.getBoundingClientRect();
    };

    const getScroller = (element) =>
        !element ? document.documentElement : element;

    const touchstart = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.targetTouches[0].pageX - rect.left;
        const y = e.targetTouches[0].pageY - rect.top;
        initX = x;
        initY = y;

        const msg = `touch: ${x} ${y}`;
        console.log(msg);
    };

    const pointerdown = ({ clientX, clientY, target }) => {
        initX = clientX;
        initY = clientY;
        capturePos = { x: left, y: top };
        shadow = { x: item.x, y: item.y, w: item.w, h: item.h };
        newSize = { width, height };
        containerFrame = getContainerFrame(container);
        scrollElement = getScroller(container);
        cordDiff = { x: 0, y: 0 };

        rect = movableContainer.getBoundingClientRect();
        active = true;
        trans = false;
        _scrollTop = scrollElement.scrollTop;
        window.addEventListener("pointermove", pointermove);
        window.addEventListener("pointerup", pointerup);
    };

    let sign = { x: 0, y: 0 },
        vel = { x: 0, y: 0 },
        intervalId = 0;

    const stopAutoscroll = () => {
        clearInterval(intervalId);
        intervalId = false;
        sign = { x: 0, y: 0 };
        vel = { x: 0, y: 0 };
    };

    const update = () => {
        const _newScrollTop = scrollElement.scrollTop - _scrollTop;
        const boundX = capturePos.x + cordDiff.x;
        const boundY = capturePos.y + (cordDiff.y + _newScrollTop);
        let gridX = Math.round(boundX / xPerPx);
        let gridY = Math.round(boundY / yPerPx);
        shadow.x = Math.max(Math.min(gridX, cols - shadow.w), 0);
        shadow.y = Math.max(gridY, 0);
        if (max.y) {
            shadow.y = Math.min(shadow.y, max.y);
        }
        repaint();
    };

    const pointermove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const { clientX, clientY } = event;
        cordDiff = { x: clientX - initX, y: clientY - initY };
        const Y_SENSOR = sensor;
        let velocityTop = Math.max(
            0,
            (containerFrame.top + Y_SENSOR - clientY) / Y_SENSOR
        );
        let velocityBottom = Math.max(
            0,
            (clientY - (containerFrame.bottom - Y_SENSOR)) / Y_SENSOR
        );
        const topSensor = velocityTop > 0 && velocityBottom === 0;
        const bottomSensor = velocityBottom > 0 && velocityTop === 0;
        sign.y = topSensor ? -1 : bottomSensor ? 1 : 0;
        vel.y = sign.y === -1 ? velocityTop : velocityBottom;
        if (vel.y > 0) {
            if (!intervalId) {
                // Start scrolling
                // TODO Use requestAnimationFrame
                intervalId = setInterval(() => {
                    scrollElement.scrollTop +=
                        2 * (vel.y + Math.sign(vel.y)) * sign.y;
                    update();
                }, 10);
            }
        } else if (intervalId) {
            stopAutoscroll();
        } else {
            update();
        }
    };

    const pointerup = (e) => {
        stopAutoscroll();
        window.removeEventListener("pointerdown", pointerdown);
        window.removeEventListener("pointermove", pointermove);
        window.removeEventListener("pointerup", pointerup);
        repaint(inActivate);
    };

    // Resize
    let resizeInitPos = { x: 0, y: 0 },
        initSize = { width: 0, height: 0 };

    const resizePointerDown = (e) => {
        e.stopPropagation();
        const { pageX, pageY } = e;
        resizeInitPos = { x: pageX, y: pageY };
        initSize = { width, height };
        cordDiff = { x: 0, y: 0 };
        rect = movableContainer.getBoundingClientRect();
        newSize = { width, height };
        active = true;
        trans = false;
        shadow = { x: item.x, y: item.y, w: item.w, h: item.h };
        containerFrame = getContainerFrame(container);
        scrollElement = getScroller(container);
        window.addEventListener("pointermove", resizePointerMove);
        window.addEventListener("pointerup", resizePointerUp);
    };

    const resizePointerMove = ({ pageX, pageY }) => {
        newSize.width = initSize.width + pageX - resizeInitPos.x;
        newSize.height = initSize.height + pageY - resizeInitPos.y;
        // Get max col number
        let maxWidth = cols - shadow.x;
        maxWidth = Math.min(max.w, maxWidth) || maxWidth;
        // Limit bound
        newSize.width = Math.max(
            Math.min(newSize.width, maxWidth * xPerPx - gapX * 2),
            min.w * xPerPx - gapX * 2
        );
        newSize.height = Math.max(newSize.height, min.h * yPerPx - gapY * 2);
        if (max.h) {
            newSize.height = Math.min(
                newSize.height,
                max.h * yPerPx - gapY * 2
            );
        }
        // Limit col & row
        shadow.w = Math.round((newSize.width + gapX * 2) / xPerPx);
        shadow.h = Math.round((newSize.height + gapY * 2) / yPerPx);
        repaint();
    };

    const resizePointerUp = (e) => {
        e.stopPropagation();
        repaint(inActivate);
        window.removeEventListener("pointermove", resizePointerMove);
        window.removeEventListener("pointerup", resizePointerUp);
    };

    const deleteIconSettings = { value: "Times" };
</script>

<!--     on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}

-->
<div
    bind:this={movableContainer}
    on:pointerdown={null}
    on:contextmenu|preventDefault|stopPropagation={handleRightClick}
    draggable={false}
    class="absolute"
    style="{active || (trans && rect)
        ? 'z-index: 3; cursor: grabbing; position: fixed; opacity: 0.8;'
        : ''}touch-action: none; will-change: auto; backface-visibility: hidden; -webkit-backface-visibility: hidden; width: {active
        ? Math.round(newSize.width)
        : Math.round(width)}px; height: {active
        ? Math.round(newSize.height)
        : Math.round(height)}px; 
    {active
        ? `transform: translate(${cordDiff.x}px, ${cordDiff.y}px); top: ${rect.top}px; left: ${rect.left}px;`
        : trans
        ? `transform: translate(${cordDiff.x}px, ${cordDiff.y}px); transition: width 0.2s, height 0.2s;`
        : `transition: transform 0.2s, opacity 0.2s; transform: translate(${left}px, ${top}px);`} "
>
    <slot /><!-- movePointerDown={pointerdown} {resizePointerDown}  -->

    {#if removable}
        <div
            style="left: 5px; top: 5px;"
            class="absolute w-4 h-4 z-10 select-none cursor-pointer opacity-50"
            class:visible={hovered}
            class:hidden={!hovered}
            on:pointerdown|stopPropagation
        >
            <Icon n={deleteIconSettings} {db} on:nodeClick={handleRemove} />
        </div>
    {/if}

    {#if draggable}
        <div
            style="cursor: grab; right: 5px; top: 5px;"
            class="absolute w-4 h-4 z-10 select-none opacity-50 focus:outline-none"
            class:visible={hovered}
            class:hidden={!hovered}
            on:touchstart={touchstart}
            on:pointerdown={pointerdown}
        >
            <svg viewBox="0 0 32 32">
                <rect height="4" width="4" y="4" x="0" />
                <rect height="4" width="4" y="12" x="0" />
                <rect height="4" width="4" y="20" x="0" />
                <rect height="4" width="4" y="28" x="0" />
                <rect height="4" width="4" y="4" x="8" />
                <rect height="4" width="4" y="12" x="8" />
                <rect height="4" width="4" y="20" x="8" />
                <rect height="4" width="4" y="28" x="8" />
                <rect height="4" width="4" y="4" x="16" />
                <rect height="4" width="4" y="12" x="16" />
                <rect height="4" width="4" y="20" x="16" />
                <rect height="4" width="4" y="28" x="16" />
                <rect height="4" width="4" y="4" x="24" />
                <rect height="4" width="4" y="12" x="24" />
                <rect height="4" width="4" y="20" x="24" />
                <rect height="4" width="4" y="28" x="24" />
            </svg>
        </div>
    {/if}

    {#if resizable}
        <div
            style="cursor: se-resize"
            class="absolute w-4 h-4 z-10 bottom-0 right-0 select-none opacity-50"
            class:visible={hovered}
            class:hidden={!hovered}
            on:pointerdown={resizePointerDown}
        />
    {/if}
</div>

{#if active || trans}
    <div
        bind:this={shadowElement}
        class="absolute"
        style="background-color: rgba(0,0,0, 0.07); will-change: transform; backface-visibility: hidden; -webkit-backface-visibility: hidden; width: {shadow.w *
            xPerPx -
            gapX * 2}px; height: {shadow.h * yPerPx -
            gapY * 2}px; transform: translate({shadow.x * xPerPx +
            gapX}px, {shadow.y * yPerPx + gapY}px);"
    />
{/if}

<style>
    /*
     lang="scss" type="text/scss"
    :global(:root) {
        .moveable {
            touch-action: none;
            position: absolute;
            will-change: auto;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            position: absolute;
            width: var(--width);
            height: var(--height);

            &.active {
                z-index: 3;
                cursor: grabbing;
                position: fixed;
                opacity: 0.8;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                -o-backface-visibility: hidden;
                -ms-backface-visibility: hidden;
                user-select: none;
            }
            &:hover {
                .move,
                .remove,
                .resizer {
                    z-index: 4;
                    visibility: visible;
                }
            }
            .button {
                user-select: none;
                visibility: hidden;
                width: 20px;
                height: 20px;
                position: absolute;
                color: rgba(var(--dark), 0.3);
                z-index: 2;
                &:hover {
                    color: rgba(var(--dark), 0.5);
                    rect {
                        fill: rgba(var(--dark), 0.5);
                    }
                }
            }
            .remove {
                left: 3px;
                top: 3px;
                cursor: pointer;
            }
            .move {
                right: 0;
                top: 0;
                cursor: grab;
                rect {
                    fill: rgba(var(--dark), 0.3);
                }
                &:hover {
                    rect {
                        fill: rgba(var(--dark), 0.5);
                    }
                }
            }
            .resizer {
                user-select: none;
                width: 20px;
                height: 20px;
                position: absolute;
                visibility: hidden;
                right: 0;
                bottom: 0;
                cursor: se-resize;
                &::after {
                    content: '';
                    position: absolute;
                    right: 0px;
                    bottom: 0px;
                    width: 10px;
                    height: 10px;
                    border-right: 2px solid rgba(var(--dark), 0.4);
                    border-bottom: 2px solid rgba(var(--dark), 0.4);
                }
            }
            &.dark {
                .remove {
                    color: rgba(var(--light), 0.3);
                    &:hover {
                        color: rgba(var(--light), 0.5);
                    }
                }
                .move {
                    rect {
                        fill: rgba(var(--light), 0.3);
                    }
                    &:hover {
                        rect {
                            fill: rgba(var(--light), 0.5);
                        }
                    }
                }
                .resizer {
                    &::after {
                        border-right-color: rgba(var(--light), 0.4);
                        border-bottom-color: rgba(var(--light), 0.4);
                    }
                }
            }
        }
        .movable-shadow {
            position: absolute;
            background-color: rgba(var(--dark), 0.07);
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            width: var(--width);
            height: var(--height);
            transform: var(--transform);

            &.active {
                z-index: 2;
                transition: all 0.2s;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                -o-backface-visibility: hidden;
                -ms-backface-visibility: hidden;
                -webkit-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                user-select: none;
            }
        }
    }
    */
</style>
