CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _username text;
  _date_of_birth date;
  _gender text;
  _orientation text;
  _location text;
  _bio text;
  _relationship_goals text;
  _age_range_min int;
  _age_range_max int;
  _max_distance int;
  _deal_breaker_smoker boolean;
  _lifestyle_tags text[];
BEGIN
  -- Safely extract and cast each value, providing NULL as a default if an error occurs
  _username := new.raw_user_meta_data ->> 'username';
  
  BEGIN
    _date_of_birth := (new.raw_user_meta_data ->> 'dateOfBirth')::date;
  EXCEPTION WHEN others THEN
    _date_of_birth := NULL;
  END;

  _gender := new.raw_user_meta_data ->> 'gender';
  _orientation := new.raw_user_meta_data ->> 'orientation';
  _location := new.raw_user_meta_data ->> 'location';
  _bio := new.raw_user_meta_data ->> 'bio';
  _relationship_goals := new.raw_user_meta_data ->> 'relationshipGoals';

  BEGIN
    _age_range_min := (new.raw_user_meta_data -> 'ageRange' ->> 0)::int;
  EXCEPTION WHEN others THEN
    _age_range_min := NULL;
  END;

  BEGIN
    _age_range_max := (new.raw_user_meta_data -> 'ageRange' ->> 1)::int;
  EXCEPTION WHEN others THEN
    _age_range_max := NULL;
  END;

  BEGIN
    _max_distance := (new.raw_user_meta_data -> 'maxDistance' ->> 0)::int;
  EXCEPTION WHEN others THEN
    _max_distance := NULL;
  END;

  BEGIN
    _deal_breaker_smoker := (new.raw_user_meta_data -> 'dealBreakers' ->> 'smoker')::boolean;
  EXCEPTION WHEN others THEN
    _deal_breaker_smoker := NULL;
  END;

  BEGIN
    SELECT array_agg(elem::text)
    INTO _lifestyle_tags
    FROM jsonb_array_elements_text(new.raw_user_meta_data -> 'lifestyleTags');
  EXCEPTION WHEN others THEN
    _lifestyle_tags := NULL;
  END;

  INSERT INTO public.profiles (
    id, username, date_of_birth, gender, orientation, location, bio, 
    relationship_goals, age_range_min, age_range_max, max_distance, 
    deal_breaker_smoker, lifestyle_tags
  )
  VALUES (
    new.id, _username, _date_of_birth, _gender, _orientation, _location, _bio,
    _relationship_goals, _age_range_min, _age_range_max, _max_distance,
    _deal_breaker_smoker, _lifestyle_tags
  );
  
  RETURN new;
END;
$$;