---
title: "OFM Shared World"
date: 2026-04-24T12:00:00-05:00
description: "See other tables' actors move across the same shared world, live."
tags: ["FoundryVTT", "MQTT", "Real-time", "Multiplayer"]
---
A FoundryVTT module that lets one table see, live, what other tables are doing across the same fantasy world. Foreign players render as lightweight canvas sprites — no tokens are spawned, no database is written to, no permissions need wrangling. The first concrete piece of the long shared-world vision.

It connects to a [geomqtt](/tools/geomqtt/) broker over MQTT, subscribes to the tiles your viewport is showing, and draws whatever moves through them. Compatible with Foundry v11–v13.

* [Repository](https://github.com/openfantasymap/ofm-shared-world)
