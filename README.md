# Getting started

See [services/hasura/README.md](services/hasura/README.md).
See [apps/lab/README.md](apps/lab/README.md).

---

High level plan:

The general strategies that have worked for me in startups are:

1. Make the product shine, especially with better tech and smart design
2. If b2b, get early sales by "selling yourself/service"
3. One person needs to take lead on user-research/talking/selling/refining the
   idea
4. Specialize (one person owns one thing)
5. Setting a team goal for each month - important in the beginning
6. Close-the-loop - get the full thing working early but roughly!
7. Get it into hands - goes with close the loop, but basically have beta users

For Dish specifically, high level:

1. We should heavily use scraping/aggregation
2. Get small subsets working:
   1. Camera/reviews
   2. Rankings for one or two dishes we can validate
3. free form: lets just process as we go!

Initial steps:

1. We should have a sample search we start with and test against

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
