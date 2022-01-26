<script lang="ts"></script>

<h1>Animations</h1>
<p>Fly in</p>

<style>
	@keyframes testAnimation {
		from {
			color: blue;
		}
		to {
			color: red;
		}
	}

	@keyframes slideIn {
		from {
			margin-left: 100%;
			width: 300%;
		}

		to {
			margin-left: 0;
			width: 100%;
		}
	}

	h1 {
		animation: testAnimation 4s ease 50ms 2 normal;
	}

	p {
		animation-duration: 2s;
		animation-timing-function: ease;
		animation-name: slideIn;
		animation-iteration-count: 1;
	}
</style>
