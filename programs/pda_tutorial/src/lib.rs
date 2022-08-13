use anchor_lang::prelude::*;

declare_id!("Bz2v4JUGL67TSW5uBTcZAYgfADjqaXHX98fLLeNEAMUq");

#[program]
pub mod pda_tutorial {
    use super::*;

    pub fn register(ctx: Context<RegisterUser>) -> Result<()> {
        let user = &mut ctx.accounts.registered_user;
        user.bump = *ctx.bumps.get("registered_user").unwrap();
        Ok(())
    }

    pub fn validate(_ctx: Context<ValidateUser>) -> Result<()>{
        Ok(())
    }
}


#[account]
pub struct RegisteredUser {
    bump: u8,
}



#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator for account  + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 1, 
        seeds = [b"party", user.key().as_ref()], bump
    )]
    pub registered_user: Account<'info, RegisteredUser>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ValidateUser<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"party", user.key().as_ref()], bump = registered_user.bump)]
    pub registered_user: Account<'info, RegisteredUser>,
}