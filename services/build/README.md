## Buildkite Agent WIP

This runs a Buildkite agent with Docker. It usesa persistent volume for Docker layer caching.

We use this for giant Rust builds.

```
flyctl apps create buildkite-example
```

Set the Buildkite token so the agent knows which account it's talking to.
```
flyctl secrets set BUILDKITE_AGENT_TOKEN=<TOKEN>
```

We're going to do builds from GitHub, so we also add a build account's private key as a Fly secret. This is added to the `ssh-agent` in the [environment hook](./hooks/environment).
```
flyctl secrets set PRIVATE_SSH_KEY=- < ~/.ssh/github_private_ssh_key
```

```
flyctl volumes create buildkite_cache --region ord --size 50
```

```toml
[mount]
source = "buildkite_cache"
destination = "/data"

[env]
BUILDKITE_BUILD_PATH = "/data/buildkite_builds"
```