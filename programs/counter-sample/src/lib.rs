pub mod state;
pub mod instructions;
pub mod errors;
pub mod events;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("DjHFsAB3dQL3wQYbBzFXDj83VCFDytN4168j5GDPGCV8");

#[program]
pub mod counter_sample {
    use super::*;

    pub fn setup_counter(ctx: Context<SetupCounter>) -> Result<()> {
        instructions::setup_counter::setup_counter(ctx)?;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>, step: u128) -> Result<()> {
        instructions::increment::increment(ctx, step)
    }
}