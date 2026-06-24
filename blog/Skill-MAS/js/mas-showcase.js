(function () {
  "use strict";

  const DATA_URL = "./assets/mas-showcase-cases.json";
  const TOPOLOGY_FILTERS = [
    { id: "all", label: "All" },
    { id: "serial", label: "Serial" },
    { id: "parallel", label: "Parallel" },
    { id: "loop", label: "Loop" },
  ];

  let renderId = 0;

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text == null ? "" : String(text);
    return d.innerHTML;
  }

  function buildLayers(nodes) {
    const byName = Object.fromEntries(nodes.map((n) => [n.name, n]));
    const layerOf = {};

    function depth(name, stack) {
      if (layerOf[name] !== undefined) return layerOf[name];
      if (stack.has(name)) return 0;
      stack.add(name);
      const node = byName[name];
      const forwardDeps = (node.dependencies || []).filter((dep) => {
        const edge = node.edgeTypes?.[dep];
        return edge !== "feedback_loop";
      });
      if (!forwardDeps.length) {
        layerOf[name] = 0;
        return 0;
      }
      const depLayers = forwardDeps
        .filter((dep) => byName[dep])
        .map((dep) => depth(dep, stack));
      const d = (depLayers.length ? Math.max(...depLayers) : 0) + 1;
      layerOf[name] = d;
      return d;
    }

    nodes.forEach((n) => depth(n.name, new Set()));
    const maxLayer = Math.max(0, ...Object.values(layerOf));
    const rows = Array.from({ length: maxLayer + 1 }, (_, i) =>
      nodes.filter((n) => layerOf[n.name] === i)
    );
    return rows;
  }

  function nodeLabel(name) {
    return name
      .split("_")
      .filter(Boolean)
      .reduce((lines, part, i, arr) => {
        if (i % 2 === 0) lines.push(arr.slice(i, i + 2).join(" "));
        return lines;
      }, [])
      .join("<br>");
  }

  function nodeHeight(name, nodeW) {
    const charsPerLine = Math.max(10, Math.floor((nodeW - 12) / 6));
    const lines = name.split("_").filter(Boolean);
    const textLines = [];
    for (let i = 0; i < lines.length; i += 2) {
      const line = lines.slice(i, i + 2).join(" ");
      textLines.push(Math.max(1, Math.ceil(line.length / charsPerLine)));
    }
    const total = textLines.reduce((s, n) => s + n, 0);
    return Math.max(48, 20 + total * 13);
  }

  function renderGraph(caseData) {
    const nodeCount = caseData.nodes.length;
    const NODE_W = nodeCount > 8 ? 112 : nodeCount > 6 ? 118 : 128;
    const GAP_X = 32;
    const GAP_Y = 14;
    const PAD_X = 12;
    const PAD_Y = 16;

    const nodeList = caseData.nodes.map((name) => {
      const deps = caseData.edges
        .filter((e) => e.to === name)
        .map((e) => e.from);
      const edgeTypes = {};
      caseData.edges
        .filter((e) => e.to === name)
        .forEach((e) => {
          edgeTypes[e.from] = e.type || "sequential";
        });
      return { name, dependencies: deps, edgeTypes };
    });

    const layers = buildLayers(nodeList);
    const colCount = layers.length;
    const canvasW = PAD_X * 2 + colCount * NODE_W + Math.max(0, colCount - 1) * GAP_X;

    const positions = {};
    let canvasH = PAD_Y * 2;
    const colHeights = layers.map((col) => {
      const heights = col.map((n) => nodeHeight(n.name, NODE_W));
      return heights.reduce((s, h) => s + h, 0) + Math.max(0, col.length - 1) * GAP_Y;
    });
    canvasH += Math.max(...colHeights, 60);

    layers.forEach((col, li) => {
      const heights = col.map((n) => nodeHeight(n.name, NODE_W));
      const colH = heights.reduce((s, h) => s + h, 0) + Math.max(0, col.length - 1) * GAP_Y;
      const startY = (canvasH - colH) / 2;
      const left = PAD_X + li * (NODE_W + GAP_X);
      let y = startY;
      col.forEach((node, ri) => {
        const h = heights[ri];
        positions[node.name] = { left, top: y, w: NODE_W, h, cx: left + NODE_W / 2, cy: y + h / 2 };
        y += h + GAP_Y;
      });
    });

    const markerId = `mas-arrow-${++renderId}`;
    const loopMarkerId = `mas-loop-arrow-${renderId}`;
    const paths = [];

    caseData.edges.forEach((edge, i) => {
      const source = positions[edge.from];
      const target = positions[edge.to];
      if (!source || !target) return;

      const isLoop = edge.type === "feedback_loop";
      if (isLoop) {
        const y = Math.max(source.cy, target.cy) + 36;
        const d = `M ${source.cx} ${source.top + source.h} L ${source.cx} ${y} L ${target.cx} ${y} L ${target.cx} ${target.top + target.h}`;
        paths.push(
          `<path d="${d}" class="mas-showcase-edge mas-showcase-edge-loop" marker-end="url(#${loopMarkerId})" />` +
            `<path d="${d}" class="mas-showcase-edge mas-showcase-edge-loop-flow" style="animation-delay:${(i * 0.15).toFixed(2)}s" />`
        );
        canvasH = Math.max(canvasH, y + PAD_Y + 8);
      } else {
        const x1 = source.left + source.w;
        const y1 = source.cy;
        const x2 = target.left;
        const y2 = target.cy;
        const midX = x1 + (x2 - x1) * 0.45;
        const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        paths.push(
          `<path d="${d}" class="mas-showcase-edge mas-showcase-edge-track" marker-end="url(#${markerId})" />` +
            `<path d="${d}" class="mas-showcase-edge mas-showcase-edge-flow" style="animation-delay:${(i * 0.12).toFixed(2)}s" />`
        );
      }
    });

    const nodeBoxes = nodeList
      .map((n) => {
        const pos = positions[n.name];
        if (!pos) return "";
        return `<div class="mas-showcase-node" style="left:${pos.left}px;top:${pos.top}px;width:${pos.w}px;height:${pos.h}px">${nodeLabel(n.name)}</div>`;
      })
      .join("");

    return `
      <div class="mas-showcase-graph">
        <div class="mas-showcase-graph-stage" style="width:${canvasW}px;height:${canvasH}px">
          <svg class="mas-showcase-svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">
            <defs>
              <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
              </marker>
              <marker id="${loopMarkerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#ea580c" />
              </marker>
            </defs>
            ${paths.join("")}
          </svg>
          <div class="mas-showcase-nodes">${nodeBoxes}</div>
        </div>
      </div>`;
  }

  function renderCard(c) {
    const topoClass = `topology-${c.topology}`;
    return `
      <article class="mas-showcase-card" data-topology="${escapeHtml(c.topology)}">
        <div class="mas-showcase-card-info">
          <div class="mas-showcase-card-tags">
            <span class="mas-showcase-tag ${topoClass}">${escapeHtml(c.topology_label)}</span>
            <span class="mas-showcase-tag dataset">${escapeHtml(c.dataset_title)}</span>
          </div>
          <h4 class="mas-showcase-card-title">Sample ${escapeHtml(String(c.task_id))} · ${escapeHtml(c.agent_count)} agents</h4>
          <p class="mas-showcase-card-preview">${escapeHtml(c.question_preview || c.summary)}</p>
          <p class="mas-showcase-card-summary">${escapeHtml(c.summary)}</p>
          <a class="mas-showcase-card-link" href="${escapeHtml(c.gallery_url)}" target="_blank" rel="noopener">View full build in Gallery →</a>
        </div>
        <div class="mas-showcase-card-graph">
          ${renderGraph(c)}
        </div>
      </article>`;
  }

  function bindFilters(root, cards) {
    const buttons = root.querySelectorAll(".mas-showcase-filter");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.topology === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  async function init() {
    const mount = document.getElementById("mas-showcase-root");
    if (!mount) return;

    mount.innerHTML = '<p class="mas-showcase-meta">Loading generated MAS structures…</p>';

    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const cases = data.cases || [];

      const filtersHtml = TOPOLOGY_FILTERS.map(
        (f, i) =>
          `<button type="button" class="mas-showcase-filter${i === 0 ? " is-active" : ""}" data-filter="${f.id}">${f.label}</button>`
      ).join("");

      mount.innerHTML = `
        <div class="mas-showcase-filters">${filtersHtml}</div>
        <div class="mas-showcase-list">${cases.map(renderCard).join("")}</div>
        <div class="mas-showcase-cta">
          <p class="mas-showcase-cta-text">
            These are just ${cases.length} hand-picked examples. Follow the
            <a href="#Demo"><strong>Gallery &amp; Online Demo</strong></a> section below to browse more builds
            and try the interactive Online Demo.
          </p>
        </div>
        <p class="mas-showcase-meta">${cases.length} curated examples · ${escapeHtml(data.model || "DeepSeek V4 Flash")}</p>`;

      bindFilters(mount, mount.querySelectorAll(".mas-showcase-card"));
    } catch (err) {
      mount.innerHTML = `<p class="mas-showcase-meta">Could not load MAS showcase data. <a href="https://skill-mas-demo.hehailin.life/gallery" target="_blank" rel="noopener">Open Gallery</a> to explore builds directly.</p>`;
      console.error("mas-showcase:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
