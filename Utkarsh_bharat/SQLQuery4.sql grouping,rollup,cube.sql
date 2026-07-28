SELECT
    l.region,
    l.state,
    l.city,
   round( SUM(ex_t.sales_amount),2) AS total_sales
FROM ex_locations l
JOIN ex_customers ex_c
    ON l.postal_code = ex_c.postal_code
JOIN ex_orders ex_o
    ON ex_c.customer_id = ex_o.customer_id
JOIN ex_transactions ex_t
    ON ex_o.order_id = ex_t.order_id
WHERE ex_o.order_status = 'delivered'
GROUP BY ROLLUP (l.region, l.state, l.city)



SELECT
    l.region,
    l.state,
    l.city,
    round(SUM(ex_t.sales_amount),2) AS total_sales
FROM ex_locations l
JOIN ex_customers ex_c
    ON l.postal_code = ex_c.postal_code
JOIN ex_orders ex_o
    ON ex_c.customer_id = ex_o.customer_id
JOIN ex_transactions ex_t
    ON ex_o.order_id = ex_t.order_id
WHERE ex_o.order_status = 'delivered'
GROUP BY CUBE (l.region, l.state, l.city)


SELECT
    l.region,
    l.state,
    l.city,
    round(SUM(ex_t.sales_amount),2) AS total_sales
FROM ex_locations l
JOIN ex_customers ex_c
    ON l.postal_code = ex_c.postal_code
JOIN ex_orders ex_o
    ON ex_c.customer_id = ex_o.customer_id
JOIN ex_transactions ex_t
    ON ex_o.order_id = ex_t.order_id
WHERE ex_o.order_status = 'delivered'
GROUP BY GROUPING SETS (
    (l.region, l.state, l.city),
    (l.region, l.state),
    (l.region),
    ()
)
