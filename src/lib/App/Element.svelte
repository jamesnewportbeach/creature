<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    dndzone,
    TRIGGERS,
    SHADOW_PLACEHOLDER_ITEM_ID,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from "svelte-dnd-action";
  import { ContainerTypes } from "$lib/App/EditPane/common.interface";
  import classNames from "classnames";
  import { nanoid } from "nanoid";
  import {
    userStore,
    focusedStore,
    nodeStore,
    templateStore,
  } from "../../stores/ui/uiStore";
  import { locale, t } from "../../stores/translations/i18n";

  export let nodes = {};
  export let items = [];
  export let value = null;
  export let API;
  export let editorEnabled = false;
  export let hovered = false;
  export let updateEvent = "";

  export let labelClassName = "flex opacity-50 mb-1 mr-2";
  export let inputContainerClassName = "";
  export let itemClassName = "";

  export let inputClassName = "";
  export let labelPath = "";
  export let parentId = "";
  export let removeButton = false;
  export let layerHidden = false;
  export let ariaHidden = false;
  export let dragDisabled = false;
  export let dragCopy = false;
  export let dropFromOthersDisabled = false;

  export let ariaLabel = "";
  export let ariaDescribedBy = "";
  export let title = "";
  export let buttonIcon = "";
  export let buttonClassName = "flex px-2 outline-none";

  export let tagName = "div";
  export let style = "";
  export let className = "";
  export let placeholder = "";
  export let label = "";
  export let labelFor = "";
  export let type = "";
  export let autocomplete = "";
  export let id = "";
  export let href = "";
  export let src = "";
  export let spellcheck = false;
  export let readonly = false;
  export let disabled = false;
  export let rows = 2;
  export let step = 5;
  export let min = 0;
  export let max = 100;
  export let events = {};
  export let dataList = {};

  const dispatch = createEventDispatcher();

  let shouldIgnoreDndEvents = false;

  const flipDurationMs = 300,
    inputContainerClasses =
      "flex flex-row mb-1 bg-white/25 dark:bg-black/25 rounded items-center w-full",
    coreInputClass =
      "w-full bg-transparent appearance-none py-1 px-2 outline-none",
    blankContainerClasses = "flex mb-1";

  const considerDrag = (e) => {
      if (dragCopy) {
        const { trigger } = e.detail.info;
        const copyId = e.detail.info.id;

        if (trigger === TRIGGERS.DRAG_STARTED) {
          const idx = items.findIndex((item) => item.id === copyId);

          const newId = nanoid(11);
          const o = { id: newId };
          nodes[newId] = { ...nodes[copyId], ...o };

          console.log("DUPLICATING");
          console.log(nodes[newId]);

          e.detail.items = e.detail.items.filter(
            (item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]
          );
          e.detail.items.splice(idx, 0, {
            ...items[idx],
            id: newId,
          });

          nodes[id].items = e.detail.items;
          shouldIgnoreDndEvents = true;
          nodes = { ...nodes };
        } else if (!shouldIgnoreDndEvents) {
          nodes[id].items = e.detail.items;
        } else {
          nodes[id].items = [...items];
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
            $templateStore[item.id];
            const o = { id: item.id };
            nodes[item.id] = { ...o, ...$templateStore[item.id].copyProps };
            console.log("copied");
            console.log(nodes[item.id]); // copy from store
            console.log(nodes);
          }
        }

        if (id in nodes) {
          nodes[id].items = newItems.map((d) => {
            let o = { id: d.id };
            if (d.isDndShadowItem) o["isDndShadowItem"] = true;
            return o;
          });

          nodes = { ...nodes };
        }
      }
    },
    finalizeDrag = (e) => {
      if (dragCopy) {
        if (!shouldIgnoreDndEvents) {
          nodes[id].items = e.detail.items;
        } else {
          nodes[id].items = [...nodes[id].items];
          shouldIgnoreDndEvents = false;
        }
      } else {
        nodes[id].items = e.detail.items;
        nodes = { ...nodes };
        //dispatch("sendEvent", { name: "saveTemplate" });
      }
    },
    keydown = (e) => {
      //if ("value") {
      e.stopPropagation();
      //}
    },
    keyup = (e) => {
      /*
      if (nodes && id in nodes && $focusedStore === id) {
        e.preventDefault();
        e.stopPropagation();
        nodes[id].value = e.target.innerText;
        dispatch("sendEvent", { name: "saveTemplate" });
      }
      */
      /*
      dispatch("sendEvent", {
        name: updateEvent ? updateEvent : "update",
        key: id,
        value: {html: value},
      });
      */
    },
    clickButton = (e) => {
      dispatch("sendEvent", {
        name: "buttonClick",
        key: id,
        value: value,
      });
    },
    remove = (e) => {
      dispatch("sendEvent", {
        name: "delete",
        key: id,
        from: parentId,
      });
    },
    hover = (e, isHover) => {
      if (editorEnabled) {
        e.stopPropagation();
        dispatch("sendEvent", {
          name: "hoverElement",
          key: id,
          value: isHover,
        });
      }
    },
    submit = (e) => {
      e.preventDefault();
      dispatch("sendEvent", {
        name: "submit",
        key: id,
      });
    },
    focus = (e, isFocus) => {
      if (editorEnabled) {
        e.stopPropagation();
        dispatch("sendEvent", {
          name: "clickElement",
          key: id,
          value: isFocus,
        });
      }
    },
    click = (e) => {
      /*
      if (editorEnabled) {
        // e.stopPropagation();
        dispatch("sendEvent", {
          name: "clickElement",
          key: id,
        });
      }
      */

      if (events) {
        Object.keys(events).forEach((evs) => {
          console.log(evs);
          if (evs === "click") {
            Object.keys(events[evs]).forEach((event) => {
              if (event === "stopPropagation") e.stopPropagation();
              dispatch("sendEvent", {
                ...{
                  name: event,
                },
                ...events[evs][event],
              });
            });
          }
        });
      }
    },
    getNodeClasses = (n) => {
      let nodeClassObj = {};
      if (n) {
        n.toString()
          .split(" ")
          .forEach((d) => {
            nodeClassObj[d] = true;
          });
      }
      return nodeClassObj;
    };

  $: editClasses = classNames({
    "focus:outline-1": $focusedStore === id && editorEnabled,
    "focus:outline-dotted":
      ($focusedStore === id || (hovered && $focusedStore !== id)) &&
      editorEnabled,
    "outline-dotted":
      ($focusedStore === id || (hovered && $focusedStore !== id)) &&
      editorEnabled,
    "outline-1": $focusedStore === id && editorEnabled,

    "outline-blue-500": $focusedStore === id && editorEnabled,
    "dark:outline-lime-500": $focusedStore === id && editorEnabled,
    "focus:outline-blue-500": $focusedStore === id && editorEnabled,
    "dark:focus:outline-lime-500": $focusedStore === id && editorEnabled,

    "outline-black/25": editorEnabled && $focusedStore !== id && !hovered,
    "outline-black/50": editorEnabled && $focusedStore !== id && hovered,
    "dark:outline-white/25": editorEnabled && $focusedStore !== id && !hovered,
    "dark:outline-white/50": editorEnabled && $focusedStore !== id && hovered,

    "p-1": editorEnabled && tagName in ContainerTypes,
    "h-20": editorEnabled && items.length === 0,
    "h-full": editorEnabled && items.length === 0,
  });

  $: className = classNames(classNames(getNodeClasses(className)), editClasses);

  onMount(() => {
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

  $: subItems =
    nodes && id in nodes && "items" in nodes[id] ? nodes[id].items : [];
</script>

{#if nodeSource !== ""}
  SOURCE: {nodeSource}
{:else if !layerHidden}
  {#if tagName === "input" || tagName === "select" || tagName === "textarea"}
    <svelte:self tagName="div" {API}>
      {#if label}
        <svelte:self
          {API}
          dragDisabled={true}
          dropFromOthersDisabled={true}
          tagName="label"
          title={id}
          labelFor={id}
          value={label}
          className={labelClassName || labelClassName}
        />
      {/if}

      <svelte:self
        {API}
        tagName="div"
        className={type === "range" ||
        type === "checkbox" ||
        type === "radio" ||
        type === "file"
          ? blankContainerClasses
          : inputContainerClassName
          ? inputContainerClassName
          : inputContainerClasses}
      >
        {#if type === "text"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="text"
            {placeholder}
            {autocomplete}
            {spellcheck}
            {disabled}
            {readonly}
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
          />
        {:else if type === "number"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="number"
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
            {disabled}
            {readonly}
            {step}
            {min}
            {max}
          />
        {:else if type === "password"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="password"
            {autocomplete}
            class={inputClassName ? inputClassName : coreInputClass}
            {disabled}
            {readonly}
          />
        {:else if type === "email"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="email"
            {placeholder}
            {autocomplete}
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
            {disabled}
            {readonly}
          />
        {:else if type === "tel"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="tel"
            {placeholder}
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
            {disabled}
            {readonly}
          />
        {:else if type === "color"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="color"
            {placeholder}
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
            {disabled}
            {readonly}
          />
        {:else if type === "date"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="date"
            class={inputClassName ? inputClassName : coreInputClass}
            {disabled}
            {readonly}
          />
        {:else if type === "datetime-local"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="datetime-local"
            class={inputClassName ? inputClassName : coreInputClass}
            {disabled}
            {readonly}
          />
        {:else if type === "time"}
          <input
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {id}
            type="time"
            class={inputClassName ? inputClassName : coreInputClass}
            {disabled}
            {readonly}
          />
        {:else if type === "range"}
          <input
            bind:value
            {id}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            type="range"
            {step}
            {min}
            {max}
            class="outline-none w-full"
            {disabled}
            {readonly}
          />
        {:else if type === "radio"}
          <input
            bind:value
            {id}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            type="radio"
            class={"outline-none"}
            {disabled}
            {readonly}
          />
        {:else if type === "checkbox"}
          <input
            bind:checked={value}
            {id}
            type="checkbox"
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            class={"outline-none"}
            {disabled}
            {readonly}
          />
        {:else if tagName === "textarea"}
          <textarea
            bind:value
            on:keyup={(e) => keyup(e)}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {placeholder}
            {rows}
            {autocomplete}
            {spellcheck}
            class={inputClassName ? inputClassName : coreInputClass}
            list={dataList ? id + "_list" : undefined}
            {disabled}
            {readonly}
          />
        {:else if tagName === "select"}
          <select
            bind:value
            on:change={keyup}
            {style}
            {title}
            aria-hidden={ariaHidden ? ariaHidden : undefined}
            aria-label={ariaLabel ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
            {disabled}
            {readonly}
            class={inputClassName ? inputClassName : coreInputClass}
          >
            {#if dataList}
              {#each Object.keys(dataList) as key}
                <option value={key}>
                  {dataList[key].label}
                </option>
              {/each}
            {:else}
              <option>Empty</option>
            {/if}
          </select>
        {:else}
          No component {type}
        {/if}

        {#if buttonIcon}
          <svelte:self
            {API}
            on:sendEvent
            tagName="button"
            type="button"
            className={buttonClassName}
            events={{
              click: {
                stopPropagation: true,
                clickButton: { key: id, from: parentId },
              },
            }}
          >
            <svelte:self {API} tagName="i" className={buttonIcon} />
          </svelte:self>
        {/if}

        {#if removeButton}
          <svelte:self
            {API}
            on:sendEvent
            tagName="button"
            type="button"
            className="flex px-2 outline-none"
            events={{
              click: {
                stopPropagation: true,
                delete: { key: id, from: parentId },
              },
            }}
          >
            <svelte:self {API} tagName="i" className="fa-thin fa-times" />
          </svelte:self>
        {/if}
      </svelte:self>
    </svelte:self>

    {#if tagName !== "select" && dataList}
      <datalist id={id ? id + "_list" : undefined}>
        {#each Object.keys(dataList) as key}
          <option>{dataList[key].label || key}</option>
        {/each}
      </datalist>
    {/if}
  {:else if tagName === "span"}
    {#if editorEnabled}
      <span
        class="outline-none focus:outline-none"
        on:keydown|stopPropagation
        on:keyup={(e) => keyup(e)}
        contenteditable="true"
        bind:innerHTML={value}
      />
    {:else}
      <span contenteditable="false" bind:innerHTML={value} />
    {/if}
  {:else}
    <svelte:element
      this={tagName}
      class={className}
      type={tagName === "button" || tagName === "input" ? type : undefined}
      href={tagName === "a" ? href : undefined}
      src={tagName === "img" ? src : undefined}
      labelFor={tagName === "label" && labelFor !== "" ? labelFor : undefined}
      {style}
      {title}
      aria-hidden={ariaHidden ? ariaHidden : undefined}
      aria-label={ariaLabel ? ariaLabel : undefined}
      aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
      use:dndzone={{
        items: subItems,
        flipDurationMs,
        morphDisabled: true,
        autoAriaDisabled: true,
        centreDraggedOnCursor: false,
        dragDisabled: dragDisabled,
        dropFromOthersDisabled: dropFromOthersDisabled,
        dropTargetStyle: {},
        dropTargetClasses: ["outline-2", "outline-dashed", "outline-lime-500"],
      }}
      on:consider={considerDrag}
      on:finalize={finalizeDrag}
      on:pointerover={(e) => hover(e, true)}
      on:pointerout={(e) => hover(e, false)}
      on:click={(e) => click(e)}
      on:submit={(e) => (tagName === "form" ? submit(e) : undefined)}
    >
      {#if $$slots.default}
        <slot />
      {:else}
        {#if value}
          {#if editorEnabled}
            <span
              class="outline-none focus:outline-none"
              on:keydown|stopPropagation
              on:keyup={(e) => keyup(e)}
              contenteditable="true"
              bind:innerHTML={value}
            />
          {:else}
            <span contenteditable="false" bind:innerHTML={value} />
          {/if}
        {/if}

        {#each subItems as item (item.id)}
          {#if item.id !== SHADOW_PLACEHOLDER_ITEM_ID && item.id in nodes}
            <svelte:self
              bind:nodes
              on:sendEvent
              {editorEnabled}
              {API}
              {...nodes[item.id]}
              className={nodes[id].itemClassName
                ? nodes[id].itemClassName
                : nodes[item.id].className}
            />
          {:else}
            PLACEHOLDER
          {/if}
        {/each}
      {/if}

      {#if buttonIcon}
        <svelte:self
          {API}
          on:sendEvent
          tagName="button"
          type="button"
          className="flex px-2 outline-none"
          events={{
            click: {
              stopPropagation: true,
              clickButton: { key: id, from: parentId },
            },
          }}
        >
          <svelte:self {API} tagName="i" className={buttonIcon} />
        </svelte:self>
      {/if}
    </svelte:element>
  {/if}
{/if}
