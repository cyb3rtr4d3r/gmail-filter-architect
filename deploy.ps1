Start-Transcript -Path "deploy_log.txt" -Force

Write-Host "1. Baleni projektu (bez zavislosti, aby to bylo rychle)..."
tar.exe -czf dist.tar.gz --exclude=node_modules --exclude=.next --exclude=.git --exclude=.vscode --exclude=dist.tar.gz .
if ($LASTEXITCODE -ne 0) { Write-Host "Chyba pri baleni."; Stop-Transcript; exit $LASTEXITCODE }

Write-Host "2. Nahravani na server app01.mojeit.net..."
scp dist.tar.gz pavel@app01.mojeit.net:~/
if ($LASTEXITCODE -ne 0) { Write-Host "Chyba pri nahravani."; Stop-Transcript; exit $LASTEXITCODE }

Write-Host "3. Rozbalovani a spousteni produkce pres Docker na urovni serveru..."
# Na serveru puzijeme heslo pro "sudo", aby Docker mohl nahodit kontejnery bez preruseni
ssh pavel@app01.mojeit.net "mkdir -p ~/gmail-filter-architect && tar -xzf ~/dist.tar.gz -C ~/gmail-filter-architect && rm ~/dist.tar.gz && cd ~/gmail-filter-architect && echo decor9else_GAINES | sudo -S docker compose up -d --build"
if ($LASTEXITCODE -ne 0) { Write-Host "Chyba pri Docker buildu."; Stop-Transcript; exit $LASTEXITCODE }

Write-Host "4. Uklid na Windows disku..."
Remove-Item dist.tar.gz

Write-Host ""
Write-Host "=== HOTOVO! ==="
Write-Host "Aplikace by mela nyni bezet na http://app01.mojeit.net:3000 (nebo na patricne IP adrese serveru)."

Stop-Transcript

