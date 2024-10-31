---
title:          Self-Correction is More than Refinement： A Learning Framework for Visual and Language Reasoning Tasks
date:           2024-12-20 00:01:00 +0800
selected:       true
pub:            "Under review"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-custom badge-success">Spotlight</span>'
# pub_last:       ' <span class="badge badge-pill badge-custom badge-dark">Journal</span>'
pub_date:       "2024"

abstract: >-
  While Vision-Language Models (VLMs) have shown remarkable abilities in visual and language reasoning tasks, they invariably generate flawed responses. Self-correction that instructs models to refine their outputs presents a promising solution to this issue. Previous studies have mainly concentrated on Large Language Models (LLMs), while the self-correction abilities of VLMs, particularly concerning both visual and linguistic information, remain largely unexamined. This study investigates the self-correction capabilities of VLMs during both inference and fine-tuning stages. We introduce a Self-Correction Learning (SCL) approach that enables VLMs to learn from their self-generated self-correction data through Direct Preference Optimization (DPO) without relying on external feedback, facilitating self-improvement. Specifically, we collect preferred and disfavored samples based on the correctness of initial and refined responses, which are obtained by two-turn self-correction with VLMs during the inference stage. Experimental results demonstrate that although VLMs struggle to self-correct effectively during iterative inference without additional fine-tuning and external feedback, they can enhance their performance and avoid previous mistakes through preference fine-tuning when their self-generated self-correction data are categorized into preferred and disfavored samples. This study emphasizes that self-correction is not merely a refinement process; rather, it should enhance the reasoning abilities of models through additional training, enabling them to generate high-quality responses directly without further refinement.
  
cover:          assets/images/covers/scl.jpg
authors:
  - Jiayi He*
  - Hehai Lin*
  - Qingyun Wang
  - Yi Fung
  - Heng Ji
# links:   Paper: https://www.sciencedirect.com/science/article/pii/S0010482524004839   Demo: https://qa.glaucoma-assistant.com/#/qa   Cite: assets/bibtex/xue2024xiaoqing.bib
---
