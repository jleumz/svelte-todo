<script lang="ts">
	import { onMount } from "svelte";

	let photos = [];
	onMount(async () => {
		const res = await fetch(
			"https://jsonplaceholder.typicode.com/photos?_limit=50"
		);
		photos = await res.json();
	});
</script>

<h2>Fetch Photos</h2>

<div class="photos">
	{#each photos as photo}
		<figure>
			<img src={photo.thumbnailUrl} alt={photo.title} />
			<figcaption>{photo.title}</figcaption>
		</figure>
	{:else}
		<p>...loading</p>
	{/each}
</div>

<style>
	.photos {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 5px;
	}

	figure,
	img {
		width: 100%;
		margin: 0;
	}
</style>
