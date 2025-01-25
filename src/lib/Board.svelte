<script>
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import Compiler from './Compiler.svelte';
	import Debugger from './Debugger.svelte';

	export let highlightError;

	let serial;
	let port = null;

	onMount(() => {
		tryAutoConnect();

		const handleUsbConnect = async (event) => {
			try {
				const reader = await port.readable.getReader();
				await reader.releaseLock();
			} catch (error) {
				try {
					if (port) {
						await port.close();
					}
					const ports = await navigator.serial.getPorts();
					if (ports.length > 0) {
						port = ports[0];
					} else {
						port = 0;
					}
				} catch (error) {
					console.log(error);
				}
			}
			if (!port) {
				const ports = await navigator.serial.getPorts();
				// Do something with the ports
			}
		};

		const handleUsbDisconnect = async (event) => {
			await port.close();
			port = false;
			// TODO: change this to null, not false
		};

		if (navigator.serial) {
			navigator.serial.addEventListener('connect', handleUsbConnect);
			navigator.serial.addEventListener('disconnect', handleUsbDisconnect);

			return () => {
				navigator.serial.removeEventListener('connect', handleUsbConnect);
				navigator.serial.removeEventListener('disconnect', handleUsbDisconnect);
			};
		}
	});

	async function connect() {
		port = await navigator.serial.requestPort({
			// filters: [{ usbVendorId: '1027' }]
		});
	}

	// access state controller key
	// 0: currently not in use, open to anyone
	// 1: compiler awaiting and requesting reader access
	// 2: debugger awaiting and requesting reader access
	// 3: locked to compiler and not being awaited
	// 4: locked to debugger and not being awaited
	// 5: awaiting debugger to be disabled but not awaited by compiler
	// reader and writer permissions are both attached to the same state
	// this means debug technically has writer permissions in state,
	// although it does not utilize them

	import { accessControl } from '$lib/stores';

	async function disconnect() {
		if ($accessControl !== 0) {
			alert(
				'BS2 Editor is currently using the port. Make sure to turn off the terminal and finish compiling before disconnecting the device.'
			);
		} else {
			await port.close();
			port = false;
		}
	}

	$: awaitOpen() && port;

	let openingPort = false;
	async function awaitOpen() {
		if (openingPort) return;
		if (port && !port?.readable && !port?.writable) {
			openingPort = true;
			await port.open({ baudRate: 9600 });
			openingPort = false;
			if (port.readable === null) {
				alert('Could not open port!');
				port = null;
			}
		}
	}

	async function tryAutoConnect() {
		try {
			if (port !== false) {
				const ports = await navigator.serial.getPorts();
				const filtered = ports.filter((p) => p.getInfo().usbVendorId === 1027);
				port = filtered[0];
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if navigator.serial}
	{#if port}
		<div class="flex gap-1 md:absolute">
			<Button variant="destructive" class="select-none" on:click={disconnect}>Disconnect</Button>
			<Compiler bind:port {highlightError} />
		</div>

		<Debugger bind:port />
	{:else}
		<div class="flex h-full items-center justify-center">
			<Button class="w-1/2" on:click={connect}>Connect</Button>
		</div>
	{/if}
{:else}
	<p>
		This browser doesn't support the Web Serial API, so you won't be able to compile and flash code.
		You can still edit and save files.
	</p>
{/if}
