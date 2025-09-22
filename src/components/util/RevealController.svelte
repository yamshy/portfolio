<script lang="ts">
  import { onMount } from 'svelte';
  import { initReveal } from '../../scripts/initReveal';

  export let threshold = 0;
  export let rootMargin: string | undefined;

  onMount(() => {
    const runReveal = () => initReveal({ threshold, rootMargin });

    const handlePageLoad = () => runReveal();

    runReveal();
    document.addEventListener('astro:page-load', handlePageLoad);
    document.addEventListener(
      'astro:before-swap',
      () =>
        document.removeEventListener('astro:page-load', handlePageLoad),
      { once: true },
    );

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  });
</script>
