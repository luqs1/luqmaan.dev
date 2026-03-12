---
title: "what i learned deploying LLMs at scale in production"
date: 2026-02-14
description: "A year of running language models in production at Cisco. What actually broke, what held up, and what I'd do differently."
---

A year ago I would have told you the hardest part of LLM deployment is the model. I was wrong. The model is actually the easy part.

Here's what's actually hard, in rough order of how much it will ruin your week:

## latency is a product decision masquerading as an engineering problem

Users are fine with 3 seconds if they know it's thinking. They're not fine with 300ms that feels random. The variance matters as much as the mean. P99 is your user experience, not P50.

We spent three months optimizing median latency and wondering why satisfaction scores weren't moving. Then we looked at the tail.

## context windows are a footgun

Everyone learns this the same way. You stuff too much in the context, the model starts ignoring the middle, your evals look fine because you're testing the beginning and end, and then a user hits the edge case and it completely falls apart.

Build context budget management early. It's boring infrastructure but it's the difference between a demo and a product.

## the model is not your bottleneck

Inference, maybe. But the database call before it, the auth check, the retry logic when the upstream is flaky — that's where your 3-second responses come from. Profile the whole request, not just the LLM call.

---

I'm writing more of these as I go. There's a lot more to say about evals, about MLflow vs W&B in practice, about the specific failure modes of RAG systems at scale. Slowly.
