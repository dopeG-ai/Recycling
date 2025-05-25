@echo off
set NPM_PATH="C:\Program Files\nodejs\npm.cmd"
echo Starting Backend Server...
cd src\Back-end
%NPM_PATH% install
%NPM_PATH% run dev
pause
