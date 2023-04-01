<script lang="ts">
  import Ruler from "svelte-ruler/src/Ruler.svelte";
  import { userStore } from "../../../stores/ui/uiStore";
</script>

{#if $userStore.panelOpen && $userStore.ruler}
  <div class="w-full">
    <Ruler type="horizontal" height={32} />
    <!-- Ruler
              height={32}
              backgroundColor={darkMode
                ? "rgba(0,0,0,.1)"
                : "rgba(255,255,255,.1)"}
              textColor={darkMode ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.4)"}
              lineColor={darkMode ? "rgba(0,0,0,.3)" : "rgba(255,255,255,.3)"}
              type="horizontal"
              ref={rulerRef}
            / -->
  </div>
{/if}
