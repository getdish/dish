
CREATE FUNCTION list_populated(min_items int)
RETURNS SETOF list AS $$
    SELECT *
    FROM list 
    WHERE id IN (SELECT list_id
               FROM list_restaurant
               GROUP BY list_id HAVING COUNT(*) >= min_items)
$$ LANGUAGE sql STABLE;