FROM python:3.11

ARG API_PORT=80

WORKDIR /app

COPY ./src/ /app/
COPY ./schema.graphql /app/ 
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements_docker.txt
 
CMD ["python", "main.py"]
