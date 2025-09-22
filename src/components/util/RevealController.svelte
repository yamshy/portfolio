<script lang="ts">
  import { onMount } from 'svelte';
  import { initReveal } from '../../scripts/initReveal';

  export let threshold = 0;
  export let rootMargin: string | undefined;

  onMount(() => {
    const runReveal = () => initReveal({ threshold, rootMargin });

    runReveal();

    const handlePageLoad = () => runReveal();
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  });
</script>
