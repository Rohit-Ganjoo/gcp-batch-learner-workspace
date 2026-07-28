-- StrikeZone Analytics Challenge (27th July, 2026)

-- q1

select p.full_name, t.team_name, p.role
from players p
join teams t
on p.team_id = t.team_id
where p.nationality = 'Indian' and p.role = 'Batsman'

--q2

select t.team_name, sum(i.runs_scored) as total_runs_scored, 
round(sum(i.runs_scored) * 100.0 / sum(i.balls_faced),2) as team_strike_rate
from teams t
join players p
on t.team_id = p.team_id
join innings i
on p.player_id = i.player_id
group by t.team_name

-- q3

select p.full_name, t.team_name, count(i.match_id) as matches_played, sum(i.runs_scored) as total_runs
from players p
join teams t
on p.team_id = t.team_id
join innings i
on p.player_id = i.player_id
group by p.player_id, p.full_name
having matches_played > 2;

-- q4

with player_table as (
    select p.player_id, p.full_name as player_name, p.team_id, t.team_name,
    sum(i.runs_scored) as total_runs
    from players p
    join teams t
    on p.team_id = t.team_id
    join innings i
    on p.player_id = i.player_id
    group by p.player_id, p.full_name
)
select player_name, team_name, total_runs, 
       rank() over (partition by team_id order by total_runs desc) as team_rank,
       round(total_runs * 100.0 / sum(total_runs) over (partition by team_id),2) as percent_team_runs
from player_table;
