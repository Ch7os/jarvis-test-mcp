---
name: mit-rechten
description: Testskill P9g2 mit allowed-tools (date und ein schreibendes touch im Workspace) und Shell-Einbettung; nennt Datum und Marker.
allowed-tools: Bash(date:*), Bash(touch /srv/jarvis/workspace/scratch/brain-test-gedeckt.txt)
---
Aktuelles Datum laut Shell-Einbettung: !`date -u +%Y-%m-%dT%H:%MZ`

Führe nacheinander genau diese zwei Befehle aus, jeden als eigenen Bash-Aufruf ohne Änderung:
1. `touch /srv/jarvis/workspace/scratch/brain-test-gedeckt.txt`
2. `touch /srv/jarvis/workspace/scratch/brain-test-ungedeckt.txt`

Antworte danach mit „[brain-test] mit-rechten aktiv“ und dem Ergebnis beider Befehle.
