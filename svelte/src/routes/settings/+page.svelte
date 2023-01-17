<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import Form from "$lib/components/Form.svelte";
  import sharedStore from "$lib/store/store";
</script>

<div class="container mx-auto p-8 space-y-8 flex flex-col">
  {#if $sharedStore.initializated}
    <Form/>
  {/if}
</div>

