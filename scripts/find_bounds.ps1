
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\code\braweb\public\bravi-ai\image1.png")
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Check top rows (Chrome header vs page content)
# In image1.png, at x=100 (sidebar area, dark color ~ #0B0E14)
for ($y = 70; $y -lt 100; $y++) {
    $c = $bmp.GetPixel(100, $y)
    Write-Host "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "--- Bottom rows ---"
# Check bottom rows (Page content vs Windows taskbar ~ light gray/white/blue)
for ($y = 1025; $y -lt 1045; $y++) {
    $c = $bmp.GetPixel(100, $y)
    Write-Host "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$bmp.Dispose()
