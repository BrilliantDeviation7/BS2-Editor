<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
</script>

<ScrollArea class="h-full w-48 rounded-md border">
	<h4
		class="sticky top-0 w-full p-2.5 font-bold leading-none shadow-lg shadow-stone-400/10 backdrop-blur-md"
	>
		Files
	</h4>
	{#each tags as tag}
		<Separator />
		<a href="/" class="block p-2 text-sm transition-colors duration-100 hover:bg-[#2a2d2e]">
			{tag}
		</a>
	{/each}
</ScrollArea>

<!-- TODO: switch to SVelteKit for SPA to use links to go to specific file -->
