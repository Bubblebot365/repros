FROM python: alpine3.18

WORKDIR /app

COPY requirements.txt .

RUN python -V 
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ " python" , "/app/main.py " ]