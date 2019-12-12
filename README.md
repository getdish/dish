# Dish v1 (second attempt)

Ok, restarting the repo. I did play with a lot, and learned a ton in terms of
devops. It's an awfully complex world out there.

In the end it seems either take StaffJoy repo or try Rio. I'm testing Rio now.

Rio should give us basically everything you'd want in a platform: super simple,
almost no config, and it gives you _everything_ from SSL to git-to-deploy CI/CD,
to routing, load balancing, etc. It's a "PaaS" from the guys who have been
around forever and seem popular.

~~I'm running Kubernetes locally using [Kind](https://kind.sigs.k8s.io/). It's
newer and faster than Minikube and seems to be the best choice.~~

Not anymore, just see scripts/bootstrap.sh!

---

Copy pasting old readme from old repo:

# Dish

NOTE: I'm going to restart from scratch bsaed on the MIT StaffJoyV2 monorepo.

https://github.com/LandRover/StaffjoyV2

After that:

- Postgres
- Hasura
- Setup DB Structure
- Blast/Bleve
- Postgres => Blast/Bleve service
- Crawler => Database
- App hook in initial data + search on blast
- Airflow on Kubernetes for services
  - https://kubernetes.io/blog/2018/06/28/airflow-on-kubernetes-part-1-a-different-kind-of-operator/

Crawler:

- Use instagram for photos to source first crawl tags

# Installation

install bazel

```
brew tap bazelbuild/tap
brew install bazelbuild/tap/bazel
```

### Installing Unison

I had to change a bit from StaffJoy. First you need opam. Then modify shell to
use it. Then:

```
opam switch create 3.12.1
exec $SHELL
```

Then install unison, 102 didn't work for me.

```
brew uninstall unison

```

# Status

History:

- Setup Kubernetes on DigitalOcean (DO)
- Setup RBAC and operator framework
- Setup kuberenetes-operator-manager
- Setup ExternalDNS to work with DO, verified
- Create temp domain raddi.sh as our external url, link in
- Tried postgres-operator, ran into trouble and bailed
- Tried kubedb-postgres, so far so good
- Added prometheus operator, didnt get it to link to db on last step:
  - https://kubedb.com/docs/0.9.0/guides/postgres/monitoring/using-coreos-prometheus-operator/

Now:

- Install pgAdmin and link to subdomain postgres.raddi.sh
  - see
    https://kubedb.com/docs/v0.13.0-rc.0/guides/postgres/quickstart/quickstart/
  - Have basic auth
- Gitlab
- GitKube
- GitKube => CI with gitlab? or just gitlab?
- Postgres backups
  - Test, improve, document backup and recovery cases (see kubedb)
- Simple search service (Manticore, fallback is KubeDB Elastic)
- Storage service (Rook operator)
- Hasura
- Setup Gitlab CI / CD
  - https://aarongorka.com/blog/gitlab-monorepo-pipelines/
  - Setup and have a few tests in place and working
  - Some automation with branches and pushing would be nice
- Testing Hasura with migrations
- Some sort of auth service (see hasura docs)
- Getting everything to run locally too......
- Put Postgres Operator UI into k8s behind an auth @ postgres.raddi.sh
