-- First, remove the old, less secure policy
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;

-- Now, create the new, more secure policy
CREATE POLICY "Users can send messages in their matches"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (is_part_of_match(match_id));