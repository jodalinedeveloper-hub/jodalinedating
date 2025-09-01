DO $$
DECLARE
  user_a_id UUID;
  user_b_id UUID;
  user1 UUID;
  user2 UUID;
BEGIN
  -- Find the first two users in the system
  SELECT id INTO user_a_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO user_b_id FROM auth.users WHERE id != user_a_id ORDER BY created_at ASC LIMIT 1;

  -- Proceed only if we found two distinct users
  IF user_a_id IS NOT NULL AND user_b_id IS NOT NULL THEN
    -- Ensure user1_id < user2_id to satisfy the table constraint
    IF user_a_id < user_b_id THEN
      user1 := user_a_id;
      user2 := user_b_id;
    ELSE
      user1 := user_b_id;
      user2 := user_a_id;
    END IF;

    -- Record that User A 'liked' User B
    INSERT INTO public.swipes (swiper_id, swiped_id, action)
    VALUES (user_a_id, user_b_id, 'like')
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;

    -- Record that User B 'liked' User A
    INSERT INTO public.swipes (swiper_id, swiped_id, action)
    VALUES (user_b_id, user_a_id, 'like')
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;

    -- Create the match record between them
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (user1, user2)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;
END $$;