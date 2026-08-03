-- Generate Calendar for 2026 using Recursive CTE

WITH RECURSIVE calendar_2026 AS (
    -- Base case: Start with January 1, 2026
    SELECT 
        CAST('2026-01-01' AS DATE) AS date_val,
        YEAR('2026-01-01') AS year_val,
        MONTH('2026-01-01') AS month_val,
        DAY('2026-01-01') AS day_val,
        DATENAME(MONTH, '2026-01-01') AS month_name,
        DATENAME(WEEKDAY, '2026-01-01') AS day_name,
        DATEPART(WEEK, '2026-01-01') AS week_num,
        DATEPART(QUARTER, '2026-01-01') AS quarter_num
    
    UNION ALL
    
    -- Recursive case: Add one day until end of 2026
    SELECT 
        DATEADD(DAY, 1, date_val),
        YEAR(DATEADD(DAY, 1, date_val)),
        MONTH(DATEADD(DAY, 1, date_val)),
        DAY(DATEADD(DAY, 1, date_val)),
        DATENAME(MONTH, DATEADD(DAY, 1, date_val)),
        DATENAME(WEEKDAY, DATEADD(DAY, 1, date_val)),
        DATEPART(WEEK, DATEADD(DAY, 1, date_val)),
        DATEPART(QUARTER, DATEADD(DAY, 1, date_val))
    FROM calendar_2026
    WHERE YEAR(date_val) = 2026 AND date_val < CAST('2026-12-31' AS DATE)
)
SELECT 
    date_val,
    year_val,
    month_val,
    day_val,
    month_name,
    day_name,
    week_num,
    quarter_num
FROM calendar_2026
ORDER BY date_val;