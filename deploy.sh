rm -f ./build/contracts/Auction.json ./build/contracts/TreeCoin.json 

a_var= truffle deploy | grep "Error"
if  [ "$a_var" = "\n" ]
then
    echo $a_var
    echo "error"
else
    rm -f ./app/src/Auction.json
    rm -f ./app/src/TreeCoin.json
    cp -f ./build/contracts/Auction.json ./app/src
    cp -f ./build/contracts/TreeCoin.json ./app/src
fi
