use anchor_lang::prelude::*;

#[account]
pub struct Counter {
    pub initialized: bool,
    pub authority: Pubkey,
    pub count: u128
}
// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const U128_LENGTH: usize = 16;
const BOOL_LENGTH: usize = 1;

impl Counter {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + U128_LENGTH + BOOL_LENGTH; 
    
    pub fn init(&mut self, authority: Pubkey) -> Result<()> {
        self.count = 0;
        self.authority = authority;
        self.initialized = true;
        Ok(())
    }

    pub fn increment(&mut self, step: u128) -> Result<u128> {
        self.count = self.count.checked_add(step).unwrap();
        Ok(self.count)
    }

    pub fn decrement(&mut self, step: u128) -> Result<u128> {
        self.count = self.count.checked_sub(step).unwrap();
        Ok(self.count)
    }
}