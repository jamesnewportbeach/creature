<script lang="ts">
  import { fade } from "svelte/transition";
  export let show = false;
  export let disableOverlay = false;

  function handleClickOverlay(e) {
    if ("close" in e.target.dataset) show = false;
  }
</script>

{#if show}
  <div
    class="flex-col -inset-0 flex fixed z-10 justify-center bg-opacity-50"
    class:bg-black={!disableOverlay}
    data-close
    on:click={handleClickOverlay}
    transition:fade={{ duration: 150 }}
  >
    <div
      style="width: 90vw; margin: 1rem auto 0.2rem;"
      class="relative bg-white shadow-lg p-4"
    >
      <p>About me...</p>
      <slot />
    </div>
  </div>
{/if}
