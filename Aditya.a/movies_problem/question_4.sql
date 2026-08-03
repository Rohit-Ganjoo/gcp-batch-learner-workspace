SELECT
    m.title,
    m.genre,
    b.collection_cr,
    DENSE_RANK() OVER (
        PARTITION BY m.genre
        ORDER BY b.collection_cr DESC
    ) AS genre_rank,
    ROUND(
        b.collection_cr * 100.0 /
        SUM(b.collection_cr) OVER (PARTITION BY m.genre),
        2
    ) AS pct_genre_total
FROM movies m
JOIN box_office b
    ON m.movie_id = b.movie_id;