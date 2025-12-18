
# Python 3.12 Automated Installer Script
# This script downloads and installs Python 3.12.0 for Windows (64-bit)

$InstallerUrl = "https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe"
$InstallerPath = "$env:TEMP\python-3.12.0-amd64.exe"

Write-Host "Downloading Python 3.12 installer..."
Invoke-WebRequest -Uri $InstallerUrl -OutFile $InstallerPath

Write-Host "Installing Python 3.12 (User Scope, Add to Path)..."
# Perform silent install
# /quiet = silent
# InstallAllUsers=0 = install for current user only (avoids UAC prompt issues often)
# PrependPath=1 = add to PATH
# Include_test=0 = skip tests suite to save space
Start-Process -FilePath $InstallerPath -ArgumentList "/quiet InstallAllUsers=0 PrependPath=1 Include_test=0" -Wait

Write-Host "Installation complete."
Write-Host "Checking python version..."
& py -3.12 --version

if ($?) {
    Write-Host "Python 3.12 installed successfully!"
} else {
    Write-Host "Installation failed or not found via 'py' launcher."
}

Remove-Item $InstallerPath -ErrorAction SilentlyContinue
