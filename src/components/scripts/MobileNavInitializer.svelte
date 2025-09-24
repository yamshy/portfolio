<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import initMobileNav from '../../scripts/initMobileNav';

  let cleanup: ReturnType<typeof initMobileNav>;

  onMount(() => {
    cleanup = initMobileNav();
  });

  onDestroy(() => {
    cleanup?.();
    cleanup = undefined;
  });
</script>
