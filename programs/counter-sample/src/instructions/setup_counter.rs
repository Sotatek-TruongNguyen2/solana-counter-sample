use crate::state::counter::Counter;
use anchor_lang::prelude::*;

pub fn setup_counter(ctx: Context<SetupCounter>) -> Result<()> {
    let authority: &Signer = &ctx.accounts.authority;

    ctx.accounts.counter.init(authority.key())?;
    Ok(())
}

#[derive(Accounts)]
pub struct SetupCounter<'info> {
    #[account(init, payer = authority, space = Counter::LEN)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
