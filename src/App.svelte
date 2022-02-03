<script lang="ts">
	import Reactivity from "./Reactivity.svelte";
	import TodoList from "./components/Todo/TodoList.svelte";
	import EventListener from "./components/EventListener.svelte";
	import Directives from "./components/Directives.svelte";
	import Transitions from "./Transitions.svelte";
	import Animation from "./components/Animation.svelte";
	import GrandParent from "./components/events/GrandParent.svelte";
	import DomEventParent from "./components/events/DomEventParent.svelte";

	export let name: string;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>
		Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
		how to build Svelte apps.
	</p>
	<!-- TODO: add links/anchor for each section for deeplinks -->
	<section>
		<h1>Introduction</h1>
	</section>
	<section>
		<h1>Todo application</h1>
		<TodoList />
	</section>
	<section>
		<h1>Reactivity</h1>
		<Reactivity />
	</section>
	<section>
		<h1>Event Listener</h1>
		<EventListener />
	</section>
	<section>
		<h1>Directives</h1>
		<Directives />
	</section>
	<section>
		<h1>Transitions</h1>
		<Transitions />
	</section>
	<section>
		<h1>Animations</h1>
		<Animation />
	</section>
	<section>
		<h1>Event forwarding</h1>
		<GrandParent />
	</section>
	<section>
		<h1>DOM event</h1>
		<DomEventParent />
	</section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 250px;
		margin: 0 auto;
	}

	section {
		width: 100%;
		height: auto;
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
