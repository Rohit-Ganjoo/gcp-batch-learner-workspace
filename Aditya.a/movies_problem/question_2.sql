select genre,sum(collection_cr) as total_collection,
avg(rating) as avg_rating
from movies m join box_office b
on m.movie_id=b.movie_id
join reviews r
on b.movie_id=r.movie_id
group by genre