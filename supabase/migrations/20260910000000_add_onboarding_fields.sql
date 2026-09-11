-- ============================================================
-- NIRNAY — Migration 002
-- Add missing fields required for financial onboarding
-- ============================================================

-- Track whether the user has finished the onboarding flow
alter table public.user_profiles
add column if not exists onboarding_completed boolean not null default false;

-- Add currency and raw income representation to financial profiles
alter table public.financial_profiles
add column if not exists base_currency text not null default 'INR',
add column if not exists base_income_amount numeric(14,2),
add column if not exists base_income_frequency text
  check (
    base_income_frequency is null
    or base_income_frequency in (
      'monthly',
      'weekly',
      'biweekly',
      'yearly',
      'irregular'
    )
  );

-- The existing monthly_income and monthly_expenses will be populated
-- by the application tier during onboarding by normalizing the input.
