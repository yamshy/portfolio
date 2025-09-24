declare module '*.astro' {
  const component: import('astro/runtime/server/render/index.js').AstroComponentFactory;
  export default component;
}
