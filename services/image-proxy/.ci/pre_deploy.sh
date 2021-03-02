#!/bin/bash

set -e pipefile

flyctl secrets set \
  VIRTUAL_HOST=images.dishapp.com || true
