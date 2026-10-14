# Contributing

## Release flow

Releases are fully automatic. There is no manual `npm publish` and no version bump commit.

```
branch → PR → CI → merge to main → publish
```

1. Create a branch whose name starts with one of the prefixes below.
2. Open a PR against `main`. `ci.yml` validates the branch name, then runs `npm ci`, `npm test`, `npm run build` and `npm pack --dry-run`.
3. Merge the PR (squash is fine).
4. `publish.yml` runs on the push to `main`, finds the merged PR's branch, bumps the version, publishes to npm and pushes the `vX.Y.Z` tag.

## Branch names

| Prefix | Release |
| --- | --- |
| `major/*`, `breaking/*` | major (`1.2.3` → `2.0.0`) |
| `feat/*`, `feature/*`, `minor/*` | minor (`1.2.3` → `1.3.0`) |
| `fix/*`, `hotfix/*`, `patch/*` | patch (`1.2.3` → `1.2.4`) |
| `docs/*`, `chore/*`, `ci/*` | no release |

Any other prefix fails CI. A push to `main` with no associated PR (a direct push) never publishes.

The mapping lives in `.github/scripts/branch-bump.sh`, shared by both workflows.

## Where the version comes from

The source of truth is the **latest git tag `v*`**, not `package.json`. The workflow does not commit back to `main`: on the runner it sets `package.json` to the last tag's version, applies the bump, publishes, then tags the commit.

So the `version` in the repo's `package.json` can be stale. Check the real version with `git tag --list 'v*' --sort=-v:refname | head -1` or `npm view upag version`.

Safety nets:

- No `v*` tag exists: the publish run fails ("Nenhuma tag v* encontrada…"). It never falls back to `v0.0.0`.
- The computed version already exists on npm: the publish run fails before publishing.

## Publishing auth

Publishing uses npm Trusted Publishing (OIDC) with provenance. There is no `NPM_TOKEN`. The trusted publisher is registered on npmjs.com for `upaghq/upag-node`, workflow `publish.yml`, no environment.

## Changelog

`CHANGELOG.md` is still edited by hand. Add entries under `[Unreleased]` in your PR and move them under the new version heading when you want to cut one.
