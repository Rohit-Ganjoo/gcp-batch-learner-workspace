select title,release_year
from movies
where release_year>2020 and language is "English"
order by release_year desc