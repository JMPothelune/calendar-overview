<script lang="ts">
	import CalendarSourcesList from '$lib/components/settings/CalendarSourcesList.svelte';
import '@skeletonlabs/skeleton/themes/theme-crimson.css';

</script>

<div class="container mx-auto p-8 space-y-8 flex flex-col">
  <h2>Sources</h2>
  <hr />
  <CalendarSourcesList />
  <hr />
</div>

