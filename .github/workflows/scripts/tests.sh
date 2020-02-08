#!/usr/bin/env bash
set -e

yarn workspaces run build
yarn workspaces run test
