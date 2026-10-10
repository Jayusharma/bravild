Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile("d:\code\braweb\public\bravi-ai\image1.png")

Write-Host "Scanning top at x=500..."
for ($y = 60; $y -le 110; $y++) {
    $c = $b.GetPixel(500, $y)
    Write-Host "y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Host "Scanning bottom at x=500..."
for ($y = 1010; $y -le 1050; $y++) {
    $c = $b.GetPixel(500, $y)
    Write-Host "y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
}

$b.Dispose()
