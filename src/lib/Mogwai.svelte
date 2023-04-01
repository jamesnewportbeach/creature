<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    dndzone,
    TRIGGERS,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from "svelte-dnd-action";
  import { nanoid } from "nanoid";
  import classNames from "classnames";

  import { focusedStore } from "../stores/ui/uiStore";
  import { ContainerTypes } from "$lib/App/EditPane/common.interface";
  import Layers from "$lib/App/EditPane/Layers.svelte";
  import Nav from "$lib/App/EditPane/Nav.svelte";
  import Ruler from "$lib/App/EditPane/Ruler.svelte";

  export let API;
  export let nodes;
  export let node;
  export let nodeId = "";

  const dispatch = createEventDispatcher();
  const flipDurationMs = 300;

  let shouldIgnoreDndEvents = false,
    editorEnabled = true;

  const getNodeClasses = () => {
      let nodeClassObj = {};
      if (node && "className" in node) {
        node.className
          .toString()
          .split(" ")
          .forEach((d) => {
            nodeClassObj[d] = true;
          });
      }
      return nodeClassObj;
    },
    keydown = (e) => {
      e.stopPropagation();
    },
    keyup = (e) => {
      tryEvents("keyup", e);
    },
    remove = (e) => {
      dispatch("sendEvent", {
        name: "delete",
        key: node.id,
      });
    },
    hover = (e, isHover) => {
      if (editorEnabled && node.id in nodes) {
        e.stopPropagation();
        dispatch("sendEvent", {
          name: "hover",
          key: node.id,
          value: isHover,
        });
      }
    },
    submit = (e) => {
      e.preventDefault();
      dispatch("sendEvent", {
        name: "submit",
        key: node.id,
      });
    },
    focus = (e, isFocus) => {
      tryEvents("focus", e);
    },
    click = (e) => {
      tryEvents("click", e);
    };

  const tryEvents = (eventName, e) => {
    if (node.events) {
      Object.keys(node.events).forEach((evs) => {
        console.log(evs);
        if (evs === eventName) {
          Object.keys(node.events[evs]).forEach((event) => {
            if (event === "stopPropagation") e.stopPropagation();
            console.log(node);
            dispatch("sendEvent", {
              ...{
                nodeId,
                name: event,
              },
              ...node.events[evs][event],
            });
          });
        }
      });
    }
  };

  const consider = (e) => {
      if (node.dragCopy) {
        const { trigger, id } = e.detail.info;

        if (trigger === TRIGGERS.DRAG_STARTED) {
          const idx = node.items.findIndex((item) => item.id === id);
          const newId = nanoid(11);
          const o = { id: newId };
          nodes[newId] = { ...nodes[id], ...o };

          console.log("DUPLICATING");
          console.log(nodes[newId]);

          e.detail.items = e.detail.items.filter(
            (item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]
          );
          e.detail.items.splice(idx, 0, {
            ...node.items[idx],
            id: newId,
          });

          node.items = e.detail.items;
          shouldIgnoreDndEvents = true;
          nodes = { ...nodes };
        } else if (!shouldIgnoreDndEvents) {
          node.items = e.detail.items;
        } else {
          node.items = [...node.items];
        }
      } else {
        const newItems = e.detail.items;
        const newItemIndex = newItems.findIndex(
          (d) =>
            d.isDndShadowItem === true &&
            d.id !== "id:dnd-shadow-placeholder-0000"
        );

        if (newItemIndex > -1) {
          const item = { ...newItems[newItemIndex] };
          if (!(item.id in nodes)) {
            const o = { id: item.id };
            nodes[item.id] = { ...o, ...nodes[item.id].copyProps };
            console.log("copied");
            console.log(nodes[item.id]); // copy from store
          }
        }

        node.items = newItems.map((d) => {
          let o = { id: d.id };
          if (d.isDndShadowItem) o["isDndShadowItem"] = true;
          return o;
        });

        nodes = { ...nodes };
      }
    },
    finalize = (e) => {
      if (node.dragCopy) {
        if (!shouldIgnoreDndEvents) {
          node.items = e.detail.items;
        } else {
          node.items = [...node.items];
          shouldIgnoreDndEvents = false;
        }
      } else {
        const source = nodes[e.detail.info.id];

        if ("copyProps" in source && !node.dragCopy) {
          const newObj = { id: source.id };
          const newCopy = { ...source.copyProps, ...newObj };
          nodes[source.id] = newCopy;
          console.log(source.copyProps);
        }

        setTimeout(() => {
          node.items = e.detail.items;
          nodes = { ...nodes };
          dispatch("sendEvent", { name: "saveTemplate" });
        });
      }
    };

  $: editClasses = classNames({
    "focus:outline-1": node && $focusedStore === node.id && editorEnabled,
    "focus:outline-dotted":
      node &&
      ($focusedStore === node.id ||
        (node.hovered && $focusedStore !== node.id)) &&
      editorEnabled,
    "outline-dotted":
      node &&
      ($focusedStore === node.id ||
        (node.hovered && $focusedStore !== node.id)) &&
      editorEnabled,
    "outline-1": editorEnabled && node && $focusedStore !== node.id,

    "outline-blue-500": node && $focusedStore === node.id && editorEnabled,
    "dark:outline-lime-500": node && $focusedStore === node.id && editorEnabled,
    "focus:outline-blue-500":
      node && $focusedStore === node.id && editorEnabled,
    "dark:focus:outline-lime-500":
      node && $focusedStore === node.id && editorEnabled,

    "outline-black/25":
      editorEnabled && node && $focusedStore !== node.id && !node.hovered,
    "outline-black/50":
      editorEnabled && node && $focusedStore !== node.id && node.hovered,
    "dark:outline-white/25":
      editorEnabled && node && $focusedStore !== node.id && !node.hovered,
    "dark:outline-white/50":
      editorEnabled && node && $focusedStore !== node.id && node.hovered,

    // "p-1": editorEnabled && node && node.tagName in ContainerTypes,
    "h-20": editorEnabled && node && "items" in node && node.items.length === 0,
    "h-full":
      editorEnabled && node && "items" in node && node.items.length === 0,
  });

  $: className = classNames(classNames(getNodeClasses()), editClasses);

  /*
  const setCopyNodes = (newData, s, oldId, itemRenderer) => {

    const newId = nanoid(11);

    const n = {
      id: newId,
      refId: oldId,
    };

    if (itemRenderer){
      n = {...n, ...itemRenderer}
    } else {
      n = {
        tagName: "div",
        className: "pl-2",
        value: newData[oldId].tagName,
      }
    }
    s[newId] = { ...newData[oldId], ...n };

    if ("items" in newData[oldId]) {
      const newItemsList = [];
      newData[oldId].items.forEach((d) => {
        const newId2 = nanoid(11);
        newItemsList.push({ id: newId2 });
        setCopyNodes(newData, s, d.id, newId2, itemRenderer);
      });
      s[newId].items = newItemsList;
    }
  };
  */

  const newNodes = {
    layers: {
      tagName: "div",
      className: "flex w-full cursor-pointer select-none px-2 py-1 rounded-lg",
      items: [{ id: "item" }, { id: "children" }],
    },

    item: {
      tagName: "div",
      className: "flex w-full cursor-pointer select-none px-2 py-1 rounded-lg",
      items: [
        { id: "treeItemLabel" },
        { id: "treeRemoveButton" },
        { id: "treeHideButton" },
      ],
    },

    treeItemLabel: {
      tagName: "span",
      className: "flex w-full leading-normal capitalize",
      valueExpression: "$t(nodes[id].tagName + '.' + $locale)",
    },

    treeRemoveButton: {
      tagName: "button",
      className: "mr-4 opacity-50",
      events: {
        click: {
          removeElement: {},
        },
      },
      items: [{ id: "treeRemoveIcon" }],
    },

    treeRemoveIcon: {
      tagName: "i",
      className: "fa fa-trash",
    },

    treeHideButton: {
      tagName: "button",
      className: "mr-4 opacity-50",
      events: {
        click: {
          toggleElementVisiblity: {},
        },
      },
      items: [{ id: "treeHideIcon" }],
    },

    treeHideIcon: {
      tagName: "i",
      className: "fa fa-eye",
    },

    children: {
      tagName: "div",
      className: "pl-2",
      items: [],
    },
  };

  const copyNodes = (c, copyId, newId) => {
    const n = {
      dataFrom: copyId,
    };

    c[newId] = { ...newNodes[copyId], ...n };

    if ("items" in c[newId]) {
      let newItems = [];
      c[newId].items.forEach((item) => {
        const newId2 = nanoid(11);
        copyNodes(c, item.id, newId2);
        newItems.push({ id: newId2 });
      });
      c[newId].items = newItems;
    }
  };

  const mergeNodesWithItemRenderer = (c, source, renderer, newNodes) => {
    const newId = nanoid(11);

    const cp = {};
    copyNodes(cp, renderer, newId);
    console.log(cp);

    if (source && "items" in source) {
      source.items.forEach((item) => {
        mergeNodesWithItemRenderer(c, nodes[item.id], renderer, newNodes);
      });
    }
  };

  onMount(() => {
    if (node && node.nodeSource && node.itemRenderer) {
      console.log(newNodes);

      let c = {};

      mergeNodesWithItemRenderer(
        c,
        nodes[node.nodeSource],
        node.itemRenderer,
        newNodes
      );

      console.log("gotcha:");
      console.log(c);

      /*
      // node = { ...node, ...node.itemRenderer };
        let copy = {};
        setCopyNodes(copy, node.nodeSource, node.itemRenderer);

        const motherKey = Object.keys(copy).find(
          (k) => copy[k].old === currentPage
        );
        console.log(copy);
        console.log(motherKey);

        nodes = { ...nodes, ...copy };
        nodes["layersPanel"].items.push({ id: motherKey });
        */
    }
  });
</script>

{#if node && !node.layerHidden}
  {#if node.nodeSource}
    <Layers id={node.nodeSource} bind:nodes on:sendEvent />
    <!-- svelte:self bind:nodes node={nodes[node.nodeSource]} on:sendEvent / -->
  {:else if node.id === "mainNav"}
    <Nav {API} />
  {:else if node.id === "ruler"}
    <Ruler />
  {:else if "items" in node}
    <svelte:element
      this={node.tagName}
      style={node.style ? node.style : undefined}
      title={node.title ? node.title : undefined}
      type={node.type ? node.type : undefined}
      tabindex={node.tabindex ? node.tabindex : undefined}
      aria-hidden={node.ariaHidden ? node.ariaHidden : undefined}
      aria-label={node.ariaLabel ? node.ariaLabel : undefined}
      aria-describedby={node.ariaDescribedBy ? node.ariaDescribedBy : undefined}
      disabled={node.disabled ? node.disabled : undefined}
      readonly={node.readonly ? node.readonly : undefined}
      class={className}
      use:dndzone={{
        items: node.items,
        flipDurationMs,
        morphDisabled: true,
        autoAriaDisabled: true,
        dragDisabled: !node.dragEnabled,
        dropFromOthersDisabled: !node.dropFromOthersEnabled,
        dropTargetStyle: {},
        dropTargetClasses: ["border-2", "border-dashed", "border-lime-500"],
      }}
      on:consider={consider}
      on:finalize={finalize}
      on:click={(e) => click(e)}
      on:submit={(e) => (node.tagName === "form" ? submit(e) : undefined)}
    >
      {#each node.items as item (item.id)}
        <svelte:self
          {API}
          bind:nodes
          nodeId={item.id}
          node={nodes[item.id]}
          on:sendEvent
        />
        <!--
        {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
          <div
            in:fade={{ duration: 200, easing: cubicIn }}
            class="border-dashed border-2 border-black/20 h-full w-full"
          />
        {/if}
        -->
      {/each}
    </svelte:element>
  {:else}
    {#if node.tagName === "input"}
      <input
        style={node.style ? node.style : undefined}
        title={node.title ? node.title : undefined}
        type={node.type ? node.type : undefined}
        tabindex={node.tabindex ? node.tabindex : undefined}
        aria-hidden={node.ariaHidden ? node.ariaHidden : undefined}
        aria-label={node.ariaLabel ? node.ariaLabel : undefined}
        aria-describedby={node.ariaDescribedBy
          ? node.ariaDescribedBy
          : undefined}
        disabled={node.disabled ? node.disabled : undefined}
        readonly={node.readonly ? node.readonly : undefined}
        class={className}
        on:keyup={(e) => keyup(e)}
        on:click={(e) => click(e)}
      />
    {:else}
      <svelte:element
        this={node.tagName}
        style={node.style ? node.style : undefined}
        title={node.title ? node.title : undefined}
        type={node.type ? node.type : undefined}
        tabindex={node.tabindex ? node.tabindex : undefined}
        aria-hidden={node.ariaHidden ? node.ariaHidden : undefined}
        aria-label={node.ariaLabel ? node.ariaLabel : undefined}
        aria-describedby={node.ariaDescribedBy
          ? node.ariaDescribedBy
          : undefined}
        disabled={node.disabled ? node.disabled : undefined}
        readonly={node.readonly ? node.readonly : undefined}
        class={className}
        on:keyup={(e) => keyup(e)}
        on:click={(e) => click(e)}
      >
        {#if node.tagName === "select" && node.options}
          {#each Object.keys(node.options) as key}
            <option value={key}>
              {node.options[key].label}
            </option>
          {/each}
        {:else if "value" in node}
          {node.value}
        {/if}
      </svelte:element>
    {/if}

    {#if "dataList" in node}
      <datalist id={node.id ? node.id + "_list" : undefined}>
        {#each Object.keys(node.dataList) as key}
          <option>{node.dataList[key].label || key}</option>
        {/each}
      </datalist>
    {/if}
  {/if}
{/if}
