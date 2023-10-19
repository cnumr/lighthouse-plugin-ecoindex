echo "ADD-SSH-KEY STARTING ⏳"
for possiblekey in ${HOME}/.ssh/id_*; do
    if grep -q PRIVATE "$possiblekey"; then
        ssh-add "$possiblekey"
    fi
done
echo "ADD-SSH-KEY ENDED 🎉"