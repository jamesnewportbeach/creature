import { writable } from "svelte/store";

export const inputFocusedStore = writable(false);
export const focusedStore = writable(null);
export const templateStore = writable({});

export const nodeStore = writable({
  components: {
    id: "components",
    tagName: "div",
    className: "flex flex-wrap flex-row",
    itemClassName: "p-2 inline-block cursor-grab opacity-50 hover:opacity-100",
    dragDisabled: false,
    dropFromOthersDisabled: true,
    dragCopy: true,
    items: [],
  },
});
