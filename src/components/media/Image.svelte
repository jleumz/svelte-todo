<script lang="ts">
	export let src;
	export let alt;
	export let description;
</script>

<div class="container">
	<img {src} {alt} />
	<div class="description">
		<p>{description}</p>
	</div>
</div>

<style>
	.container {
		width: 100%;
		position: relative;
	}

	.container:hover img {
		opacity: 0.3;
	}

	.container:hover .description {
		opacity: 0.8;
	}

	.description {
		position: absolute;
		opacity: 0;
		top: 50%;
		left: 50%;
		text-align: center;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
	}

	.description p {
		font-size: 1.5em;
		font-family: fantasy;
	}

	img {
		width: 100%;
		opacity: 1;
		transition: 0.5 ease;
		backface-visibility: hidden;
		box-sizing: border-box;
		height: fit-content;
		border-radius: 50px;
		border-style: ridge;
		border-width: 0.5em;
		border-color: tomato;
	}
</style>
