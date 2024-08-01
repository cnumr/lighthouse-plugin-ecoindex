echo "make is starting 🧩"
rm -rf out/* --y
echo "make -- --arch=x64 --platform=win32"
npm run make -- --arch=x64 --platform=win32
echo "make -- --arch=arm64 --platform=win32"
npm run make -- --arch=arm64 --platform=win32
echo "make -- --arch=arm64 --plateform=darwin"
npm run make -- --arch=arm64 --plateform=darwin
echo "Make ar done 🚀"