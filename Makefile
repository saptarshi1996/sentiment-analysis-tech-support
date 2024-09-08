init:
	pip3 install -r requirements.txt
	cd client && npm install
	docker compose up rabbitmq mysql -d

fe:
	cd client && docker build . -t client
	docker run -p 3000:80 client

rabbitsql:
	docker compose up rabbitmq mysql

dev:
	docker compose up --force-recreate --build -d

down:
	docker compose down

inpip:
	pip3 install -r requirements.txt

lgapi:
	docker compose logs api -f

lgwrk:
	docker compose logs worker -f

lgsk:
	docker compose logs websocket -f
