Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile("d:\code\braweb\public\bravi-ai\image1.png")

Write-Host "Scanning x=0 top in image1.png..."
for ($y = 80; $y -le 115; $y++) {
    $c = $b.GetPixel(0, $y)
    Write-Host "y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Host "Scanning x=0 bottom in image1.png..."
for ($y = 1015; $y -le 1040; $y++) {
    $c = $b.GetPixel(0, $y)
    Write-Host "y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
}

$b.Dispose()
