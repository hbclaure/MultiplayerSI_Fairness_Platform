import os
import csv
import pandas as pd

def map_game_number(game_number):
    mapping = {"3": "1", "4": "2", "5": "3"}
    return mapping.get(game_number, game_number)

def map_condition_to_support(condition):
    mapping = {'A': 'human', 'B': 'shutter', 'C': 'human', 'D': 'shutter'}
    return mapping.get(condition, 'N/A')

def map_condition_and_game_to_order(row):
    condition, game_number = row['Condition'], row['GameNumber']
    mapping = {
        ('A', '1'): 'equal_support',
        ('B', '1'): 'equal_support',
        ('C', '1'): 'equal_support',
        ('D', '1'): 'equal_support',
        ('A', '2'): 'early_unfairness',
        ('A', '3'): 'late_unfairness',
        ('B', '2'): 'early_unfairness',
        ('B', '3'): 'late_unfairness',
        ('C', '2'): 'late_unfairness',
        ('C', '3'): 'early_unfairness',
        ('D', '2'): 'late_unfairness',
        ('D', '3'): 'early_unfairness',
    }
    return mapping.get((condition, game_number), 'N/A')


final_data_list = []

# Walk through the folder tree
for dirpath, dirnames, filenames in os.walk('.'):
    for filename in filenames:
        if filename.endswith('.csv'):
            folders = dirpath.split(os.sep)
            csv_file_path = os.path.join(dirpath, filename)
            
            if filename.startswith('survey_g'):
                unique_id = folders[-1][1:]
                game_number = filename.split('_')[1][1:].rstrip('.csv')
                with open(csv_file_path, 'r') as f:
                    csv_reader = csv.reader(f)
                    for row in csv_reader:
                        for col_index, value in enumerate(row[:4], start=1):
                            final_data_list.append({
                                "UniqueID": unique_id,
                                "GameNumber": map_game_number(game_number),
                                "QuestionNumber": col_index,
                                "Timing": "survey",
                                "Value": value
                            })
            elif len(folders) >= 2 and 'P' in folders[-2]:
                unique_id = folders[-2][1:]
                folder_name = folders[-1]
                m_value, g_value, timing = folder_name.split('_')[1][1:], folder_name.split('_')[2][1:], folder_name.split('_')[3]

                with open(csv_file_path, 'r') as f:
                    csv_reader = csv.reader(f)
                    for row in csv_reader:
                        for col_index, value in enumerate(row[:5], start=1):
                            final_data_list.append({
                                "UniqueID": unique_id,
                                "GameNumber": map_game_number(g_value),
                                "QuestionNumber": col_index,
                                "Timing": timing,
                                "Value": value
                            })

# Create a DataFrame from the list of dictionaries
df = pd.DataFrame(final_data_list)

# Fill empty or null values in 'UniqueID' with a default value (-1), for debugging
df['UniqueID'].replace('', -1, inplace=True)
df['UniqueID'].fillna(-1, inplace=True)

# Convert the 'UniqueID' column to integer
df['UniqueID'] = df['UniqueID'].astype(int)

# Read the condition data into a pandas DataFrame
condition_df = pd.read_csv("participants_url.csv")

# Convert the 'ID' column in the condition DataFrame to integer
condition_df['ID'] = condition_df['ID'].astype(int)

# Merge the condition data with the final DataFrame
merged_df = pd.merge(df, condition_df[['ID', 'Condition']], left_on='UniqueID', right_on='ID', how='left')

# Drop the extra 'ID' column that got added after the merge
merged_df.drop('ID', axis=1, inplace=True)

# Add new column "Unfair_support_towards"
merged_df['Unfair_support_towards'] = merged_df['Condition'].apply(map_condition_to_support)

# Add new column "Order"
merged_df['Order'] = merged_df.apply(map_condition_and_game_to_order, axis=1)

# Save the merged DataFrame to a CSV file
merged_df.to_csv('final_aggregated_data_with_condition.csv', index=False)

# Display the merged DataFrame, for debugging
print(merged_df)
