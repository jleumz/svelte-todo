<script lang="ts">
	import ReactivityChild from "./ReactivityChild.svelte";

	let firstName = "";
	let lastName = "";
	let reactivityChild = {
		name: "Svelte",
		version: "3.0",
		age: 2,
	};

	$: fullName = `${firstName} ${lastName}`;

	// run function if some value has changed
	$: {
		console.log(`${fullName} has changed`);
	}

	$: if (fullName.length > 16) {
		console.log("$$$$$$ Fullname has reached maximal limit $$$$$$$$");
	}
</script>

<article>
	<h2>Arrays</h2>
	<p>
		In <b>Svelte</b> reactivity is triggered by assignments. Array/List methods like
		push, pop, slice does not rerender the component. You need to reassign the value.
		The best way to do it is through the spread syntax. The name of the updated value
		must appear on the left hand side of the assignment.
	</p>
	<h3>For example</h3>
	<ul>
		<li>
			<p>valueList = [...valueList, newValue] // push</p>
		</li>
		<li>
			<p>valueList = valueList.filter((item) => item != compareItem) // pop</p>
		</li>
	</ul>
	<ReactivityChild {...reactivityChild} />
</article>
<input bind:value={firstName} type="text" placeholder="Firstname" />
<input bind:value={lastName} type="text" placeholder="Lastname" />
<p>{fullName}</p>

<style>
	li {
		list-style: none;
	}
</style>
