CREATE OR REPLACE FUNCTION review_score_sync() RETURNS TRIGGER AS $$
BEGIN

  IF NEW.vote IS NOT NULL THEN
    IF (NEW.restaurant_id IS NOT NULL AND NEW.tag_id IS NOT NULL) THEN
      UPDATE restaurant_tag
      SET score = COALESCE(score, 0) + NEW.vote
        WHERE restaurant_id = NEW.restaurant_id
        AND tag_id = NEW.tag_id;
    END IF;

    IF (
      NEW.restaurant_id IS NOT NULL AND (
        NEW.tag_id = '00000000-0000-0000-0000-000000000000'
        OR
        NEW.tag_id IS NULL
      )
    ) THEN
      UPDATE restaurant
      SET score = COALESCE(score, 0) + NEW.vote
        WHERE id = NEW.restaurant_id;
    END IF;
  END IF;

  RETURN NEW;
END
$$ language plpgsql;

CREATE OR REPLACE FUNCTION public.tag_triggers()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (SELECT COUNT(*) > 0 FROM tag WHERE name = NEW.name) THEN
    UPDATE tag SET is_ambiguous = TRUE
      WHERE name = NEW.name
      AND id != NEW.id
      AND is_ambiguous = FALSE;
  ELSE
    UPDATE tag SET is_ambiguous = FALSE
      AND id = NEW.id;
  END IF;

  IF NEW."displayName" IS NULL THEN
    UPDATE tag SET "displayName" = NEW.name WHERE id = NEW.id;
  END IF;

  UPDATE tag SET
    slug = new_slug.slug
  FROM (
    SELECT slugify(parent.name) || '__' || slugify(child.name) AS slug
    FROM tag child JOIN tag parent ON child."parentId" = parent.id
      WHERE child.id = NEW.id
  ) new_slug
    WHERE tag.id = NEW.id
    AND (
      tag.slug <> new_slug.slug
      OR
      tag.slug IS NULL
    );

  RETURN NEW;
END
$function$;

CREATE OR REPLACE FUNCTION public.nhood_triggers()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.slug = slugify(NEW.nhood);
  RETURN NEW;
END
$function$;

CREATE OR REPLACE FUNCTION public.region_triggers()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.slug = slugify(NEW.hrrcity);
  RETURN NEW;
END
$function$;
