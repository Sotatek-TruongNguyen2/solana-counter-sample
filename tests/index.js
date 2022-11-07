const IDL = require("../target/idl/counter_sample.json");// directory of copy/paste types/your_program.ts file
const anchor = require('@project-serum/anchor');

const PROGRAM_ID = "DjHFsAB3dQL3wQYbBzFXDj83VCFDytN4168j5GDPGCV8";


function getProgramInstance(connection, wallet) {
    if (!wallet.publicKey) return;
    const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        anchor.AnchorProvider.defaultOptions()
    );
    // Read the generated IDL.
    const idl = IDL;
    // Address of the deployed program.
    const programId = PROGRAM_ID;
    // Generate the program client from IDL.
    const program = new anchor.Program(idl, programId, provider);
    return program;
}

(async () => {
    const owner = anchor.web3.Keypair.fromSecretKey(
        Uint8Array.from(
            [25, 147, 104, 88, 211, 14, 214, 228, 254, 100, 17, 104, 2, 198, 228, 175, 111, 1, 78, 146, 244, 248, 114, 237, 73, 126, 57, 170, 250, 253, 47, 27, 107, 5, 181, 9, 116, 75, 101, 180, 143, 52, 184, 189, 6, 110, 72, 55, 133, 119, 94, 111, 189, 248, 201, 81, 210, 25, 247, 224, 127, 14, 216, 8]
        )
    )
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), "confirmed");
    const wallet = new anchor.Wallet(owner);
    const first_counter = anchor.web3.Keypair.generate();

    const program = await getProgramInstance(connection, wallet);
    
    const tx = await program.methods.setupCounter().accounts(
        {
            authority: program.provider.publicKey,
            counter: first_counter.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }
    ).signers([
        first_counter
    ]).rpc();

    console.log(tx);
})();