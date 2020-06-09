DROP FUNCTION IF EXISTS is_restaurant_open(_restaurant restaurant);

CREATE OR REPLACE FUNCTION public.is_restaurant_open(_restaurant restaurant)
  RETURNS boolean AS $$
DECLARE
  timezone varchar := 'America/Los_Angeles';
  today varchar;
  today_num integer;
  now timestamp;
  hours varchar;
  open timestamp;
  close timestamp;
BEGIN
  today := TO_CHAR((SELECT current_timestamp AT TIME ZONE timezone), 'YYYY-MM-DD');
  today_num := TO_CHAR((SELECT current_timestamp AT TIME ZONE timezone), 'ID')::integer - 1;
  now := (SELECT current_timestamp AT TIME ZONE timezone);
  hours := (SELECT _restaurant.hours->today_num->'hoursInfo'->'hours'->>0);
  IF hours = 'Closed' THEN
    RETURN false;
  END IF;
  open := TO_TIMESTAMP(today || ' ' || SPLIT_PART(hours, ' - ', 1), 'YYYY-MM-DD HH:MI am');
  close := TO_TIMESTAMP(today || ' ' || SPLIT_PART(hours, ' - ', 2), 'YYYY-MM-DD HH:MI am');
  RETURN now > open AND now < close;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in is_restaurant_open() - hours: %, open: %, close: %', hours, open, close;
  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE
