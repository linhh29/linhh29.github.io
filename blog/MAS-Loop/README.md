# MAS-Loop research blog

English project page: `index.html`. The legacy `index.zh.html` URL redirects to English; there is no language switch.

A static site with original paper figures, a five-stage interactive method explanation, animated workflow illustration, benchmark selector, full comparison table and case study. No CDN or front-end build is required.

For an integrated deployment use `MAS-Loop-Demo`, which serves this site at `/blog/` and the lab at `/`.

For a standalone preview:

```bash
python3 -m http.server 9390 --bind 127.0.0.1
# http://127.0.0.1:9390
```

Set `MAS_LOOP_DEMO_URL` in `config.js` to your deployed lab URL when hosting this folder independently. Integrated hosting defaults to `../`. The code ZIP and manuscript are included in `assets/`, so resource download links work offline through a local HTTP server.

Opening the HTML directly still shows the article and full results table; use HTTP for the JSON-driven interactive chart.

All paper statistics refer to the supplied manuscript. Source location information is stored in `assets/results.json` and the demo's `PROVENANCE.md`.

## Project metadata

Authors, affiliations and resource URLs are centralized in `project.js`. Author order matches the user-confirmed reference: Hehai Lin, Qi Yang, Chengwei Qin. Affiliations, author homepage links and corresponding-author designation follow the supplied reference. The delivered paper PDF retains its original anonymous manuscript content.

## Personal website integration

Maintained in `src_build/blog/blog_mas_loop/`; `npm run sync:blog` copies it to `public/blog/MAS-Loop/`. Both development and production builds run this synchronization automatically. The Blog listing is configured in `src/config.js`.

Project route: `/blog/MAS-Loop/index.html`. Demo: https://mas-loop-demo.hehailin.life/. Code: https://github.com/linhh29/MAS_Loop. The live model is `deepseek-v4.1-flash`.
