Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile("d:\code\braweb\public\bravi-ai\image2.png")
Write-Host "image2.png: $($b.Width)x$($b.Height)"
Write-Host "Top-left pixel: R=$($b.GetPixel(0,0).R) G=$($b.GetPixel(0,0).G) B=$($b.GetPixel(0,0).B)"
Write-Host "Pixel at x=500, y=0: R=$($b.GetPixel(500,0).R) G=$($b.GetPixel(500,0).G) B=$($b.GetPixel(500,0).B)"
Write-Host "Bottom-left pixel (0, $($b.Height-1)): R=$($b.GetPixel(0,$b.Height-1).R) G=$($b.GetPixel(0,$b.Height-1).G) B=$($b.GetPixel(0,$b.Height-1).B)"
$b.Dispose()
