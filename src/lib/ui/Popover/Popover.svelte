<script lang="ts">
    import { onMount } from "svelte";

    import { fade } from "svelte/transition";
    export let position = "left";
    export let color = "black";
    export let pos = {};
    export let container;

    let rect,
        points,
        arrowHeight = 20;

    $: rect = container?.getBoundingClientRect();

    $: points = {
        top: { polygon: "0,0 127.5,127.5 255,0" },
        right: { polygon: "255,0 127.5,127.5 255,255" },
        left: {
            polygon: "0,0 127.5,127.5 0,255",
            svg: {
                l: rect?.width,
                t: rect?.height / 2 + arrowHeight / 2,
            },
            container: {
                l: pos.clientX,
                t: -rect?.height,
                m: { t: arrowHeight / 2, r: 0, l: 0, b: 0 },
            },
        },
        bottom: {
            polygon: "0,255 127.5,127.5 255,255",
            svg: {
                l: rect?.height / 2 + arrowHeight / 2,
                t: -arrowHeight,
            },
            container: {
                l: pos.clientX,
                t: -rect?.height,
                m: { t: arrowHeight / 2, r: 0, l: 0, b: 0 },
            },
        },
    };
</script>

<div
    transition:fade={{ duration: 100 }}
    style="
        left: {points[position].container.l}px; 
        top: {points[position].container.t}px; 
        margin-top: {points[position].container.m.t}px;
        margin-right: {points[position].container.m.r}px;
        margin-left: {points[position].container.m.l}px;
        margin-bottom: {points[position].container.m.b}px;
    "
    class="relative z-40"
>
    <slot />

    <svg
        class="absolute text-{color} z-50"
        style="width: {arrowHeight}px; height: {arrowHeight}px; left: {points[
            position
        ].svg.l}px; top: {points[position].svg.t}px;"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
        xml:space="preserve"
    >
        <polygon class="fill-current" points={points[position].polygon} />
    </svg>
</div>
