import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PdaTutorial } from "../target/types/pda_tutorial";
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';


describe("pda_tutorial", () => {

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.PdaTutorial as Program<PdaTutorial>;


  it("Register!", async () => {
    //Getting PDA that we are gonna use 
    const [registeredUserPDA, bump] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("party"),
          anchor.AnchorProvider.env().wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    const tx = await program.methods.register()
      .accounts({
        user: anchor.AnchorProvider.env().wallet.publicKey,
        registeredUser: registeredUserPDA,
      })
      .rpc();
    console.log("Transaction sent")
    const state = await program.account.registeredUser.fetch(registeredUserPDA);
    console.log(state);
    expect(state.bump === bump);

  });

  it("Validate!", async () => {
    //Getting PDA that we are gonna use 
    const [registeredUserPDA, bump] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("party1"),
          anchor.AnchorProvider.env().wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    // Add your test here.
    console.log("Validate");
    try {
      const tx = await program.methods.validate()
        .accounts({
          user: anchor.AnchorProvider.env().wallet.publicKey,
          registeredUser: registeredUserPDA,
        })
        .rpc();
      expect(true)
    } catch (e) {
      console.log(e)
      expect(false)
    }



  });

  it("Validate at front end only!", async () => {
    //Getting PDA that we are gonna use 
    const [registeredUserPDA, bump] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("party1"),
          anchor.AnchorProvider.env().wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    // Add your test here.
    console.log("Validate");
    try {
      const state = await program.account.registeredUser.fetch(registeredUserPDA);
      console.log(state);
      expect(state.bump === bump);
    } catch (e) {
      console.log(e)
      expect(false)
    }
  });
});





