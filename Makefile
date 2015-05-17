
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/component-test phantom

lint:
	@./node_modules/.bin/jshint index.js lib test

.PHONY: clean test
