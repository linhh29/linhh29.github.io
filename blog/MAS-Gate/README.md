# MAS-Gate research blog

English static project page with the author list, research overview, original figures, interactive equations, lifecycle tabs, benchmark charts, case studies, paper, GitHub repository and copyable citation.

The complete demo serves this page at `/blog/`. For a standalone preview:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. Use HTTP so the benchmark JSON can load. Official links are also present in HTML so navigation works without JavaScript:

- Code: https://github.com/linhh29/MAS_Gate
- Paper: https://arxiv.org/abs/2610.17613
- Demo: https://mas-gate-demo.hehailin.life/
- Project blog: https://linhh29.github.io/blog/MAS-Gate/index.html

`project.js` centralizes these URLs and preserves section anchors and demo parameters. All Paper buttons link to the verified arXiv record; the bundled PDF remains available as an archived asset. The citation includes the arXiv identifier. `polish.css` supplies the reading and responsive layout; `reading.js` adds an accessible figure dialog and BibTeX copying. Original image aspect ratios are preserved.

`visits.js` uses the same public CountAPI service as Skill-MAS. The blog and demo use separate counter keys (`linhh29.github.io-mas-gate-blog` and `linhh29.github.io-mas-gate-demo`). One visit is recorded per tab session, with refreshes deduplicated using sessionStorage when available. This is a visit count, not a unique-person count. Local previews do not increment it, and service failures show “Unavailable” without affecting the page. The demo CSP allows connections only to itself and this specific counting service.

Website integration: copy this folder to `/Users/linhehai/Desktop/website/src_build/blog/blog_mas_gate/`, then run `npm run build` from `src_build`. The existing sync script writes `public/blog/MAS-Gate/` and the production build includes `dist/blog/MAS-Gate/`. The main Blog page already links to this project.

Authors and results follow the user-supplied manuscript. Scores are reported paper results, not newly reproduced measurements. The full source archive and authored PDF are in `assets/`. No external font, JavaScript framework or build step is required.
