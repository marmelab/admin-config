install:
	@npm install

transpile:
	@mkdir -p lib/
	@rm -rf lib/*
	@./node_modules/.bin/babel src/ -d lib/ --source-maps > /dev/null

test:
	@./node_modules/mocha/bin/mocha --compilers js:babel/register --recursive tests/
