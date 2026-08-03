SELECT
    d.full_name,
    COUNT(DISTINCT m.movie_id) AS no_of_movies,
    SUM(b.collection_cr) AS total_box_office
FROM directors d
JOIN movies m
    ON d.director_id = m.director_id
JOIN box_office b
    ON m.movie_id = b.movie_id
GROUP BY
    d.full_name
HAVING COUNT(DISTINCT m.movie_id) > 1;