<script lang="ts">
    export let columns = [];
    export let rows = [];
    export let ariaLabel;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const linkClick = (link) => {
        dispatch("linkClick", { uri: link });
        console.log(link);
    };
</script>

<table aria-label={ariaLabel ? ariaLabel : undefined}>
    <thead>
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each rows as row}
            <tr>
                {#each columns as column}
                    <td>
                        {#if row[column].type === "uri"}
                            <button on:click={linkClick(row[column].value)}
                                >{row[column].value}</button
                            >
                        {:else}
                            {row[column].value}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
