import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CounterSample } from "../target/types/counter_sample";

const main = async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CounterSample as Program<CounterSample>;

  const first_counter = anchor.web3.Keypair.generate();

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
}

main();