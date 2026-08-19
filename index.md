---
layout: home
title: Le site infuse encore un peu.
---

Houblons Nous prépare ses fûts, son houblon et son site. Revenez très vite pour la suite de
l'histoire.

{% if site.data.baserow_locations %}

<!-- markdownlint-disable MD032 -->
{% for location in site.data.baserow_locations %}
- {{ location.name }}
{% endfor %}
<!-- markdownlint-restore -->

{% endif %}
