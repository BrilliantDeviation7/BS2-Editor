<script>
	import { onMount } from 'svelte';

	import Cog from 'lucide-svelte/icons/cog';
	import ArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	import pbasic from 'pbasic-tokenizer';
	import Flasher from './flasher';

	import { accessControl, code } from '$lib/stores';
	export let port;

	function beginCompile() {
		if ($accessControl === 0) {
			$accessControl = 3;
		} else {
			$accessControl = 1;
		}
	}

	function endCompile() {
		$accessControl = 2;
	}

	import hotkeys from '$lib/hotkeysFilter';

	onMount(() => {
		hotkeys('ctrl+r', () => {
			beginCompile();
			return false;
		});
	});

	async function doCompile() {
		const compiled = pbasic.compile($code, false);

		if (compiled.Succeeded === true) {
			const flasher = new Flasher(port);
			let flashPromise = new Promise((resolve, reject) => {
				flasher.flash(compiled).then(() => {
					resolve();
				});
			});
			let timeout = new Promise((resolve, reject) => {
				let id = setTimeout(async () => {
					clearTimeout(id);
					reject();
				}, 3000);
			});
			let race = Promise.race([flashPromise, timeout]);
			race.then(() => {
				endCompile();
				toast.success('Flashed code successfully!');
			});
			race.catch(async (error) => {
				toast.error('Timed out. Make sure the board is on and plugged in.');
				await flasher.cancel();
				$accessControl = 0;
			});
		} else {
			toast.error(`Error: ${compiled.Error.message}`);
			$accessControl = 0;
		}
	}

	$: if ($accessControl === 3) {
		doCompile();
	} else if ($accessControl === 2) {
		$accessControl = 4;
	}
</script>

<Button class="select-none" on:click={beginCompile}>
	{#if $accessControl === 3}
		<Cog class="-ml-1 mr-2 animate-spin" /> Compiling...
	{:else}
		<ArrowUpToLine class="-ml-1 mr-2" /> Compile and Flash
	{/if}
</Button>
