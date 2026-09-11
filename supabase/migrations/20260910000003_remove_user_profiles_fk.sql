-- ============================================================
-- NIRNAY — Migration 003
-- Remove user_profiles foreign key dependencies from financial tables
-- to completely decouple onboarding from user_profiles.
-- ============================================================

-- 1. Drop the FK from financial_profiles -> user_profiles
ALTER TABLE public.financial_profiles 
  DROP CONSTRAINT IF EXISTS financial_profiles_user_id_fkey;

-- 2. Drop the FK from financial_goals -> user_profiles
ALTER TABLE public.financial_goals 
  DROP CONSTRAINT IF EXISTS financial_goals_user_id_fkey;
