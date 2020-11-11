with centers as (
  select st_centroid(wkb_geometry) as center, ogc_fid, nhood
  from zcta5
  where nhood is not null
)

insert into nhood_labels (
  center,
  ogc_fid,
  name
)
select
  centers.center,
  centers.ogc_fid,
  centers.nhood
from centers
