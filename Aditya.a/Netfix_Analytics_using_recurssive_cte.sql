with MoviePath as
(
    -- Anchor: First movie in the chain
    select
        date,
        user_id,
        from_movie,
        to_movie,
        from_movie || ' > ' || to_movie as pathway
    from ViewingHistory m
    where from_movie not in
    (
        select to_movie
        from ViewingHistory
        where user_id = m.user_id
          and date = m.date
    )

    UNION ALL

    -- Recursive: Keep extending the path
    select
        m.date,
        m.user_id,
        m.from_movie,
        m.to_movie,
        mp.pathway || ' > ' || m.to_movie
    from ViewingHistory m
    join MoviePath mp
      on m.user_id = mp.user_id
     and m.date = mp.date
     and m.from_movie = mp.to_movie
)

select date,
       user_id,
       pathway
from MoviePath mp
where not exists
(
    select 1
    from ViewingHistory v
    where v.user_id = mp.user_id
      and v.date = mp.date
      and v.from_movie = mp.to_movie
)
order by date, user_id;