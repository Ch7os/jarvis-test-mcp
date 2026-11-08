#!/usr/bin/env node
// Kleiner MCP-Server (stdio, JSON-RPC je Zeile, ohne Abhängigkeiten) für Jarvis P9g2 (Brain als Ziel).
// Servername mit Punkt (brain.echo), damit die Normalisierung der Werkzeugnamen (mcp__brain_echo__*) belegbar ist.
// Werkzeuge: zeit (UTC-Zeit), laenge (Länge eines Texts), marker (fester Marker). Keine Zugangsdaten.
"use strict";
const readline = require("readline");

const LEER = {type: "object", properties: {}, additionalProperties: false};
const WERKZEUGE = [
  {name: "zeit", description: "Gibt die aktuelle UTC-Zeit zurück.", inputSchema: LEER},
  {name: "laenge", description: "Gibt die Länge des Texts in Zeichen zurück.",
   inputSchema: {type: "object", properties: {text: {type: "string"}}, required: ["text"], additionalProperties: false}},
  {name: "marker", description: "Gibt den festen Marker [brain-echo] zurück.", inputSchema: LEER},
];

function senden(nachricht) {
  process.stdout.write(JSON.stringify(Object.assign({jsonrpc: "2.0"}, nachricht)) + "\n");
}

function text(t) {
  return {content: [{type: "text", text: t}]};
}

function antworten(m) {
  switch (m.method) {
    case "initialize":
      return {
        protocolVersion: (m.params && m.params.protocolVersion) || "2025-06-18",
        capabilities: {tools: {}},
        serverInfo: {name: "jarvis-brain-echo", version: "0.2.0"},
      };
    case "ping":
      return {};
    case "tools/list":
      return {tools: WERKZEUGE};
    case "tools/call": {
      const name = m.params && m.params.name;
      const args = (m.params && m.params.arguments) || {};
      if (name === "zeit") return text(new Date().toISOString());
      if (name === "laenge") return text(String(typeof args.text === "string" ? [...args.text].length : 0));
      if (name === "marker") return text("[brain-echo]");
      return {isError: true, content: [{type: "text", text: "unbekanntes Werkzeug"}]};
    }
    default:
      return null;
  }
}

readline.createInterface({input: process.stdin}).on("line", (zeile) => {
  let m;
  try {
    m = JSON.parse(zeile);
  } catch (e) {
    return;
  }
  if (!m || typeof m !== "object" || m.id === undefined || typeof m.method !== "string") {
    return; // Benachrichtigungen und Antworten
  }
  const r = antworten(m);
  if (r === null) {
    senden({id: m.id, error: {code: -32601, message: "Methode unbekannt"}});
  } else {
    senden({id: m.id, result: r});
  }
});
