install:
	@npm install

test:
	@./node_modules/mocha/bin/mocha --compilers js:babel/register --recursive tests/
