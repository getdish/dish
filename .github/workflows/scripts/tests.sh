#!/usr/bin/env bash
set -e

yarn workspaces foreach --parallel run build
yarn workspaces foreach --parallel run test
