
CREATE OR REPLACE FUNCTION public.set_slug_from_title() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  standard varchar := slugify(NEW.name);
  with_city varchar := slugify(concat(NEW.name, '-', NEW.city));
  with_address varchar = slugify(concat(NEW.name, '-', NEW.city, '-', NEW.address));
BEGIN
  IF EXISTS (SELECT FROM restaurant WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT FROM restaurant WHERE slug = standard) THEN
    IF EXISTS (SELECT FROM restaurant WHERE slug = with_city) THEN
      IF EXISTS (SELECT FROM restaurant WHERE slug = with_address) THEN
        NEW.slug := gen_random_uuid();
      ELSE
        NEW.slug := with_address;
      END IF;
    ELSE
      NEW.slug := with_city;
    END IF;
  ELSE
    NEW.slug := standard;
  END IF;
  RETURN NEW;
END
$$;