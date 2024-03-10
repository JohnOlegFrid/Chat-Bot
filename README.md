# ChatBot

Chat room with minor bot capabilities.

## Installation

To run the project:
open your terminal and go to the project folder.

First you need to run an ElasticSearch instance:

1. Install Docker
2. Create a new docker network.

```bash
docker network create elastic
```

3. Pull the Elasticsearch Docker image.

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.12.1
```

4. Start an Elasticsearch container.

```bash
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.1
```

5. Copy the generated elastic password. It is shown when you start Elasticsearch for the first time. You can regenerate it using the following command.

```bash
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
```

To regenerate Kibana enrollment token use this command:

```bash
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

6. Go into the server folder and run

```bash
npm run start <ELASTIC_PASSWORD>
```

you can also set the password in the .env file under the ELASTIC_PASSWORD variable.

7. Go into the client folder and run

```bash
ng serve
```
