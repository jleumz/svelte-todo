<script lang="ts">
    export let name: string = "";
    export let handleRemove: Function;
</script>

<li>
    <div class="item">
        <p>{name}</p>
        <button on:click={() => handleRemove(name)}>X</button>
    </div>
</li>

<style>
    p {
        margin-right: 0.5rem;
    }
    .item {
        display: inline-flex;
        flex-direction: row;
        align-items: baseline;
    }

    button {
        border-radius: 2rem;
        background-color: red;
        padding-right: 1rem;
        padding-left: 1rem;
        height: fit-content;
        color: white;
        cursor: pointer;
    }
</style>
