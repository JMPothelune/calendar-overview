<script lang="ts">
	import EventView from '$lib/components/calendar/EventView.svelte';
	import { calendarEventsStore } from '$lib/store/stores';

  $: pastEvents = $calendarEventsStore.events.filter(event => event.end < new Date());
  $: upcomingEvents = $calendarEventsStore.events.filter(event => event.start > new Date());
  $: currentEvents = $calendarEventsStore.events.filter(event => event.start < new Date() && event.end > new Date());

</script>

<div class="flex flex-col overflow-y-auto w-full items-stretch">

  {#if pastEvents.length > 0}
    <h2 class="text-sm font-semibold my-1">
    </h2>
    <div class="flex flex-col space-y-2 opacity-30">
      {#each pastEvents as event}
        <EventView event={event} />
      {/each}
    </div>
  {/if}

  {#if currentEvents.length > 0}
    <h2 class="text-sm font-semibold my-2">
      <!-- <hr /> -->
    </h2>
    <div class="flex flex-col space-y-2">
      {#each currentEvents as event}
        <EventView event={event} />
      {/each}
    </div>
  {/if}

  {#if upcomingEvents.length > 0}
    <h2 class="text-sm font-semibold my-2">
      <!-- <hr /> -->
    </h2>
    <div class="flex flex-col space-y-2 opacity-60">
      {#each upcomingEvents as event}
        <EventView event={event} />
      {/each}
    </div>
  {/if}
</div>