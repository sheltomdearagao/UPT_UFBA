# Resolve conflicts by choosing the most recently-updated file between origin/main and feature/supabase-setup
$A = 'origin/main'
$B = 'feature/supabase-setup'

Write-Output "Building file lists from $A and $B..."
$filesA = git ls-tree -r --name-only $A 2>$null | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
$filesB = git ls-tree -r --name-only $B 2>$null | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
$files = ($filesA + $filesB) | Sort-Object -Unique

Write-Output "Found $($files.Count) unique paths to consider."

foreach ($f in $files) {
  # ensure directory exists
  $dir = Split-Path $f
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

  $inA = $filesA -contains $f
  $inB = $filesB -contains $f

  if (-not $inA) {
    Write-Output "$f => only in B; taking B"
  git show '$B':"$f" | Out-File -FilePath $f -Encoding utf8
    continue
  }
  if (-not $inB) {
    Write-Output "$f => only in A; taking A"
  git show '$A':"$f" | Out-File -FilePath $f -Encoding utf8
    continue
  }

  # get latest commit timestamps for this path on each branch
  $tA = git log -1 --format=%ct $A -- $f 2>$null
  $tB = git log -1 --format=%ct $B -- $f 2>$null

  if (-not $tA) {
    Write-Output "$f => no A timestamp, taking B"
  git show '$B':"$f" | Out-File -FilePath $f -Encoding utf8
    continue
  }
  if (-not $tB) {
    Write-Output "$f => no B timestamp, taking A"
  git show '$A':"$f" | Out-File -FilePath $f -Encoding utf8
    continue
  }

  if ([int]$tA -ge [int]$tB) {
    Write-Output "$f => A newer-or-equal ($tA >= $tB), taking A"
  git show '$A':"$f" | Out-File -FilePath $f -Encoding utf8
  } else {
    Write-Output "$f => B newer ($tB > $tA), taking B"
  git show '$B':"$f" | Out-File -FilePath $f -Encoding utf8
  }
}

Write-Output "Staging resolved files..."
git add -A

# commit if there are changes
$st = git status --porcelain
if ($st) {
  git commit -m "merge: resolve conflicts preferring most recent file versions from origin/main or feature/supabase-setup"
  Write-Output "Committed resolutions. Now pushing feature/supabase-setup..."
  git push -u origin feature/supabase-setup
} else {
  Write-Output "No changes to commit. Nothing to push."
}
