@echo off
@REM To validate on windows
@REM call npm list -g | grep lighthouse-plugin-ecoindex | grep -Eo '[0-9]{1,}.[0-9]{1,}.[0-9]{1,}'
@echo off
for /f "tokens=*" %%i in ('npm list -g ^| findstr lighthouse-plugin-ecoindex') do (
    for /f "tokens=1,2,3 delims=." %%a in ("%%i") do (
        echo %%a.%%b.%%c
    )
)