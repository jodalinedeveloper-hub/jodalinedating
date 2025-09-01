-- Drop the existing, faulty policy for inserting messages
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;

-- Recreate the policy with the correct security check, allowing users to send messages in their matches
CREATE POLICY "Users can send messages in their matches"
ON public.messages
FOR INSERT TO authenticated
WITH CHECK (is_part_of_match(match_id) AND auth.uid() = sender_id);