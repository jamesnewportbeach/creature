<script lang="ts">
  import { locale, t } from "../../../../stores/translations/i18n";
  import { createEventDispatcher, onMount } from "svelte";
  import Element from "$lib/App/Element.svelte";

  export let id = "";
  export let API;

  $: predicates = {};

  const dispatch = createEventDispatcher();

  const getId = (value) => {
    let o = {};

    Object.keys(predicates).forEach((k) => {
      if (predicates[k].label === value) o["id"] = k;
    });

    if (!("id" in o)) {
      o["value"] = value;
    }
    return o;
  };

  let textObj = { predicate: null, object: null };

  const predicateEvents = (e) => {
    const d = e.detail;
  };

  const objectEvents = (e) => {
    const d = e.detail;
    if (
      d.name === "buttonClick" &&
      textObj.predicate !== null &&
      textObj.object !== null
    ) {
      dispatch("sendEvent", {
        name: "assert",
        subject: id,
        predicate: getId(textObj.predicate),
        object: getId(textObj.object),
      });
      textObj.predicate = null;
      textObj.object = null;
    }
  };

  onMount(() => {
    API.read("/predicates2")
      .map()
      .on((d, k) => {
        if (typeof d === "object" && d) {
          if ("label" in d && "#" in d.label) {
            // console.log(d._["#"]);
            API.read(d.label["#"])
              .get($locale)
              .once((l) => {
                predicates[d._["#"]] = { label: l };
              });
          } else {
            predicates[d._["#"]] = { label: k };
          }
          // console.log(predicateData);
        }
      });
  });
</script>

<Element {API} tagName="form" className="flex">
  <Element
    {API}
    bind:value={textObj.predicate}
    on:sendEvent={(e) => predicateEvents(e)}
    dragDisabled={true}
    dropFromOthersDisabled={true}
    tagName="input"
    type="text"
    id="property"
    placeholder={$t("property." + $locale)}
    autocomplete="off"
    className="flex w-1/3"
    inputContainerClassName="p-0"
    inputClassName="bg-transparent h-full appearance-none w-full p-0 outline-none"
    dataList={predicates}
  />

  <Element
    {API}
    bind:value={textObj.object}
    on:sendEvent={(e) => objectEvents(e)}
    dragDisabled={true}
    dropFromOthersDisabled={true}
    tagName="input"
    type="text"
    id="value"
    placeholder={$t("value." + $locale)}
    autocomplete="off"
    className="flex w-full"
    buttonIcon="fa-light fa-plus"
    dataList={predicates}
  />
</Element>
