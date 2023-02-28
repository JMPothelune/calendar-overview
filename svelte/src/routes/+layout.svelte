<script lang="ts">
	import '@skeletonlabs/skeleton/styles/all.css';
	import { AppShell, Modal } from '@skeletonlabs/skeleton';
</script>

<Modal />
<AppShell class="min-h-screen">
	<slot />
</AppShell>