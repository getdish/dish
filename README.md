# Getting started

- See [services/hasura/README.md](services/hasura/README.md).
- See [apps/web/README.md](apps/web/README.md).

Basically:

```
cd services/hasura
hasura migrate apply --endpoint http://localhost:8080 --admin-secret=password
yarn start
```

```
cd apps/web && yarn start
```

---

## Repo encrypted credentials

To access the secure credentials in this repo, you will need to decrypt them.

- Install [git-crypt](https://github.com/AGWA/git-crypt).
- If you're GPG key hasn't been added to the repo then ask your nearest Dish dev to either be added to the repo or ask for the decryption key.
- If you're GPG key is in the repo and you have `git-crypt` installed, then just use the repo as normal.
- If you're using the raw decryption key it will likely be base64 encoded for ease of communication. If the key ends with a "==" this means you can run `base64 -d [long string of random character==]` to get the raw key.
- Copy the raw key to a file, eg `/tmp/master/key`
- Within the path of the repo run `git-crypt unlock /tmp/master/key`
- You can now just use `git` as normal, all the encryption/decryption happens
  automatically with hooks and filters.

---

Random notes

- get crawlers to insert into postgres on job complete
- "pho in sf" webapp
- image-crawlers (instagram + deliver service apps)
- delivery-crawlers
