const { clusterApiUrl, Connection } = require("@solana/web3.js");


const main = async () => {
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log(await connection.getTransaction("4sTkkspWHWRyiZczU9USerKQJsMPnFXMDJLZQEm5JN4PpzmXCoKKshuTGw8KGLFVyNjTe2KFfFTY1SB91XnooeEo"));
}

main();