CREATE OR REPLACE VIEW public.matches_with_last_message AS
SELECT
  m.id,
  m.user1_id,
  m.user2_id,
  m.created_at,
  last_msg.content AS last_message_content,
  last_msg.created_at AS last_message_created_at,
  last_msg.sender_id AS last_message_sender_id
FROM
  public.matches m
LEFT JOIN LATERAL (
  SELECT
    msg.content,
    msg.created_at,
    msg.sender_id
  FROM
    public.messages msg
  WHERE
    msg.match_id = m.id
  ORDER BY
    msg.created_at DESC
  LIMIT 1
) last_msg ON true;