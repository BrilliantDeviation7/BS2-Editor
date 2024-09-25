<script>
	import './app.css';
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import Counter from './lib/Counter.svelte';
	import { onMount } from 'svelte';
	import LineBreakTransformer from './lib/LineBreakTransformer';
	import Navbar from '$lib/Navbar.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import Editor from '$lib/editor/Editor.svelte';

	onMount(() => {
		if ('serial' in navigator) {
			console.log('Web SERIAL API supported!');
		} else {
			console.log('not supported');
		}
	});

	let port = null;

	async function choosePort() {
		if ('serial' in navigator) {
			try {
				port = await navigator.serial.requestPort();
				console.log(port);

				await port.open({
					baudRate: 9600
				});

				const textDecoder = new TextDecoderStream();
				const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
				const reader = textDecoder.readable
					.pipeThrough(new TransformStream(new LineBreakTransformer()))
					.getReader();

				// Listen to data coming from the serial device.
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						// Allow the serial port to be closed later.
						reader.releaseLock();
						break;
					}
					// value is a string.
					console.log(value);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	async function closePort() {}
</script>

<div class="flex h-screen flex-col gap-3 p-3">
	<Navbar />

	<main class="flex min-h-0 grow gap-3">
		<Sidebar />
		<Editor />

		<!-- {#if port}
			<button on:click={closePort}>CLOSE PORT</button>
		{:else}
			<button on:click={choosePort}>Choose port</button>
		{/if} -->
	</main>
</div>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.read-the-docs {
		color: #888;
	}
</style>
