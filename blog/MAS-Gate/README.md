# MAS-Gate research blog

English static project page with the supplied author list, research overview, original figures, interactive equations, lifecycle tabs, benchmark charts, case studies, paper/code downloads and citation.

The complete demo serves this page at `/blog/`. For a standalone preview:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. Use HTTP so the benchmark JSON can load. For standalone hosting, set `demo_url` in `project.js` to the actual deployed demo URL. The bundled demo uses the default relative links. Optional `paper_url`, `code_url` and `project_url` override local resource links when official URLs are available. The Signal Explorer link retains `?view=signals` when a demo URL override is used.

Authors and results follow the user-supplied manuscript. Scores are reported paper results, not newly reproduced measurements. The full source archive and authored PDF are in `assets/`. No external font, JavaScript framework or build step is required.


## Personal website integration

Maintained in `src_build/blog/blog_mas_gate/`; `npm run sync:blog` copies it to `public/blog/MAS-Gate/`. Development and production builds run this synchronization automatically. The Blog listing and project-page mapping are in `src/config.js`.

Project route: `/blog/MAS-Gate/index.html`. Live demo: https://mas-gate-demo.hehailin.life/. Paper and research-code download links retain their bundled assets. Demo links are configured in `project.js` and have working absolute HTML fallbacks, including the Signal Explorer query string.
