cd "C:\Users\C839184\repos\Misc\2020seve"

for /r %%f in (*.EV*) do (
   BEVENT.EXE -y 2020 -f 0-6,8-9,12-13,16-17,26-40,43-45,51,58-61,66-68,75-79 %%~nxf > C:\Users\C839184\repos\Misc\data\txt\%%~nxf.txt
)
pause