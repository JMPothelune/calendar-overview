<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-crimson.css';
  import sharedStore from "$lib/store/store";
  $: settings = $sharedStore.calendarSettings;
  $: events = $sharedStore.calendarEvents;

  import { storePrefersDarkScheme, storeLightSwitch } from '@skeletonlabs/skeleton';
	import { tick } from 'svelte';
	import EventView from '$lib/components/EventView.svelte';

  $:{
    storePrefersDarkScheme.set(!settings.isLightMode);
    storeLightSwitch.set(!settings.isLightMode);
    tick().then(() => {
      setElemHtmlClass();
    });
  
  }
  
	// Toggles a 'dark' class on the <html> element
	function setElemHtmlClass(): void {
		const elemHtmlClassList = document.documentElement.classList;
		// Update HTML element class
		$storeLightSwitch ? elemHtmlClassList.add('dark') : elemHtmlClassList.remove('dark');
	}

</script>

<main style="-webkit-app-region: drag" class="min-h-full select-none p-2">

  <div class="flex flex-col space-y-2">
      
    {#each  events as event}
      <EventView event={event} />
    {/each}
    
  </div>
</main>
