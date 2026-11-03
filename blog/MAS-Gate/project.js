window.MAS_GATE_PROJECT = {
  "title": "MAS-Gate: Unlocking Multi-Agent System Lifecycle via Node-Centric Quantification",
  "authors": [
    {
      "name": "Hehai Lin",
      "affiliations": [
        1
      ],
      "equal": true,
      "corresponding": false
    },
    {
      "name": "Zixuan Wang",
      "affiliations": [
        1
      ],
      "equal": true,
      "corresponding": false
    },
    {
      "name": "Ming Yan",
      "affiliations": [
        1
      ],
      "equal": true,
      "corresponding": false
    },
    {
      "name": "Peidong Wang",
      "affiliations": [
        1
      ],
      "equal": false,
      "corresponding": false
    },
    {
      "name": "Shilei Cao",
      "affiliations": [
        2
      ],
      "equal": false,
      "corresponding": false
    },
    {
      "name": "Minzhi Li",
      "affiliations": [
        4,
        5
      ],
      "equal": false,
      "corresponding": false
    },
    {
      "name": "Bosheng Ding",
      "affiliations": [
        3
      ],
      "equal": false,
      "corresponding": false
    },
    {
      "name": "Juepeng Zheng",
      "affiliations": [
        2
      ],
      "equal": false,
      "corresponding": false
    },
    {
      "name": "Chengwei Qin",
      "affiliations": [
        1
      ],
      "equal": false,
      "corresponding": true
    }
  ],
  "affiliations": [
    "The Hong Kong University of Science and Technology (Guangzhou)",
    "Sun Yat-sen University",
    "Nanyang Technological University",
    "National University of Singapore",
    "Institute for Infocomm Research (I²R), A*STAR"
  ],
  "correspondence": "chengweiqin@hkust-gz.edu.cn",
  "paper_url": "https://arxiv.org/abs/2610.17613",
  "code_url": "https://github.com/linhh29/MAS_Gate",
  "demo_url": "https://mas-gate-demo.hehailin.life/",
  "project_url": "https://linhh29.github.io/blog/MAS-Gate/index.html"
};
for (const [key, selector] of [
  ['paper_url', '[data-paper]'], ['code_url', '[data-code]'],
  ['demo_url', '[data-demo]'], ['project_url', '[data-project]']
]) {
  const url = window.MAS_GATE_PROJECT[key];
  if (!/^https?:\/\//.test(url)) continue;
  document.querySelectorAll(selector).forEach(link => {
    const target = new URL(url);
    const original = new URL(link.getAttribute('href'), location.href);
    if (key === 'demo_url' || key === 'project_url') {
      target.search = original.search;
      target.hash = original.hash;
    }
    link.href = target.href;
  });
}
