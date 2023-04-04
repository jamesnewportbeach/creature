<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";

    import Icon from "$lib/Icon/Icon.svelte";
    import { faTimes } from "@fortawesome/free-solid-svg-icons";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { find } from "highcharts";
    import Mogwai from "$lib/Mogwai/Mogwai.svelte";

    export let settingsStore;
    export let classNames = "";
    export let columns = 6;
    export let gapX = 10;
    export let gapY = 10;
    export let rowHeight = 100;
    export let children = [];

    const dispatch = createEventDispatcher();

    let listItems = [];

    const handlePointerUp = (e) => {
            /*
            if (newPos) {
                db.collection(nodeCollection)
                    .doc(newPos.id)
                    .update({
                        x: newPos.x,
                        y: newPos.y,
                        w: newPos.w,
                        h: newPos.h,
                    })
                    .then(() => {
                        newPos = null;
                    });
            }
            */
        },
        handleResize = (e) => {
            // console.log(e);
        },
        handleMount = (e) => {
            // console.log(e);
        },
        handleAdd = () => {
            dispatch("add", {});
        },
        handleChange = (e) => {
            let newPos = e.detail.unsafeItem[e.detail.cols];
            dispatch("layoutChange", newPos);
        },
        handleRemove = (nodeId) => {
            dispatch("remove", { id: nodeId });
        };

    const cols = [[1200, columns]];

    const buildLayoutPanel = (d) => {
        let o = {
            props: d,
            id: d.id,
            custom: true,
            customDragger: true,
            x: d.x || 0,
            y: d.y || 0,
            w: d.w || 1,
            h: d.h || 1,
            resizable: !d.disableResize,
            removable: !d.disableRemove,
            draggable: !d.disableDrag,
        };

        if (d.fixed) {
            o.fixed = d.fixed;
        }

        if (d.maxHeight || d.maxWidth) {
            let max = {};
            if (d.maxHeight) {
                max["h"] = d.maxHeight;
            }
            if (d.maxWidth) {
                max["w"] = d.maxWidth;
            }
            o.max = max;
        }
        if (d.minHeight || d.minWidth) {
            let min = {};
            if (d.minHeight) {
                min["h"] = d.minHeight;
            }
            if (d.minWidth) {
                min["w"] = d.minWidth;
            }
            o.min = min;
        }
        let p = {
            id: d.id,
            // randomColor: randomHexColorCode(),
        };
        p[columns] = gridHelp.item(o);

        return p;
    };

    onMount(() => {});

    children.forEach((doc) => {
        const newPanel = buildLayoutPanel(doc);
        listItems.push(newPanel);
        // listItems = gridHelp.normalize(listItems, columns);
        listItems = gridHelp.adjust(listItems, columns);
    });

    const addIconSettings = {
        value: "Plus",
        classList: { w: 10, h: 10 },
        type: "icon",
    };
    const deleteIconSettings = { value: "Times" };

    const findItem = (id) => {
        return children.find((d) => (d.id = id));
    };
</script>

<div class={classNames}>
    {#if listItems.length > 0}
        <Grid
            items={listItems}
            on:pointerup={handlePointerUp}
            on:resize={handleResize}
            on:mount={handleMount}
            on:change={handleChange}
            gap={[gapX, gapY]}
            rowHeight={rowHeight || 100}
            let:dataItem
            {cols}
            let:movePointerDown
        >
            {#if $settingsStore.editable}
                <span
                    style="left: 8px; top: 5px;"
                    class="absolute w-4 h-4 z-10 select-none cursor-pointer opacity-50 {$settingsStore?.dark
                        ? 'text-white'
                        : 'text-black'}"
                    on:click={() => handleRemove(dataItem.id)}
                    on:pointerdown|stopPropagation
                >
                    <Icon
                        icon={"faTimes"}
                        on:click={handleRemove(dataItem.id)}
                    />
                </span>

                <span
                    style="cursor: grab; right: 5px; top: 5px;"
                    class="absolute w-4 h-4 z-10 select-none opacity-50 focus:outline-none {$settingsStore?.dark
                        ? 'text-white'
                        : 'text-black'}"
                    on:pointerdown={movePointerDown}
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
                </span>
            {/if}

            {#if dataItem[columns]}
                <Mogwai nodeId={dataItem[columns].id} />
            {/if}
        </Grid>
    {:else}
        <Icon n={addIconSettings} on:nodeClick={handleAdd} />
    {/if}
</div>

<style>
    :global(.svlt-grid-shadow) {
        background-color: rgba(0, 0, 0, 0.05) !important;
        border-radius: 10px;
    }

    :global(.svlt-grid-resizer::after) {
        height: 10px;
        width: 10px;
    }
</style>
