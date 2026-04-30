@echo off
echo Auto commit in corso...

git add .
git commit -m "auto-save %date% %time%"
git push

echo ✅ Salvato automaticamente!
pause