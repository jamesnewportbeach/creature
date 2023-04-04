<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { nanoid } from "nanoid";
  import isEqual from "lodash.isequal";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import "ag-grid-enterprise/dist/styles/ag-grid.css";
  import "ag-grid-enterprise/dist/styles/ag-theme-alpine.css";
  import {
    AddButtonCellRenderer,
    DeleteButtonCellRenderer,
  } from "$lib/Graph/components/GridCells";
  import { Dialog, Button } from "svelte-materialify";
  import AddStatement from "$lib/Graph/Statements/AddStatement.svelte";
  import UiNode from "$lib/Graph/UiNode.svelte";
  const createLabel = (strLabel) => {
      const d = document.createElement("div");
      d.setAttribute("class", "p-2 flex align-center");
      const label = document.createElement("label");
      const labelText = document.createTextNode(strLabel);
      label.setAttribute("class", "mr-2");
      label.appendChild(labelText);
      d.appendChild(label);
      return d;
    },
    createInput = (type, value) => {
      const input = document.createElement("input");
      const inputClasses =
        "border p-2 outline-none bg-opacity-30 bg-white rounded-sm w-full";
      input.setAttribute("class", inputClasses);
      input.setAttribute("type", type);
      if (value !== null) {
        input.value = value;
      }
      return input;
    },
    formWrapper = (id, label, inner) => {
      return (
        "<div class='flex'><label class='mr-2 opacity-60' title='" +
        id +
        "''>" +
        label +
        ":</label><span>" +
        inner +
        "</span></div>"
      );
    },
    formatLabel = (data) => {
      const uriParts = data.id.split("/");
      const end = uriParts[uriParts.length - 1];
      let label = end;
      if (end.indexOf(":") > -1) {
        const labelNode = $nodesStore.find(
          (d) => d.id === end.split(":").join("/") + "/label/" + lang
        );
        if (labelNode) label = labelNode.value;
      } else {
        const labelNode = $nodesStore.find(
          (d) => d.id === data.id + "/label/" + lang
        );
        //console.log(labelNode);
        if (labelNode) label = labelNode.value;
      }
      return label;
    };
  function BooleanEditor() {
    function renderer() {}
    renderer.prototype.init = function (params) {
      this.params = params;
      this.gui = createLabel(formatLabel(params.data));
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      this.gui.appendChild(input);
      input.checked = this.params.data.value === true;
    };
    renderer.prototype.getGui = function () {
      return this.gui;
    };
    renderer.prototype.getValue = function () {
      return this.gui.querySelector("input").checked;
    };
    renderer.prototype.isPopup = function () {
      return true;
    };
    renderer.prototype.afterGuiAttached = function () {
      this.gui.querySelector("input").focus();
    };
    return renderer;
  }
  function TextEditor() {
    function renderer() {}
    renderer.prototype.init = function (params) {
      this.params = params;
      this.gui = createLabel(formatLabel(params.data));
      const input = createInput("text", this.params.data.value);
      this.gui.appendChild(input);
    };
    renderer.prototype.getGui = function () {
      return this.gui;
    };
    renderer.prototype.getValue = function () {
      return this.gui.querySelector("input").value;
    };
    renderer.prototype.isPopup = function () {
      return true;
    };
    renderer.prototype.afterGuiAttached = function () {
      this.gui.querySelector("input").focus();
    };
    return renderer;
  }
  function NumericEditor() {
    function renderer() {}
    renderer.prototype.init = function (params) {
      this.params = params;
      this.gui = createLabel(formatLabel(params.data));
      const input = createInput("number", this.params.data.value);
      this.gui.appendChild(input);
    };
    renderer.prototype.getGui = function () {
      return this.gui;
    };
    renderer.prototype.getValue = function () {
      return parseFloat(this.gui.querySelector("input").value);
    };
    renderer.prototype.isPopup = function () {
      return true;
    };
    renderer.prototype.afterGuiAttached = function () {
      this.gui.querySelector("input").focus();
    };
    return renderer;
  }
  function ObjectEditor() {
    function renderer() {}
    renderer.prototype.init = function (params) {
      this.params = params;
      this.gui = createLabel("Label");
      console.log(params.data);
      //console.log(this.store.find())
      const input = createInput("text", formatLabel(params.data));
      this.gui.appendChild(input);
    };
    renderer.prototype.getGui = function () {
      return this.gui;
    };
    renderer.prototype.getValue = function () {
      return this.gui.querySelector("input").value;
    };
    renderer.prototype.isPopup = function () {
      return true;
    };
    renderer.prototype.afterGuiAttached = function () {
      const input = this.gui.querySelector("input");
      input.focus();
      if (this.params.data.id.endsWith(input.value)) input.select();
    };
    return renderer;
  }
  function getGroupRenderer() {
    function renderer() {}
    renderer.prototype.init = function (params) {
      let label = formatLabel(params.data);
      let html = "<span>" + label + "</span>";
      let tempDiv = document.createElement("div");
      if (params.data) {
        if (params.data.type === "object") {
          let icon = params.data.icon
            ? "<i class='far " + params.data.icon + " mr-2'></i>"
            : "";
          html =
            "<span class='mr-2' title='" +
            params.data.id +
            "''>" +
            icon +
            label +
            "</span>";
        }
        if (params.data.type === "boolean") {
          let onOff =
            params.data.value === true ? "on text-teal-300" : "off opacity-50";
          html = formWrapper(
            params.data.id,
            label,
            "<i class='ml-2 fas fa-toggle-" + onOff + "'></i>"
          );
        }
        if (params.data.type === "string") {
          html = formWrapper(params.data.id, label, params.data.value);
        }
        if (params.data.type === "number") {
          html = formWrapper(
            params.data.id,
            label,
            params.data.value.toLocaleString(lang)
          );
        }
        if (params.data.type === "datetime") {
          const tempDate = new Date(params.data.value);
          let formattedDate = tempDate.toLocaleDateString(lang, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "numeric",
          });
          html = formWrapper(params.data.id, label, formattedDate);
        }
      }
      tempDiv.innerHTML = html;
      this.eGui = tempDiv.firstChild;
    };
    renderer.prototype.getGui = function () {
      return this.eGui;
    };
    renderer.prototype.refresh = function (params) {
      return true;
    };
    return renderer;
  }
  const dispatch = createEventDispatcher();
  export let privateStore;
  export let PUBLIC_AREA;
  export let publicStore;
  export let objectNodes;
  export let nodesStore;
  export let userStore;
  export let items = [];
  export let node;
  export let lang;
  let timer,
    patches = [],
    loading = false,
    ref,
    api,
    potentialParent = null,
    currentData = [],
    restoringExpandedNodes = false;
  let dialogSubject,
    parsedValue,
    searchDialogOpen,
    uploadDialogOpen,
    importContent,
    importValue;
  const cellClassRules = {
      "bg-teal-600": function (params) {
        return params.node === potentialParent;
      },
    },
    dataTypes = [
      { id: "object", label: "Object", icon: "fa-sitemap" },
      { id: "string", label: "String", icon: "fa-font" },
      { id: "translate", label: "Translatable Text", icon: "fa-globe" },
      { id: "number", label: "Number", icon: "fa-hashtag" },
      { id: "percent", label: "Percent", icon: "fa-percent" },
      { id: "currency", label: "Currency", icon: "fa-dollar-sign" },
      { id: "boolean", label: "Boolean", icon: "fa-toggle-off" },
      /*    { id: "date", label: "Date", icon: "fa-calendar-alt" },*/
      { id: "datetime", label: "Date & Time", icon: "fa-calendar-alt" },
      { id: "time", label: "Time", icon: "fa-clock" },
    ],
    getStore = (id) => {
      return $userStore
        ? id.indexOf($userStore.pub) === 0
          ? privateStore
          : publicStore
        : publicStore;
    },
    buildMenuItem = (item, n) => {
      if (n.id !== item.id && n.id.replaceAll(":", "/") !== item.id) {
        const parentPathParts = item.id.split("/");
        const o = {
          name: item.label || parentPathParts[parentPathParts.length - 1],
          icon: item.icon ? "<i class='fa " + item.icon + "'></i>" : undefined,
          action: () => {
            dispatch("contextClick", { node: n, item });
          },
        };
        const subMenus = $nodesStore
          .filter((d) => {
            const pathParts = d.id.split("/");
            return (
              d.id.indexOf(item.id) === 0 &&
              d.id.indexOf("/label") === -1 &&
              d.type === "object" &&
              pathParts.length === parentPathParts.length + 1
            );
          })
          .map((d) => {
            return buildMenuItem(d, n);
          });
        if (subMenus.length > 0) o.subMenu = subMenus;
        return o;
      }
    },
    importValueChange = (e) => {
      const d = e.detail;
      parsedValue = d;
      console.log(parsedValue);
    },
    importData = () => {
      if (parsedValue) {
        getStore(dialogSubject).update(dialogSubject, parsedValue);
        console.log(dialogSubject);
        searchDialogOpen = false;
      }
    },
    updateData = (data) => {
      clearInterval(timer);
      timer = setInterval(() => {
        if (api && node.id in objectNodes && "agGrid" in objectNodes[node.id]) {
          const deleteItems = currentData
            .filter(
              (d) =>
                data.findIndex((item) => item.id.indexOf(d.id) === 0) === -1
            )
            .map((d) => {
              return {
                id: d.id,
              };
            });
          const patch = {
            add: data.filter(
              (d) => currentData.findIndex((item) => item.id === d.id) === -1
            ),
            update: data.filter(
              (d) =>
                currentData.findIndex(
                  (item) => item.id === d.id && !isEqual(item, d)
                ) > -1 &&
                deleteItems.findIndex((item) => item.id === d.id) === -1
            ),
            remove: deleteItems,
          };
          if (
            patch.add.length + patch.update.length + patch.remove.length >
            0
          ) {
            currentData = [...data];
            api.applyTransactionAsync(patch, () => {
              //console.log("PATCHED");
              console.log(patch);
              api.redrawRows();
            });
          }
        }
      }, 200);
    },
    highlightRow = (overNode) => {
      var newPotentialParent;
      if (overNode && overNode.data) {
        newPotentialParent =
          overNode.data.type === "object"
            ? // if over a folder, we take the immediate row
              overNode
            : // if over a file, we take the parent row (which will be a folder)
              overNode.parent;
      } else {
        newPotentialParent = null;
      }
      let alreadySelected = potentialParent === newPotentialParent;
      if (alreadySelected) {
        return;
      }
      // we refresh the previous selection (if it exists) to clear
      // the highlighted and then the new selection.
      let rowsToRefresh = [];
      if (potentialParent) {
        rowsToRefresh.push(potentialParent);
      }
      if (newPotentialParent) {
        rowsToRefresh.push(newPotentialParent);
      }
      potentialParent = newPotentialParent;
      const params = {
        // refresh these rows only.
        rowNodes: rowsToRefresh,
        // because the grid does change detection, the refresh
        // will not happen because the underlying value has not
        // changed. to get around this, we force the refresh,
        // which skips change detection.
        force: true,
      };
      api.refreshCells(params);
    },
    getExpandedDetails = (n, expandedDetails = "") => {
      if (n.group && n.uiLevel >= 0) {
        if (expandedDetails === "") {
          expandedDetails = n.key;
        } else {
          expandedDetails += "&" + n.key;
        }
        return getExpandedDetails(n.parent, expandedDetails);
      }
      return expandedDetails;
    };
  let columnDefs = [];
  if (!node.disableRemove)
    columnDefs.push({
      field: "id",
      headerName: "",
      cellClassRules: cellClassRules,
      cellRenderer: "removeButtonRenderer",
      cellRendererParams: {
        clicked: function (params) {
          const nodeId = params.value ? params.value : params.node.key;
          dispatch("remove", { id: nodeId });
          /*
            api.applyTransactionAsync({ remove: [{ id: nodeId }] }, () => {
              dispatch("remove", { id: nodeId });
            });
            */
        },
      },
      maxWidth: 35,
      headerClass: "text-center",
      cellStyle: {
        textAlign: "center",
      },
    });
  if (!node.disableAdd)
    columnDefs.push({
      field: "id",
      headerName: "",
      cellClassRules: cellClassRules,
      cellRenderer: "addButtonRenderer",
      cellRendererParams: {
        clicked: function (params) {
          const nodeId = params.value ? params.value : params.node.key;
          dispatch("add", { id: nodeId });
        },
      },
      maxWidth: 35,
      headerClass: "text-center",
      cellStyle: {
        textAlign: "center",
      },
    });
  const options = {
    animateRows: true,
    enableGroupEdit: node.disableGroupEdit,
    excludeChildrenWhenTreeDataFiltering: true,
    groupDefaultExpanded: node.groupDefaultExpanded,
    groupDisplayType: "singleColumn",
    headerHeight: 0,
    rowSelection: "single",
    stopEditingWhenCellsLoseFocus: true,
    suppressCellSelection: true,
    treeData: true,
    defaultColDef: {
      flex: 1,
      resizable: false,
      suppressMenu: true,
    },
    components: {
      addButtonRenderer: AddButtonCellRenderer,
      removeButtonRenderer: DeleteButtonCellRenderer,
      groupCellRenderer: getGroupRenderer(),
      numberCellEditor: NumericEditor(),
      booleanCellEditor: BooleanEditor(),
      stringCellEditor: TextEditor(),
      objectCellEditor: ObjectEditor(),
    },
    autoGroupColumnDef: {
      rowDrag: (params) => {
        if (node.disableRowDrag) return false;
        /*
        const parentPathParts = node.source.split("/");
        if (params.data?.id) {
          const pathParts = params.data.id.split("/");
          let arr;
          if (parentPathParts.length > 1) {
            arr = pathParts.slice(
              parentPathParts.length - (node.hideRoot === true ? 0 : 1)
            );
          } else {
            arr = pathParts;
          }
          return params.data.type === "object" && arr.length > 1;
        }
        */
      },
      valueGetter: (params) => {
        return params.data?.type === "object"
          ? params.data.id
          : params.data?.value;
      },
      valueSetter: (params) => {
        params.data.value = params.newValue;
      },
      headerName: "",
      editable: !node.disableGroupEdit,
      filter: false,
      floatingFilter: false,
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: "groupCellRenderer",
        changed: function (params) {
          //console.log(params)
          console.log("CHANGED!!!");
          api.redrawRows({ rowNodes: [params.node] });
        },
      },
      cellClassRules: cellClassRules,
      cellEditorSelector: (params) => {
        return { component: params.data.type + "CellEditor" };
      },
    },
    isExternalFilterPresent: () => {
      return true;
    },
    doesExternalFilterPass: (params) => {
      return (
        params.data.isHidden !== true && params.data.id.indexOf("/label") === -1
      );
    },
    getContextMenuItems: (params) => {
      const type = params.node.data.type;
      const nodeId = params.node.data.id || params.value;
      dialogSubject = nodeId;
      const path = nodeId.split("/");
      const end = path.pop();
      const isPredicate = end.indexOf(":") > -1;
      const result = [
        "copy",
        {
          name: "Remove",
          action: function () {
            // getStore(nodeId).delete(nodeId);
          },
          icon: "<i class='fa fa-trash'></i>",
        },
      ];
      if (type === "object") {
        const types = {
          name: "Add empty...",
          icon: "<i class='fa fa-plus'></i>",
          subMenu: [],
        };
        dataTypes.forEach((d) => {
          types.subMenu.push({
            name: d.label,
            action: () => {
              const newId = nanoid(11);
              const now = new Date();
              let v;
              if (d.id === "object") {
                v = {};
              } else if (d.id === "string") {
                v = "Sample text";
              } else if (d.id === "translate") {
                v = {};
                v[lang] = "Translatable text";
              } else if (d.id === "number") {
                v = 0;
              } else if (d.id === "percent") {
                v = 0;
              } else if (d.id === "currency") {
                v = 0;
              } else if (d.id === "boolean") {
                v = false;
              } else if (d.id === "datetime") {
                v = now.getTime();
              } else if (d.id === "time") {
                v = now.getTime();
              } else {
              }
              getStore(nodeId).create(nodeId + "/" + newId, v);
            },
            icon: "<i class='fa " + d.icon + "'></i>",
          });
        });
        result.unshift(types);
        if (node.events.rowClick) {
          result.unshift({
            name: "Navigate to...",
            icon: "<i class='fa fa-link'></i>",
            action: () => {
              // dispatch("navigateTo", { path: nodeId });
              dispatch("nodeEvent", {
                type: "click",
                events: node.events.click,
                path: nodeId,
              });
              dispatch("nodeEvent", {
                type: "click",
                path: nodeId,
              });
            },
          });
        }
        result.unshift({
          name: "Import...",
          icon: "<i class='fa fa-upload'></i>",
          action: () => {
            console.log("pop import!");
            uploadDialogOpen = true;
          },
        });
        /*
        result.unshift({
          name: "New relationship...",
          icon: "<i class='fa fa-search'></i>",
          action: () => {
            searchDialogOpen = true;
          },
        });
        let insetMenu = {
          name: "Add relationship...",
          icon: "<i class='fa fa-plus'></i>",
          subMenu: [],
        };
        */
        const itm1 = buildMenuItem(
          {
            id: PUBLIC_AREA,
            label: "Insert Public...",
            icon: "fa-plus",
          },
          params.node.data
        );
        const itm2 = buildMenuItem(
          {
            id: $userStore.pub,
            label: "Insert Private...",
            icon: "fa-lock",
          },
          params.node.data
        );
        //insetMenu.subMenu.push(itm1);
        //insetMenu.subMenu.push(itm2);
        result.unshift(itm2);
        result.unshift(itm1);
        // result.unshift(buildMenuItem(PUBLIC_AREA));
      }
      return result;
    },
    getDataPath: (params) => {
      /*
      const parentPathParts = node.source.split("/");
      const pathParts = params.id.split("/");
      return pathParts.slice(parentPathParts.length - 1, pathParts.length);
      */
      return params.id.split("/");
      /*
      if (parentPathParts.length > 1) {
        return pathParts.slice(node.hideRoot === true ? 0 : 1);
      } else {
        return pathParts;
      }
*/
    },
    getRowNodeId: (params) => {
      return params.id;
    },
    onSelectionChanged: () => {
      const selectedRows = api.getSelectedRows();
      dispatch("select", selectedRows);
    },
    onGridReady: (params) => {
      api = params.api;
      /*
      node.dataSources.forEach((graph) => {
        let store = getStore(graph);
        api.applyTransactionAsync({
          add: [
            {
              id: graph,
              type: "object",
              path: [graph],
            },
          ],
        });
        homeViewSubscriptions[graph] = store
          .read()
          .map()
          .on((d, k) => displayRow(d, k, store, graph));
      });
      */
      let tileContainer = document.querySelector(".tile-container"),
        dropZone = {
          getContainer: function () {
            return tileContainer;
          },
          onDragStop: function (params) {
            console.log(params.node.data);
            //var tile = createTile(params.node.data);
            //tileContainer.appendChild(tile);
          },
        };
      // api.addRowDropZone(dropZone);
      Object.keys(objectNodes).forEach((graph) => {
        if (objectNodes[graph].agGrid && node.id !== graph) {
          const dropZone =
            objectNodes[graph].agGrid.gridOptions.api.getRowDropZoneParams();
          api.addRowDropZone(dropZone);
        }
      });
      if (loading) api.showLoadingOverlay();
    },
    onFirstDataRendered: (params) => {
      let groupStorage = JSON.parse(localStorage.getItem(node.id + ":ag-grid"));
      // console.log("onFirstDataRendered: expanded nodes", groupStorage);
      if (groupStorage) {
        restoringExpandedNodes = true;
        params.api.forEachNode((node) => {
          if (node.group) {
            let expandedDetails = getExpandedDetails(node);
            let ind = groupStorage.findIndex(
              (storageItem) => storageItem === expandedDetails
            );
            if (ind !== -1) {
              node.setExpanded(true);
            }
          }
        });
        setTimeout(() => (restoringExpandedNodes = false), 0);
      }
    },
    onRowClicked: (params) => {
      if (params.data?.type === "object") {
        //console.log(params.data);
        dispatch("nodeEvent", params.data);
        /*
        dispatch("click", {
          id: params.data.id,
          state: { expanded: !params.node.expanded },
        });
        */
        // params.node.setExpanded(!params.node.expanded);
      }
    },
    onRowDragEnd: (params) => {
      if (!potentialParent) {
        api.clearFocusedCell();
        highlightRow(null);
        return;
      } else {
        const fromRow = params.node.data;
        const toRow = potentialParent.data;
        const fromPath = fromRow.id.split("/");
        const fromPathId = fromPath.pop();
        if (fromRow.id !== toRow.id && fromPath.join("/") !== toRow.id) {
          dispatch("move", {
            from: fromRow.id,
            to: toRow.id,
          });
        }
        api.clearFocusedCell();
        highlightRow(null);
        return true;
      }
    },
    onRowDragMove: (params) => {
      dispatch("dragging", {});
      highlightRow(params.overNode);
    },
    onRowDragLeave: (params) => {
      highlightRow(null);
    },
    onRowGroupOpened: (params) => {
      if (restoringExpandedNodes) {
        return;
      }
      let expandedNodeDetails = [];
      params.api.forEachNode((node) => {
        if (node.group && node.expanded) {
          let expandedDetails = getExpandedDetails(node);
          expandedNodeDetails.push(expandedDetails);
        }
      });
      // console.log("expandedNodeDetails are now", expandedNodeDetails);
      localStorage.setItem(
        node.id + ":ag-grid",
        JSON.stringify(expandedNodeDetails)
      );
    },
    onCellClicked: (params) => {
      //console.log(params);
      //console.log(getExpandedDetails(params.node));
    },
    onCellValueChanged: (params) => {
      dispatch("nodeEvent", {
        type: "valueChange",
        events: node.events.valueChange,
        path:
          params.data.type === "object"
            ? params.data.id + "/label/" + lang
            : params.data.id,
        value: params.data.value,
      });
      return true;
    },
  };
  onMount(() => {
    if (!("agGrid" in objectNodes[node.id])) {
      objectNodes[node.id].agGrid = new Grid(ref, {
        ...options,
        columnDefs,
      });
      //console.log(items);
    }
  });
  onDestroy(() => {
    if (node.id in objectNodes && objectNodes[node.id].agGrid) {
      objectNodes[node.id].agGrid.destroy();
      delete objectNodes[node.id].agGrid;
    }
  });
  const filterKeys = [
    "label",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "pub",
    "epub",
    "auth",
    "isLoggedIn",
    "lastLoginAt",
    "alias",
  ];
  $: rowData = items.map((d) => {
    const pathParts = d.id.split("/");
    const end = pathParts.pop();
    if (d.id === node.id) {
      d.disableDelete = true;
    }
    // d.isHidden = d.id.indexOf("/label/") > -1 || filterKeys.indexOf(end) > -1;
    return d;
  });
  $: updateData(rowData);
</script>

<svelte:head>
  <link
    href="/node_modules/ag-grid-enterprise/dist/styles/ag-theme-balham{$privateStore.theme ===
    'dark'
      ? '-dark'
      : ''}.css"
    rel="stylesheet"
    type="text/css"
  />
</svelte:head>
<div
  bind:this={ref}
  class="h-full container ag-theme-balham{$privateStore.theme === 'dark'
    ? '-dark'
    : ''}"
/>

<!--
<Dialog class="pa-4 text-center" bind:active={searchDialogOpen}>
  <AddStatement
    dataSources={[PUBLIC_AREA, $userStore.pub]}
    subject={dialogSubject}
    on:createPredicate
    on:createObject
  />
</Dialog>
<Dialog class="pa-4 text-center" bind:active={uploadDialogOpen}>
  <UiNode
    {privateStore}
    {publicStore}
    {user}
    {lang}
    data={{
      key: "Paste JSON Object",
      type: "json",
      value: { kkk: "ppp" },
    }}
    on:valueChange={importValueChange}
  />
  <Button class="pink white-text" on:click={importData}
    >Import <i class="ml-2 fa fa-plus" /></Button
  >
</Dialog>
-->
<style>
  .ag-header-cell.text-center .ag-header-cell-label {
    justify-content: center;
  }
  :global(.ag-root-wrapper) {
    border: none !important;
  }
  :global(.ag-overlay-loading-center) {
    border: none !important;
  }
  :global(.ag-popup-editor label) {
    font-weight: bold;
  }
  :global(.ag-popup-editor input) {
    border: solid 1px rgba(0, 0, 0, 0.2);
    user-select: text;
  }
  :global(.ag-popup-editor input:hover) {
    border: solid 1px rgba(0, 0, 0, 0.4);
  }
</style>
