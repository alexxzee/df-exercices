# Installe PCOV (pilote de couverture, exercice 2 de Relais) pour le PHP de ce poste Windows.
# Lancé par : powershell -ExecutionPolicy Bypass -File ..\outils\installer-pcov.ps1
# Sans dépendance : PowerShell seul, PHP dans le PATH.
$ErrorActionPreference = 'Stop'
$versionPcov = '1.0.12'

function Echec($message) {
    Write-Host ''
    Write-Host "ECHEC : $message" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Echec "PHP est introuvable dans ce terminal. Tapez : winget install PHP.PHP.8.4 , fermez puis rouvrez le terminal, et relancez cette commande."
}

function PhpEcho($code) { (& php -r "echo $code;").Trim() }

$version = PhpEcho "PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION"
$ts      = if ((PhpEcho 'PHP_ZTS') -eq '1') { 'ts' } else { 'nts' }
$arch    = if ((PhpEcho 'PHP_INT_SIZE') -eq '8') { 'x64' } else { 'x86' }
$dossierPhp = Split-Path -Parent (Get-Command php).Source

$parts = $version.Split('.')
$majeur = [int]$parts[0]; $mineur = [int]$parts[1]
if ($majeur -lt 8 -or ($majeur -eq 8 -and $mineur -lt 4)) {
    Echec "PHP $version est trop ancien : il faut PHP 8.4 ou plus récent. Tapez : winget install PHP.PHP.8.4 , rouvrez le terminal, relancez cette commande."
}
$vs = if ($majeur -eq 8 -and $mineur -le 3) { 'vs16' } else { 'vs17' }

$ini = PhpEcho 'php_ini_loaded_file()'
if (-not $ini) {
    $modele = Join-Path $dossierPhp 'php.ini-development'
    if (Test-Path $modele) {
        $ini = Join-Path $dossierPhp 'php.ini'
        Copy-Item $modele $ini
        Write-Host "Aucun php.ini n'était chargé : $ini créé depuis php.ini-development."
    } else {
        Echec "Aucun php.ini n'est chargé et php.ini-development est introuvable dans $dossierPhp. Copiez le modèle de votre PHP en php.ini dans ce dossier, puis relancez cette commande."
    }
}

$ext = PhpEcho "ini_get('extension_dir')"
if (-not [System.IO.Path]::IsPathRooted($ext)) { $ext = Join-Path $dossierPhp $ext }
if (-not (Test-Path $ext)) { Echec "Le dossier d'extensions $ext n'existe pas. Vérifiez extension_dir dans $ini." }

$nom = "php_pcov-$versionPcov-$version-$ts-$vs-$arch.zip"
$url = "https://downloads.php.net/~windows/pecl/releases/pcov/$versionPcov/$nom"
$temp = Join-Path ([System.IO.Path]::GetTempPath()) ("pcov-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $temp | Out-Null
try {
    Write-Host "PHP $version $ts $arch : téléchargement de $nom"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile (Join-Path $temp $nom) -UseBasicParsing
    Expand-Archive -Path (Join-Path $temp $nom) -DestinationPath $temp -Force
    Copy-Item (Join-Path $temp 'php_pcov.dll') $ext -Force
} catch {
    Echec "téléchargement ou copie impossible ($($_.Exception.Message)). Adresse essayée : $url . Écrivez-la au formateur."
} finally {
    Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Select-String -Path $ini -Pattern '^\s*extension\s*=\s*"?(php_)?pcov' -Quiet)) {
    Add-Content -Path $ini -Value "`r`nextension=pcov"
    Write-Host "extension=pcov ajouté à $ini"
}

if ((& php -m) -match '^pcov$') {
    Write-Host 'PCOV est chargé. Vérifiez : php -m | findstr pcov' -ForegroundColor Green
} else {
    Echec "PCOV est copié dans $ext mais PHP ne le charge pas. Ouvrez $ini et vérifiez la ligne extension=pcov ; rouvrez le terminal."
}
