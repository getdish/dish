can add this for prometheus:

via
https://github.com/deanwilson/docker-compose-prometheus/blob/master/redis-server/docker-compose.yaml

```
redis-exporter:
    image: oliver006/redis_exporter:v0.15.0
    ports:
      - 9121:9121
    networks:
      - public
    command:
      - '--redis.addr=redis://redis-server:6379'
```
