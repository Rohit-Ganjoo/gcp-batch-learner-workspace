

#QUESTION 1: 1. List Comprehension ---

# You can use players_df here
username_list = players_df['username'].tolist()

# Write your code here:

# List comprehension

real_players = [username for username in username_list if not username.startswith('bot_')]

print(real_players)

real_players = [u for u in username_list if not u.startswith('bot_')]
print(real_players)

# QUESTION 2: 2. Pandas Basics ---
# Write your code here:
# Filter sessions with duration greater than 100 minutes
hardcore_sessions = sessions_df[sessions_df["duration_mins"] > 100]

# Print the result
print(hardcore_sessions)


#QUESTION 3: 3. Pandas Grouping ---

total_duration = (
    sessions_df.groupby("player_id", as_index=False)["duration_mins"]
    .sum()
)

print(total_duration)



#QUESTION 4: 4. Pandas Joining ---
# Write your code here:
import pandas
merged_df=pandas.merge(sessions_df,players_df,on="player_id",how="inner")
print(merged_df.head())


#QUESTION 5: 5. Function Apply ---
# Write your code here:

# Function to calculate engagement tier

def calculate_bonus(duration):
    if duration > 60:
        return "High"
    else:
        return "Low"


sessions_df["engagement_tier"] = sessions_df["duration_mins"].apply(calculate_bonus)
print(sessions_df)



#QUESTION 6: 6. Data Cleaning ---
# Write your code here:

sessions_df["xp_gained"].fillna(0, inplace=True)

# Print the updated dataframe
print(sessions_df)



# QUESTION 7: 7. String Manipulation ---
# Write your code here:

players_df["username"] = players_df["username"].str.upper()

# Print the updated dataframe
print(players_df)


#QUESTION 8: 8. Time Series / Dates ---
# Write your code here:
# Convert the date column to datetime
sessions_df["date"] = pd.to_datetime(sessions_df["date"])

# Extract the month
sessions_df["month"] = sessions_df["date"].dt.month

# Print the updated dataframe
print(sessions_df)
