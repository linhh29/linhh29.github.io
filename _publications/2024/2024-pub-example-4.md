---
title:          Multi-view Analysis for Modality Bias in Multimodal Misinformation Benchmarks
date:           2024-12-25 00:01:00 +0800
selected:       true
pub:            "Under review"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-custom badge-success">Spotlight</span>'
# pub_last:       ' <span class="badge badge-pill badge-custom badge-dark">Journal</span>'
pub_date:       "2024"

abstract: >-
  Numerous multimodal misinformation benchmarks exhibit bias toward specific modalities, allowing detectors to make predictions based solely on one modality. Training detectors on such datasets can significantly degrade performance in real-world applications. While previous research has quantified modality bias at the dataset level or manually identified spurious correlations between modalities and labels, these approaches lack meaningful insights at the sample level and struggle to scale to the vast amount of online information. In this paper, we investigate the design for automatically recognizing modality bias at the sample level. Specifically, we introduce three views, namely modality benefit, modality flow, and modality causal effect, to quantify samples’ modality contribution based on different theories. To verify their effectiveness and discover the pattern of bias, we conduct a human evaluation on two benchmarks Fakeddit and MMFakeBench, and compare the performance of each view and their ensemble multi-view analysis. The experimental result indicates that multi-view analysis yields the highest performance and is aligned with human judgment in most samples. We further discuss the sensitivity and consistency of each view.
  
cover:          assets/images/covers/multiview.png
authors:
  - Hehai Lin
  - Hui Liu
  - Shilei Cao
  - Haoliang Li
  - Wenya Wang 
# links:   Paper: https://ieeexplore.ieee.org/abstract/document/10640221
---
