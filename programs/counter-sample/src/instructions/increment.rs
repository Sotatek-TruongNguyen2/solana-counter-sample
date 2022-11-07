use crate::state::counter::Counter;
use crate::errors::CounterError;
use crate::counter_emit;
use crate::events::{IncrementLog, mango_emit_stack};
use anchor_lang::prelude::*;

pub fn increment(ctx: Context<Increment>, step: u128) -> Result<()> {
    ctx.accounts.counter.increment(step)?;
    let counter: &Account<Counter> = &ctx.accounts.counter;

    counter_emit!(
        IncrementLog {
            counter_account: counter.key(),
            current_val: counter.count,
            step
        }
    );

    // mango_emit_stack::<_, 256>(
    //     IncrementLog {
    //         counter_account: counter.key(),
    //         current_val: counter.count,
    //         step
    //     }
    // );
    Ok(())
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut,
        constraint = counter.authority == authority.key() @CounterError::NotAuthorized,
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
