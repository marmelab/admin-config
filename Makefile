install:
	@npm install

test:
	@./node_modules/mocha/bin/mocha --compilers js:mocha-traceur --recursive tests/
