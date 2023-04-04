<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import { Grid } from "ag-grid-community";
    import "ag-grid-enterprise";
    import "ag-grid-enterprise/dist/styles/ag-grid.css";

    const dispatch = createEventDispatcher();

    export let settingsStore;
    export let columnDefs;
    export let data;
    export let loading = false;
    export let height = 130;

    export let options = {
        defaultColDef: {
            flex: 1,
            minWidth: 150,
            filter: true,
        },
        suppressFieldDotNotation: true,
        rowSelection: "multiple",
    };

    let ref, grid, api;

    $: theme = $settingsStore?.dark
        ? "ag-theme-balham-dark"
        : "ag-theme-balham";
    $: themeUrl =
        "/node_modules/ag-grid-community/dist/styles/" + theme + ".min.css";

    const onSelectionChanged = () => {
            const selectedRows = api.getSelectedRows();
            dispatch("select", selectedRows);
        },
        onCellValueChanged = (e) => {
            data[e.rowIndex] = e.data;
            dispatch("update", { row: e.rowIndex, data: e.data });
        },
        onGridReady = () => {
            api = grid.gridOptions.api;
            if (loading) api.showLoadingOverlay();
        },
        updateData = (data) => {
            if (grid && api) {
                api.setRowData(data);
                api.setColumnDefs(columnDefs);
            }
        };

    onMount(() => {
        grid = new Grid(ref, {
            ...options,
            columnDefs,
            rowData: data,
            onGridReady,
            onCellValueChanged,
            onSelectionChanged,
        });
    });

    onDestroy(() => {
        if (grid) grid.destroy();
    });

    $: updateData(data);
</script>

<svelte:head>
    <link rel="stylesheet" href={themeUrl} />
</svelte:head>

<div class="container w-full" style={"height: " + height + "px"}>
    <div bind:this={ref} class="w-full h-full {theme}" />
</div>
