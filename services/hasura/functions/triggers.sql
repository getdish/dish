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
