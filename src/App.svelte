<script lang="ts">
	import { Router, Link, Route } from "svelte-navigator";
	import Drawing from "./routes/Drawing.svelte";
	import Doc from "./routes/Doc.svelte";
	import Tutorial from "./routes/Tutorial.svelte";
	export let name: string;
</script>

<main>
	<!-- TODO: add links/anchor for each section for deeplinks -->
	<Router>
		<nav>
			<Link to="/">Home</Link>
			<span>|</span>
			<Link to="drawing">Drawing</Link>
			<span>|</span>
			<Link to="rebase">Rebase</Link>
		</nav>
		<div>
			<Route path="/">
				<Tutorial />
			</Route>
			<Route path="drawing">
				<Drawing />
			</Route>
			<Route path="rebase">
				<Doc />
			</Route>
		</div>
	</Router>
</main>

<style>
	main {
		text-align: center;
		/* max-width: 250px; */
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
