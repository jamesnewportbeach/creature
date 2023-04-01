<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { locale, t } from "../../stores/translations/i18n";
  import lz from "lzutf8";
  import { nanoid } from "nanoid";
  import { components } from "./EditPane/components";
  import Element from "./Element.svelte";
  import {
    userStore,
    focusedStore,
    nodeStore,
    templateStore,
  } from "../../stores/ui/uiStore";

  export let API;
  export let templatePath = "";
  export let editorEnabled = false;

  const dispatch = createEventDispatcher();

  let lastVersion;

  $: nodes = {};

  onMount(() => {
    if (templatePath) {
      if (templatePath === "/components") {
        console.log("COMPONSSSSS");

        let copyObj = {},
          newItems = [];

        Object.keys(components).forEach((key) => {
          // Copy icons...
          if (key.indexOf("_") > -1) {
            copyObj[key] = components[key];
          }
        });

        copyObj[templatePath] = components[templatePath];
        components[templatePath].items.forEach((item) => {
          const newId = nanoid(4);
          copyObj[newId] = { ...components[item["id"]] };
          //console.log(copyObj);
          copyObj[newId].id = newId;
          newItems.push({ id: newId });
          /*
            const newItems2 = [];
            if ("items" in copyObj[newId]) {
              copyObj[newId].items.forEach((item2, index) => {
                const newId2 = nanoid(4);
                copyObj[newId2] = { ...components[item2["id"]] };
                copyObj[newId2].id = newId2;
                newItems2.push({ id: newId2 });
              });
              copyObj[newId].items = newItems2;
            }
            */
        });
        copyObj[templatePath].items = newItems; // Randomize ID's for copying...

        nodes = copyObj;

        templateStore.update((s) => {
          return { ...s, ...copyObj };
        });

        // nodes = { ...nodes, ...copyObj };

        // API.storeTemplate(templatePath, copyObj);
      } else {
        API.read(templatePath).once((d) => {
          console.log(d);
          if (d && lastVersion !== d) {
            lastVersion = d;
            const uncompressed = lz.decompress(
              lz.decodeBase64(decodeURIComponent(lastVersion))
            );
            console.log(uncompressed);
            let newData = JSON.parse(uncompressed);
            if ("tagName" in newData) {
              console.log("FROM SERVER");
              //nodes = newData;
              nodes = newData;

              templateStore.update((s) => {
                return { ...s, ...newData };
              });
            } else {
              console.log("SERVER BLANK");
              const o = {};
              o[templatePath] = {
                id: templatePath,
                tagName: "div",
                className: "w-full flex flex-col",
                items: [],
              };
              nodes = o;

              templateStore.update((s) => {
                return { ...s, ...o };
              });
            }
          } else {
            console.log("NONEXIST");
            const o = {};
            o[templatePath] = {
              id: templatePath,
              tagName: "div",
              className: "w-full flex flex-col",
              items: [],
            };
            nodes = o;

            templateStore.update((s) => {
              return { ...s, ...o };
            });
          }
        });
      }
    }

    /*
      if (labelPath) {
        API.read(labelPath).once((d) => {
          if (d) {
            label = d;
          }
        });
      }
      */
  });
</script>

{#if templatePath in $templateStore}
  <Element
    bind:nodes
    on:sendEvent
    {...$templateStore[templatePath]}
    {API}
    {editorEnabled}
  />
{/if}
