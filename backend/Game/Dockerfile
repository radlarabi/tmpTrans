FROM python:latest


WORKDIR /Game

COPY requirements.txt .
COPY migrate.sh .
RUN	pip3 install -r requirements.txt && chmod +x ./migrate.sh

COPY . /Game/
	

CMD [ "bash", "/Game/migrate.sh" ]
# CMD ["tail", "-f", "/dev/null"]

