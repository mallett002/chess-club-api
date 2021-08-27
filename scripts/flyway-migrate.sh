#!/bin/bash

flyway_script_path=$(cd "$(dirname "${0}")" ; cd ../infrastructure/postgres ; pwd -P)

echo "migrating database"

flyway migrate -user=flyway -password=flyway_ps -connectRetries=10 -url='jdbc:postgresql://127.0.0.1:5432/chess-club-api' -locations=filesystem:${flyway_script_path}/migrations

echo "finished migration."
