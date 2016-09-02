install:
	@npm install

transpile:
	@mkdir -p lib/
	@rm -rf lib/*
	@./node_modules/.bin/babel src/ --out-dir lib/ --compact false --source-maps > /dev/null

test:
	@./node_modules/mocha/bin/mocha --compilers js:babel/register --recursive tests/
