# Fixture KNOWLEDGE_BASE

This directory is a deterministic miniature KNOWLEDGE_BASE used by the blog migration tests.
It intentionally includes published notes, private notes, source notes, wiki links,
relative markdown links, alerts, math, Mermaid, code, tables, tasks, and images.

It also includes multilingual wiki fixtures under `wiki/en` and `wiki/ja` that share the
same slug as the Korean originals and carry `lang: en|ja` frontmatter. `published-note`
has en/ja translations and `second-note` has an en translation only, so tests can cover
both same-language link resolution and the kr fallback.
