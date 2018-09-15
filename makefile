.PHONY: all
all: copy
	npm --prefix ethreddit start

.PHONY: copy
copy:
	cp build/contracts/Forum.json ethreddit/src/contracts/Forum.json

