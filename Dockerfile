FROM node:lts

RUN apt-get -y update && apt-get -y install qpdf && apt-get -y install exiftool
