rm -f ./build/contracts/Auction.json ./build/contracts/TreeCoin.json 
truffle deploy
rm -f ./app/src/Auction.json
rm -f ./app/src/TreeCoin.json
cp -f ./build/contracts/Auction.json ./app/src
cp -f ./build/contracts/TreeCoin.json ./app/src
