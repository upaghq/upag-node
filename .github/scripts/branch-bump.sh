#!/usr/bin/env bash
# Maps a PR branch name to a release type. Single source of truth for ci.yml and publish.yml.
# Usage: branch-bump.sh <branch-name>
# Prints one of: major | minor | patch | none | invalid
#   none    -> valid prefix that does not publish (docs/, chore/, ci/)
#   invalid -> prefix not in the convention (treated as "none" by publish, rejected by CI)
set -euo pipefail

branch="${1-}"

case "$branch" in
  major/* | breaking/*)             echo major ;;
  feat/* | feature/* | minor/*)     echo minor ;;
  fix/* | hotfix/* | patch/*)       echo patch ;;
  docs/* | chore/* | ci/*)          echo none ;;
  *)                                echo invalid ;;
esac
