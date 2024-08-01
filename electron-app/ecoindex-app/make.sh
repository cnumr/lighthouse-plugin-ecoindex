echo "make is starting 🧩"
echo "clean out folder"
npm run clean:out
# echo "make -- --arch=x64 --platform=win32"
# npm run make:win32:x64
# echo "make -- --arch=arm64 --platform=win32"
# npm run make:win32:arm64
echo "make -- --arch=arm64 --plateform=darwin"
npm run make:darwin:arm64
echo "make -- --arch=x64 --plateform=darwin"
npm run make:darwin:x64
echo "Make ar done 🚀"