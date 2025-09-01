-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, date_of_birth, gender, orientation, location, bio, relationship_goals, age_range_min, age_range_max, max_distance, deal_breaker_smoker, lifestyle_tags)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    (new.raw_user_meta_data ->> 'dateOfBirth')::date,
    new.raw_user_meta_data ->> 'gender',
    new.raw_user_meta_data ->> 'orientation',
    new.raw_user_meta_data ->> 'location',
    new.raw_user_meta_data ->> 'bio',
    new.raw_user_meta_data ->> 'relationshipGoals',
    (new.raw_user_meta_data -> 'ageRange' ->> 0)::int,
    (new.raw_user_meta_data -> 'ageRange' ->> 1)::int,
    (new.raw_user_meta_data -> 'maxDistance' ->> 0)::int,
    (new.raw_user_meta_data -> 'dealBreakers' ->> 'smoker')::boolean,
    (SELECT array_agg(elem::text) FROM jsonb_array_elements_text(new.raw_user_meta_data -> 'lifestyleTags'))
  );
  RETURN new;
END;
$$;

-- Trigger the function after a new user is created in the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();