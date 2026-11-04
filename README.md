# jarvis-test-mcp

Testdaten für Jarvis P9g1b, wird nach der Abnahme archiviert.

Marktplatz `jarvis-test-mcp` mit dem Plugin `jarvis-mcp-testplugin`:

- `.mcp.json`: stdio-Server `echo-server` (`node ${CLAUDE_PLUGIN_ROOT}/server.js`), Umgebung
  `TEST_TOKEN=${user_config.test_token}`.
- `server.js`: kleiner MCP-Server ohne Abhängigkeiten; Werkzeug `token_laenge` gibt nur die Länge von `TEST_TOKEN`
  zurück, nie den Wert.
- `plugin.json`: `userConfig.test_token` (`sensitive: true`, Pflicht).

Nur Attrappen als Werte verwenden.
