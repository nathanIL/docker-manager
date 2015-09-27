
	
build:	clean
	virtualenv -p python2.7 environment
	source environment/bin/activate && pip install -r requirements.txt
	bower install

clean:
	rm -rf static/assets/public/*;
	rm -rf environment/

prereq: clean build
	source environment/bin/activate && python manage.py prerequisites

run: prereq
	source environment/bin/activate && python manage.py runserver