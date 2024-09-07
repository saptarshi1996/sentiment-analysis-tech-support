init:
	pip3 install -r requirements.txt
	docker compose up --force-recreate --build -d

down:
	docker compose down

rnwr:
	uvicorn worker.main:app --reload --port 8080 --log-level debug

rnapi:
	uvicorn api.main:app --reload --port 8081 --log-level debug

# Run install
inpip:
	pip3 install -r requirements.txt
