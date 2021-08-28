FROM postgres:alpine3.14

ADD init-db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

CMD ["postgres"]