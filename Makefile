init:
	pip3 install -r requirements.txt
	cd client && npm install
	docker compose up rabbitmq mysql -d

rabbitsql:
	docker compose up rabbitmq mysql

dev:
	docker compose up --force-recreate --build -d

down:
	docker compose down

inpip:
	pip3 install -r requirements.txt
