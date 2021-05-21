INSERT INTO "restaurant" (id, name, location)
VALUES('00000000-0000-0000-0000-000000000000', '_dish_internal_restaurant', st_makepoint(-122.42, 37.76))
ON CONFLICT (id) DO NOTHING;
