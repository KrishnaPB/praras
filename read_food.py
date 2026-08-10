import pandas as pd
import json

df = pd.read_excel('food.xlsx')
print(df.columns.tolist())
print(df.head(10).to_string())
print(df['Category'].unique() if 'Category' in df.columns else 'No Category column')
