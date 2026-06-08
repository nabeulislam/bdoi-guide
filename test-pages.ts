import { getAllPages } from './src/lib/content';
const tracks = getAllPages();
tracks.forEach(t => {
  console.log(t.track);
  t.pages.forEach(p => console.log('  ', p.slug, p.frontmatter.order));
});
