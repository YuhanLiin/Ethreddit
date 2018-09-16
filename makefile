.PHONY: all
all: ethreddit/src/contracts/Forum.json
	npm --prefix ethreddit start

ethreddit/src/contracts/Forum.json: build/contracts/Forum.json
	cp build/contracts/Forum.json ethreddit/src/contracts/Forum.json
	
build/contracts/Forum.json: contracts/Forum.sol
	truffle compile

