import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { createInitializeMintInstruction } from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
import { CounterSample } from "../target/types/counter_sample";
import CounterIDL from "../target/idl/counter_sample.json";

type Keypair = anchor.web3.Keypair;

describe("counter-sample", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const mintAddress = new anchor.web3.PublicKey(
    "FJfMvYbETMNfKEUHPYDWbzXHtwFQBugN57SzbUvkJutV"
  );

  const program = anchor.workspace.CounterSample as Program<CounterSample>;

  let first_counter: Keypair;
  let second_counter: Keypair;

  it("Is initialized!", async () => {
    // const nft = await metaplex.nfts().findByMint({ mintAddress });
    // console.log(nft);
    first_counter = anchor.web3.Keypair.generate();
    second_counter = anchor.web3.Keypair.generate();

    const signature = await program.provider.connection.requestAirdrop(
      program.provider.publicKey,
      900000000000000
    );
    await program.provider.connection.confirmTransaction(signature);
    console.log("AIRDROP SUCCESSFUL!");

    let accInfo = await anchor
      .getProvider()
      .connection.getAccountInfo(
        new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      );
    console.log(accInfo);

    const tx = await program.methods
      .setupCounter()
      .accounts({
        authority: program.provider.publicKey,
        counter: first_counter.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([first_counter])
      .rpc();

    const step = new anchor.BN(1);

    const resp = await program.methods
      .increment(step)
      .accounts({
        authority: program.provider.publicKey,
        counter: first_counter.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc({
        preflightCommitment: "processed",
        commitment: "confirmed",
      });

    // const counter_account = await program.account.counter.fetch(first_counter.publicKey);
    // console.log(counter_account);

    const tx_details = await program.provider.connection.getTransaction(resp, {
      commitment: "confirmed",
    });

    const log = tx_details.meta.logMessages[3].split("Program data: ")[1];
    const coder = new anchor.BorshEventCoder(CounterIDL);

    console.log(coder.decode(log));
  });
});
