# Development docs

## How to update the website

To update https://The-Blockchain-Company.github.io/bcc-launcher/, run the
[update-gh-pages](./scripts/update-gh-pages.sh) script:

    ./scripts/update-gh-pages.sh
    git push origin gh-pages

## How to make a release

Release checklist:

1. [ ] Bump version in `package.json` and `package-lock.json`, open PR, merge.
2. [ ] Check that Buildkite and GitHub actions for `master` branch are green.
3. [ ] Check that all PRs have labels (for release notes generation).
4. [ ] Run `./scripts/tag-release.sh`.
5. [ ] `git push origin VERSION`
6. [ ] Create a new [draft release](https://github.com/The-Blockchain-Company/bcc-launcher/releases/new) containing the contents of `release-notes-VERSION.md`. Edit the text according to taste.
7. [ ] Gather release approvals then publish the GitHub release.
8. [ ] Check that the GitHub actions "release" workflow runs correctly.

After publishing the GitHub release, there should be a new NPM version
created, and the website should be updated with the latest docs from
the released version.


## How to update the bcc-wallet and bcc-node versions

Use the `niv` tool. To get it, run `nix-shell`. Then:

    niv update bcc-wallet

This will use the branches configuration in
[`nix/sources.json`](../nix/sources.json). Niv also provides options
for choosing another branch or git rev.

### bcc-node

The `bcc-node` version is set by `bcc-wallet`. To temporarily
override this version, add a source, using something like:

    niv add local $HOME/tbco/bcc-node

Once this is set, `nix-shell` should report `trace: Note: using bcc-node from ...`.

When finished, remove the source override with:

    niv drop bcc-node

## bcc-node configurations for tests

Before running tests, ensure that you have the `COLE_CONFIGS`
environment pointing to the `configuration` subdirectory of the
`bcc-node` repo.

If running in a `nix-shell`, the `COLE_CONFIGS` variable is set
automatically.

If running under Windows Powershell, do:

    $Env:COLE_CONFIGS = "E:\bcc-node\configuration"
    
## How to set up windows for testing

See the [Windows](https://github.com/The-Blockchain-Company/adrestia/wiki/Windows) page on the wiki.
