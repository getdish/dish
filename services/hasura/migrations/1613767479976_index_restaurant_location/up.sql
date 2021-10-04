
CREATE INDEX IF NOT EXISTS restaurant_location_geo ON public.restaurant USING gist (location);