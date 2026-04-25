---
title: "geomqtt"
date: 2026-04-23T12:00:00-05:00
description: "Turn Redis GEO sets into a live, tile-keyed topic tree."
tags: ["MQTT", "Redis", "Real-time", "Server"]
---
A small daemon that bridges Redis's geospatial commands and an embedded MQTT broker. Drop tile-keyed coordinates into a Redis GEO set; any client subscribed to the matching tile topic gets the update on the next tick.

It is the transport layer that makes the rest of the shared-world experiments possible — Foundry tables, web clients, and Unity/Unreal sessions can all listen on the same tiles and see each other move.

* [Repository](https://github.com/openfantasymap/geomqtt)
