---
'lighthouse-plugin-ecoindex-core': patch
'lighthouse-plugin-ecoindex-courses': patch
---

Change reading Node Count because of baddly implement #shadow-root (Shadow DOM).

1. Fix error when getting page
2. Fix unoptimized images audit
3. Fix bad sized images audit
4. fix: update Lighthouse configuration to include screen emulation and throttling parameters in settings
5. Better count nodes with #shadow-root
