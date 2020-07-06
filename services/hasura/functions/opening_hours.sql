-- Inspired by: https://stackoverflow.com/a/22111524/575773

DROP FUNCTION IF EXISTS f_opening_hours_normalised_time;
CREATE OR REPLACE FUNCTION f_opening_hours_normalised_time(timestamptz)
  RETURNS timestamp AS
$func$
SELECT date '1996-01-01'
    + ($1 AT TIME ZONE 'UTC' - date_trunc('week', $1 AT TIME ZONE 'UTC'))
$func$ LANGUAGE sql IMMUTABLE;

DROP FUNCTION IF EXISTS f_opening_hours_hours;
CREATE OR REPLACE FUNCTION f_opening_hours_hours(_from timestamptz, _to timestamptz)
  RETURNS TABLE (opening_hours_range tsrange) AS
$func$
DECLARE
   ts_from timestamp := f_opening_hours_normalised_time(_from);
   ts_to   timestamp := f_opening_hours_normalised_time(_to);
BEGIN
   -- test input for sanity (optional)
   IF _to <= _from THEN
      RAISE EXCEPTION '%', '_to must be later than _from!';
   ELSIF _to > _from + interval '1 week' THEN
      RAISE EXCEPTION '%', 'Interval cannot span more than a week!';
   END IF;

   IF ts_from > ts_to THEN  -- split range at Mon 00:00
      RETURN QUERY
      VALUES (tsrange('1996-01-01 0:0', ts_to  , '[]'))
           , (tsrange(ts_from, '1996-01-08 0:0', '[]'));
   ELSE                     -- simple case: range in standard week
      opening_hours_range := tsrange(ts_from, ts_to, '[]');
      RETURN NEXT;
   END IF;

   RETURN;
END
$func$ LANGUAGE plpgsql IMMUTABLE COST 1000 ROWS 1;

DROP FUNCTION IF EXISTS is_restaurant_open(_restaurant restaurant);
CREATE OR REPLACE FUNCTION public.is_restaurant_open(_restaurant restaurant)
  RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
      FROM opening_hours
      WHERE _restaurant.id = opening_hours.restaurant_id
        AND hours @> f_opening_hours_normalised_time(now())
  );
END;
$$ LANGUAGE plpgsql STABLE

