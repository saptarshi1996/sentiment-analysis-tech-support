rabbitsql:
	docker compose up rabbitmq mysql --force-recreate --build -d

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
