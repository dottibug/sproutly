INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('basil', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('basil', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('basil', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bergamot', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bergamot', NULL, 'direct_sow', ARRAY['spring','fall']::text[], ARRAY[4,10]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bergamot', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('borage', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('chamomile', NULL, 'direct_sow', ARRAY['spring','summer','fall']::text[], ARRAY[4,5,6,9,10]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('chives', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('chives', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[4,5,6,8,9]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('chives', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cilantro', NULL, 'direct_sow', ARRAY['winter','spring','summer']::text[], ARRAY[3,4,5,6,7,8,9]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('dill', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[5,6,7,8]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lavender', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lavender', NULL, 'direct_sow', ARRAY['winter','spring']::text[], ARRAY[3,4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lavender', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lemon balm', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lemon balm', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[4,5,6,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lemon balm', NULL, 'transplant', ARRAY['winter','spring']::text[], ARRAY[3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('mint', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('mint', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('mint', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('oregano', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[2,3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('oregano', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('oregano', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('parsley', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[4,5,6,7,8]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rosemary', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[2,3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rosemary', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rosemary', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sage', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[2,3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sage', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sage', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('savory', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('savory', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('savory', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('shiso', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('shiso', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('shiso', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('thyme', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[2,3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('thyme', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('thyme', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bean', 'bush_pole', 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[5,6,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bean', 'broad', 'direct_sow', ARRAY['winter','spring','summer','fall']::text[], ARRAY[2,3,4,9,10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('beet', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[4,5,6,7,8]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('broccoli', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('broccoli', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('broccoli', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cabbage', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cabbage', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cabbage', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('carrot', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[4,5,6,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cauliflower', NULL, 'start_indoors', ARRAY['winter','spring','summer']::text[], ARRAY[3,4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cauliflower', NULL, 'transplant', ARRAY['spring','summer']::text[], ARRAY[4,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('corn', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cucumber', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cucumber', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cucumber', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('eggplant', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('eggplant', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('kale', NULL, 'direct_sow', ARRAY['winter','spring','summer']::text[], ARRAY[3,4,5,6,7]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lettuce', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lettuce', NULL, 'direct_sow', ARRAY['spring','summer']::text[], ARRAY[5,6,7,8]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('lettuce', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('melon', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('melon', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('onion', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('onion', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('onion', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pea', NULL, 'direct_sow', ARRAY['winter','spring','summer']::text[], ARRAY[2,3,4,5,7,8]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pepper', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pepper', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pumpkin', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pumpkin', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('pumpkin', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('radish', NULL, 'direct_sow', ARRAY['winter','spring','summer']::text[], ARRAY[3,4,5,8,9]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('spinach', NULL, 'direct_sow', ARRAY['winter','spring','summer']::text[], ARRAY[3,4,5,6,8,9]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('squash', NULL, 'start_indoors', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('squash', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('squash', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('tomato', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('tomato', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('agastache', NULL, 'start_indoors', ARRAY['winter','spring']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('agastache', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('agastache', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('alyssum', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('alyssum', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('alyssum', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bellis', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bellis', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('bellis', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('calendula', NULL, 'direct_sow', ARRAY['winter','spring','summer','fall']::text[], ARRAY[3,4,5,9,10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('california poppy', NULL, 'direct_sow', ARRAY['spring','fall']::text[], ARRAY[4,10]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('columbine', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('columbine', NULL, 'direct_sow', ARRAY['fall']::text[], ARRAY[10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('columbine', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cornflower', NULL, 'direct_sow', ARRAY['winter','spring','fall']::text[], ARRAY[3,4,5,10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cosmos', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cosmos', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('cosmos', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('echinacea', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('echinacea', NULL, 'direct_sow', ARRAY['spring','fall']::text[], ARRAY[5,6,10]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('echinacea', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('eucalyptus', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('eucalyptus', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('foxglove', NULL, 'start_indoors', ARRAY['winter','fall']::text[], ARRAY[1,12]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('foxglove', NULL, 'direct_sow', ARRAY['spring','fall']::text[], ARRAY[4,10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('foxglove', NULL, 'transplant', ARRAY['winter']::text[], ARRAY[3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('marigold', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('marigold', NULL, 'direct_sow', ARRAY['winter','spring']::text[], ARRAY[3,4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('marigold', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('nasturtium', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('nasturtium', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('nasturtium', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('viola', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('viola', NULL, 'direct_sow', ARRAY['spring','summer','fall']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('viola', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[6,7,8,9,10]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('poppy', NULL, 'direct_sow', ARRAY['winter','spring']::text[], ARRAY[2,3,4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rudbeckia', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rudbeckia', NULL, 'direct_sow', ARRAY['winter','spring']::text[], ARRAY[3,4,5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('rudbeckia', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('snapdragon', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('snapdragon', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('snapdragon', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sunflower', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sweet_pea', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2,3]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sweet_pea', NULL, 'direct_sow', ARRAY['spring','fall']::text[], ARRAY[4,5,9,10,11]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('sweet_pea', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('zinnia', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('zinnia', NULL, 'direct_sow', ARRAY['spring']::text[], ARRAY[4,5,6]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('zinnia', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[4]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('strawberry', NULL, 'start_indoors', ARRAY['winter']::text[], ARRAY[1,2]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;

INSERT INTO public.planting_actions (plant, variant, action, seasons, months)
  VALUES ('strawberry', NULL, 'transplant', ARRAY['spring']::text[], ARRAY[5]::integer[])
  ON CONFLICT (plant, variant, action) DO NOTHING;