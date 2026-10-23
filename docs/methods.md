---
title: "How This Book Was Made"
description: "The process behind Roots & Rivers: planning, AI-assisted drafting, five checking layers, and what still needs human experts."
---

# How This Book Was Made

This page explains who made Roots & Rivers, what AI agents and scripts did, and how each chapter was checked. A book about real people, faiths and history should be open about that.

## Who did what

**Aaryav Sharma**, a student at Eastview High School and a member of the board of its South Asian Student Association, created the book. That meant deciding what it should be and setting its rules:

- who it is for (high school students, both South Asian heritage teens and their friends) and what it should cover (all eight countries, not only India)
- the structure: 22 chapters in four parts, the order of topics, and the 368 concepts in the learning graph
- the features: the Ask Your Elders interview guides, the Whose Story? boxes, Zara and Ben, Mora the peacock, the MicroSims
- the rules every chapter had to follow: how to handle Partition, caste, religion and disputed borders; no ranking of faiths or countries; no invented facts; every number sourced
- reviewing the results and deciding what to publish

**AI agents** (Claude, made by Anthropic, running Dan McCreary's open [intelligent textbook](https://dmccreary.github.io/intelligent-textbooks/) framework) drafted the chapters, built the MicroSims, and did most of the checking described below, following those written rules. **Scripts** counted and checked the things that can be counted: structure, links, the learning graph, and whether any fact changed during editing.

## The five checking layers

1. **Sourced drafting.** Each chapter's writer logged every number, date and name with the page it came from. Anything that couldn't be confirmed was cut or softened.
2. **Structure checks.** Scripts confirmed that every chapter has its required sections, every assigned concept, a balanced 10-question quiz, 8 to 10 references and a working simulation.
3. **Independent fact-check.** A separate agent re-checked each chapter's claims, quiz answers, links and simulation text against sources.
4. **Expert-standard edit.** Another pass, written to the standard of a scholar of South Asia, looked for oversimplifications, one-sided framing and out-of-date facts, and updated them to October 2026.
5. **Plain-language edit with a fact guard.** A final edit made the writing plainer and more human. A script compared every file before and after to prove that no number, name, link or fact changed.

Version 1.1 added a sixth pass: a full read of every chapter by an agent acting as a senior specialist and book editor, with every shaky claim checked again. All corrections are listed on the [Accuracy and Corrections](accuracy.md) page.

## What this process can't do

AI agents and scripts can check facts against sources, but they are not a substitute for a scholar who has spent a career on a subject, or for a member of a community describing their own traditions. That is why the book asks for [expert reviewers](get-involved.md), keeps a public [corrections log](accuracy.md), and builds its most important feature, Ask Your Elders, around real people. The places where a human expert should look first are listed on the Accuracy page.

## Tools and sources

- Site: MkDocs with the Material theme, hosted on GitHub Pages
- Simulations: p5.js; charts: plain SVG
- Framework: Dan McCreary's intelligent-textbook skills (open source)
- Sources: listed at the end of every chapter; data from the World Bank, Pew Research Center, national censuses, UNESCO and others
- Code and text: [github.com/aaryavvatts-lab/south-asian-culture-textbook](https://github.com/aaryavvatts-lab/south-asian-culture-textbook)
