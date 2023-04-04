<!-- svelte:options tag="highchart-box" / -->
<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import Highcharts from "highcharts";
  import funnel from "highcharts/modules/funnel";
  import data from "highcharts/modules/data";
  import exporting from "highcharts/modules/exporting";
  import exportdata from "highcharts/modules/export-data";
  import { darkTheme, lightTheme } from "./HighCharts-themes";

  export let config = {};
  export let settingsStore;

  let canvas,
    height = 300;

  /*
  data(Highcharts);
  exporting(Highcharts);
  exportdata(Highcharts);
  funnel(Highcharts);
   */

  afterUpdate(() => {
    setTimeout(() => {
      Highcharts.theme = $settingsStore?.dark ? darkTheme : lightTheme;
      Highcharts.setOptions(Highcharts.theme);
      Highcharts.chart(canvas, config);
    }, 50);
  });
</script>

<div bind:this={canvas} style={"height: " + height + "px"} class="w-full" />
