from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except:
        print("Database doesn't exist")
    
    return conn


data = pd.read_csv("updated_dataset.csv", encoding='latin1')
connection = create_connection("my.db")

data.to_sql('updated_dataset', connection, if_exists='replace')
connection.close();

db_url = 'sqlite:///my.db'
engine = create_engine(db_url, echo= True)
df_2 = pd.read_sql('select * from updated_dataset', engine)
print(df_2)

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route('/get-data-line')
def get_data_line():
    data = []
    categories = ['Furniture', 'Office Supplies', 'Technology'] 
    for i in range(3):
        df = pd.read_sql(f"SELECT [Order Date] As date, SUM(Sales) AS value FROM (SELECT [Order Date], Sales FROM updated_dataset WHERE Category = '{categories[i]}') AS filtered_data GROUP BY [Order Date] ORDER BY [Order Date];", engine) 
        
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
            df = df.groupby(pd.Grouper(key='date', freq='M')).sum().reset_index()
            df['date'] = df['date'].astype('int64') // 10**6 
            result = df.to_dict(orient='records')
            sorted_result = sorted(result, key=lambda x: x['date'])
            data.append(sorted_result)
    return jsonify(data)

@app.route('/get-data-pie')
def get_data_pie():
    data = []
    categories = ['Furniture', 'Office Supplies', 'Technology']

    for category in categories:
        df = pd.read_sql(f"""
            SELECT 
                [Sub-Category] AS sub_category, 
                SUM(Sales) AS value 
            FROM 
                updated_dataset 
            WHERE 
                Category = '{category}' 
            GROUP BY 
                [Sub-Category] 
            ORDER BY 
                [Sub-Category];
        """, engine)
        
        category_data = {
            'category': category,
            'value': df['value'].sum(),
            'subData': []
        }
        
        for _, row in df.iterrows():
            category_data['subData'].append({
                'category': row['sub_category'],
                'value': round(row['value'], 2)
            })
        
        data.append(category_data)
    
    return jsonify(data)

@app.route('/get-data-map')
def get_data_series():
    df = pd.read_sql("SELECT 'US-' || State AS id, SUM(Sales) AS value FROM updated_dataset GROUP BY State;", engine)
    data = []
    for i in range(len(df)):
        data.append({"date": df.loc[i]["id"], "value": int(df.loc[i]["value"])})
    return jsonify(data)

@app.route('/get-data-bar')
def get_data_bar():
    data = []
    categories = ['Furniture', 'Office Supplies', 'Technology']
    for category in categories:
        df = pd.read_sql(f"""
            SELECT 
                [Sub-Category] AS state, 
                SUM(Quantity) AS sales 
            FROM 
                updated_dataset 
            WHERE 
                Category = '{category}' 
            GROUP BY 
                [Sub-Category] 
            ORDER BY 
                [Sub-Category];
        """, engine)
        
        result = df.to_dict(orient='records')
        
        # Create a new dictionary with 'name' key first
        for record in result:
            record_with_name = {'region': category, 'state': record['state'], 'sales': record['sales']}
            data.append(record_with_name)
        return jsonify(data)


from collections import OrderedDict


@app.route('/get-data-scatter')
def get_data_scatter():
    categories = ['Furniture', 'Office Supplies', 'Technology']
    colors = ['0x4b0082', '0x674ea7', '0x45818e']
    data = []
    
    for i in range(3):
        df = pd.read_sql(f"""
            SELECT 
                Discount AS x, 
                [Profit ratio] AS y,
                Profit AS value
            FROM 
                updated_dataset 
            WHERE 
                Category = '{categories[i]}';
        """, engine)
        
        records = df.to_dict(orient='records')
        for record in records:
            record['color'] = colors[i]
            ordered_record = OrderedDict([('x', record['x']), ('y', record['y']), ('color', record['color']), ('value', record['value'])])
            record.update(ordered_record)
        
        category_data = {
            'category': categories[i],
            'data': records
        }
        
        data.append(category_data)
    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True) 

