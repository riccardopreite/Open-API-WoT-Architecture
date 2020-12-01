#!/bin/bash
#getting Directory absolute path

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

cli="${SCRIPTPATH}/packages/cli/dist/cli.js"
boot="${SCRIPTPATH}/boot.js"
argument=""
for a in ${BASH_ARGV[*]} ; do
      argument+=" '$a' "
done

node $argument $cli $boot
