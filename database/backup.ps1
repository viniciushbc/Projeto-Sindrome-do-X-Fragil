$Data = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

$BackupDir = "database\backups"
$BackupFile = "$BackupDir\sindrome_x_fragil_$Data.sql"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "Iniciando backup do banco sindrome_x_fragil..."

& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p --single-transaction --routines --triggers --result-file="$BackupFile" sindrome_x_fragil

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup criado com sucesso em: $BackupFile"
} else {
    Write-Host "Erro ao criar backup. Verifique se o mysqldump esta instalado e se a senha esta correta."
}