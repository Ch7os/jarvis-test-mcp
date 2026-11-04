#!/usr/bin/env node
// Kleiner MCP-Server (stdio, JSON-RPC je Zeile, ohne Abhängigkeiten) für Jarvis P9g1b.
// Werkzeug token_laenge: gibt nur die Länge von TEST_TOKEN zurück, nie den Wert.
"use strict";
const readline = require("readline");

const WERKZEUGE = [{
  name: "token_laenge",
  description: "Gibt die Länge der Umgebungsvariable TEST_TOKEN zurück (nie den Wert).",
  inputSchema: {type: "object", properties: {}, additionalProperties: false},
}];

function senden(nachricht) {
  process.stdout.write(JSON.stringify(Object.assign({jsonrpc: "2.0"}, nachricht)) + "\n");
}

function antworten(m) {
  switch (m.method) {
    case "initialize":
      return {
        protocolVersion: (m.params && m.params.protocolVersion) || "2025-06-18",
        capabilities: {tools: {}},
        serverInfo: {name: "jarvis-echo-server", version: "0.1.0"},
      };
    case "ping":
      return {};
    case "tools/list":
      return {tools: WERKZEUGE};
    case "tools/call": {
      const name = m.params && m.params.name;
      if (name !== "token_laenge") {
        return {isError: true, content: [{type: "text", text: "unbekanntes Werkzeug"}]};
      }
      const wert = process.env.TEST_TOKEN;
      const text = wert === undefined ? "TEST_TOKEN fehlt" : `TEST_TOKEN hat ${Buffer.byteLength(wert, "utf8")} Byte`;
      return {content: [{type: "text", text}]};
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
