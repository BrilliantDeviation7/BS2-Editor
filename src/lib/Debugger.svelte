<script>
	import { onMount } from 'svelte';

	import { Play, Pause, Power } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	import { accessControl } from '$lib/stores';
	export let port;

	let debugText = '';
	let reader = null;

	onMount(() => {
		return () => {
			stopListening();
		};
	});

	$: {
		if ($accessControl === 4) {
			beginListening();
		}

		// TODO: separate into their separate reactive blocks (move async function outside)
		// then rearrange order
		// https://stackoverflow.com/a/63977760

		// TODO: combine with first if block using "else if"
		if ($accessControl === 1 || $accessControl === 5) {
			stopListening();
		}

		async function beginListening() {
			try {
				const treader = port.readable.getReader();

				await treader.cancel();
				await treader.releaseLock();
				reader = port.readable.getReader();
			} catch (error) {
				console.log(error);
				toast.error('Cannot read from device');
				reader = null;
				$accessControl = 0;
			}
		}
	}

	function stopListening() {
		if (reader) {
			reader.cancel();
			reader.releaseLock();
		}
		reader = null;
		if ($accessControl === 1) $accessControl = 3;
		if ($accessControl === 5) $accessControl = 0;
	}

	let readingInterval = null;

	$: if ($accessControl === 4 && reader) {
		readingInterval = setInterval(readFromStream, 100);
	} else {
		clearInterval(readingInterval);
	}

	async function readFromStream() {
		const { done, value } = await reader.read();
		if (done) {
			await stopListening();
			return;
		}
		debugText = debugText.concat(new TextDecoder().decode(value));
	}

	function handleDebugClick() {
		if ($accessControl === 0) {
			$accessControl = 4;
		} else if ($accessControl === 4) {
			$accessControl = 5;
		}
	}

	function getStatusColor(status) {
		switch (status) {
			case 0:
			case 3:
				return 'text-red-500';
			case 4:
			case 5:
				return 'text-green-500';
			default:
				return 'text-yellow-500';
		}
	}

	function clearTerminal() {
		debugText = '';
	}
</script>

<div class="flex grow flex-col justify-center overflow-hidden">
	<div class="flex justify-end gap-1 pt-2 md:pt-0">
		<Button class="select-none" on:click={handleDebugClick} variant="outline">
			<Power class="-ml-1 mr-2 {getStatusColor($accessControl)}" />
			Debug Terminal
		</Button>
		<Button class="select-none" on:click={clearTerminal} variant="ghost">Clear</Button>
	</div>
	<div
		class="mt-2 h-full overflow-y-scroll rounded-md border bg-stone-100 px-2 py-1 font-mono text-sm dark:bg-background"
	>
		{#each debugText.split('\r') as line, index}
			<p key={index}>&gt; {line}</p>
		{/each}
	</div>
</div>
