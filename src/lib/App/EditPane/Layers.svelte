<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { SHADOW_PLACEHOLDER_ITEM_ID } from "svelte-dnd-action";
  import { locale, t } from "../../../stores/translations/i18n";
  import { focusedStore } from "../../../stores/ui/uiStore";

  export let nodes;
  export let id;

  const dispatch = createEventDispatcher();
  const flipDurationMs = 300;
</script>

{#if id in nodes}
  <div
    class="flex w-full cursor-pointer select-none px-2 py-1 rounded-lg"
    class:bg-zinc-800={$focusedStore === id}
    on:click|stopPropagation={() =>
      dispatch("sendEvent", {
        name: "clickElement",
        key: id,
      })}
  >
    <!-- button
    class={node.items ? "mr-2" : "mr-2 invisible cursor-none"}
    on:click|stopPropagation={toggleExpand}
  >
    <i
      class={node.layerHidden
        ? "fa-light fa-chevron-down"
        : "fa-light fa-chevron-right"}
    />
  </button -->

    <span class="flex w-full leading-normal capitalize">
      {$t(nodes[id].tagName + "." + $locale)}
    </span>

    <button
      class="mr-4 opacity-50"
      on:click|stopPropagation={() =>
        dispatch("sendEvent", {
          name: "removeElement",
          key: id,
        })}
    >
      <i class="fa fa-trash" />
    </button>

    <button
      class={nodes[id].layerHidden ? "opacity-25" : "opacity-50"}
      on:click|stopPropagation={() =>
        dispatch("sendEvent", {
          name: "toggleElementVisiblity",
          key: id,
        })}
    >
      <i class="fa fa-eye" />
    </button>
  </div>

  {#if nodes[id].hasOwnProperty("items")}
    <ul class="pl-0">
      {#each nodes[id].items.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as item (item.id)}
        <li animate:flip={{ duration: flipDurationMs }} class="pl-3">
          <svelte:self id={item.id} bind:nodes on:sendEvent />
        </li>
      {/each}
    </ul>
  {/if}
{/if}
