FROM alpine:latest
MAINTAINER Richard <nibocn@gmail.com>

WORKDIR /dist

COPY dist.tar.gz /dist
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD /entrypoint.sh
