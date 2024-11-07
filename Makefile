setup:
	sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
	sudo chmod +x /usr/local/bin/dbmate

db-dump:
	mysqldump --column-statistics=0 -h127.0.0.1 -uroot -proot1234 taskmgment --skip-comments > ./db/schema.sql

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down