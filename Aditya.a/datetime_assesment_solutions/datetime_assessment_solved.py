# QUESTION 1: 1. String Parsing ---

orders_df['order_purchase_date'] = pd.to_datetime(orders_df['order_purchase_date'])
orders_df['order_purchase_date'].dtypes
print(orders_df['order_purchase_date'])



# QUESTION 2: 2. Coercing Errors ---

# Write your code here:

import pandas as pd

deliveries_df['order_delivered_date'] = pd.to_datetime(deliveries_df['order_delivered_date'], errors='coerce')
print(deliveries_df['order_delivered_date'])



# QUESTION 3: 3. Merging ---

# Write your code here:

import pandas as pd
merged_df=pd.merge(orders_df,deliveries_df,on='order_id')
print(merged_df)



#QUESTION 4: 4. Time Deltas ---

# Write your code here:

import pandas as pd
merged_df=pd.merge(orders_df,deliveries_df,on='order_id')
merged_df['delivery_time']=(merged_df['order_delivered_date']-merged_df['order_purchase_date'])
print(merged_df)



# QUESTION 5: 5. Component Extraction (Year) ---

# Write your code here:

import pandas as pd
merged_df['purchase_year']=merged_df['order_purchase_date'].dt.year
print(merged_df)

\

#QUESTION 6: 6. Component Extraction (Day Name) ---

# Write your code here:

merged_df['purchase_day']=merged_df['order_purchase_date'].dt.day_name()
print(merged_df)



#QUESTION 7: 7. Boolean Flags (Weekend) ---

# Write your code here:

merged_df['is_weekend'] = merged_df['order_purchase_date'].dt.dayofweek >= 5

print(merged_df)




#QUESTION 8: 8. String Formatting ---
# Write your code here:

merged_df['formatted_date'] = merged_df['order_purchase_date'].dt.strftime('%Y/%m/%d')

print(merged_df)



# QUESTION 9: 9. Time Periods ---

# Write your code here:

merged_df['purchase_month_bucket'] = merged_df['order_purchase_date'].dt.to_period('M')

print(merged_df)



#QUESTION 10: 10. Date Sequences ---
# Write your code here:

b_days = pd.date_range(start='2026-07-01', periods=10, freq='B')

print(b_days)
