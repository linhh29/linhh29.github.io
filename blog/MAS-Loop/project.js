window.MAS_LOOP_PROJECT = {
  "title": "MAS-Loop: Beyond One-Shot Orchestration towards Self-Evolving Multi-Agent Systems",
  "authors": [
    {
      "name": "Hehai Lin",
      "bibtex": "Lin, Hehai",
      "affiliations": [
        "1"
      ],
      "url": "https://linhh29.github.io/"
    },
    {
      "name": "Qi Yang",
      "bibtex": "Yang, Qi",
      "affiliations": [
        "2"
      ],
      "url": ""
    },
    {
      "name": "Chengwei Qin",
      "bibtex": "Qin, Chengwei",
      "affiliations": [
        "1"
      ],
      "corresponding": true,
      "url": "https://qcwthu.github.io/"
    }
  ],
  "affiliations": [
    {
      "id": "1",
      "name": "HKUST (Guangzhou)"
    },
    {
      "id": "2",
      "name": "Ant Group"
    }
  ],
  "corresponding_author": "Chengwei Qin",
  "code_url": "https://github.com/linhh29/MAS_Loop",
  "paper_url": "https://arxiv.org/abs/2610.38946",
  "project_url": "https://linhh29.github.io/blog/MAS-Loop/index.html",
  "demo_url": "https://mas-loop-demo.hehailin.life/",
  "year": "2026",
  "note": "arXiv:2610.38946",
  "eprint": "2610.38946"
};
(() => {
 const p=window.MAS_LOOP_PROJECT;
 const safeURL=s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}};
 document.querySelectorAll('[data-project-authors]').forEach(el=>{
  if(!p.authors.length)return;
  el.replaceChildren();
  p.authors.forEach((a,i)=>{
   if(i)el.append(document.createTextNode(' · '));
   const url=safeURL(a.url);const name=document.createElement(url?'a':'span');name.textContent=a.name;if(url)name.href=url;el.append(name);
   if(a.affiliations?.length){const sup=document.createElement('sup');sup.textContent=a.affiliations.join(',')+(a.corresponding?'†':'');el.append(sup)}
  });
 });
 document.querySelectorAll('[data-project-affiliations]').forEach(el=>el.textContent=p.affiliations.map(a=>a.id+' '+a.name).join('  ·  '));
 document.querySelectorAll('[data-project-correspondence]').forEach(el=>el.textContent=p.corresponding_author?'† Corresponding author: '+p.corresponding_author:'');
 if(safeURL(p.code_url))document.querySelectorAll('[data-project-code]').forEach(a=>{a.href=p.code_url});
 if(safeURL(p.paper_url))document.querySelectorAll('[data-project-paper], a[href$="paper.pdf"]').forEach(a=>a.href=p.paper_url);
 if(safeURL(p.project_url))document.querySelectorAll('[data-project-link]').forEach(a=>{a.href=p.project_url});
 if(safeURL(p.demo_url))document.querySelectorAll('[data-demo-link]').forEach(a=>a.href=p.demo_url);
 const bib=document.querySelector('#bibtex');
 if(bib&&p.authors.length)bib.textContent='@misc{masloop'+p.year+',\n  title = {'+p.title+'},\n  author = {'+p.authors.map(a=>a.bibtex||a.name).join(' and ')+'},\n  year = {'+p.year+'},\n  eprint = {'+p.eprint+'},\n  archivePrefix = {arXiv},\n  primaryClass = {cs.MA},\n  url = {'+p.paper_url+'}\n}';
})();
