@echo off
cd /d "%~dp0"
call npm install
call npm install axios react-router-dom react-hot-toast @heroicons/react
call npm install -D tailwindcss@3 postcss autoprefixer
call npx tailwindcss init -p
echo DONE > install_done.txt
