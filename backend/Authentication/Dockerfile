FROM python:latest


WORKDIR /Authentication

COPY requirements.txt .
COPY migrate.sh .
RUN	pip3 install -r requirements.txt && chmod +x ./migrate.sh

COPY . /Authentication/
	

CMD [ "bash", "/Authentication/migrate.sh" ]
# CMD [ "bash", "migrate.sh" ]
# CMD ["tail", "-f", "/dev/null"]

