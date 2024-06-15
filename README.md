# Flask Data Visualization Project
- This project was completed as part of the Data Integration and Visualization course at Zewail University in Fall 2023. The project utilizes the Flask framework to create a web application for data visualization. It connects to a SQLite database and uses pandas and SQLAlchemy for data manipulation. The application provides various routes for retrieving and visualizing data from the database.

## Dashboard Image
  ![image](https://github.com/haneenalaa465/Data-Visualization-Project/assets/112430100/4a75ff89-ea09-42b4-a5b4-8419bf7792aa)



## Installation
1. Clone the repository to your local machine.
2. Make sure you have Python and pip installed.
3. Install the required dependencies by running the following command:
```
pip install SQLAlchemy pandas Flask

```
4. Make sure you have the SQLite database file ("my.db") and the dataset file ("updated_dataset.csv") in the project directory.

## Usage
1. Start the Flask application by running the following command:
```
python server.py
```
2. Open your web browser and navigate to http://localhost:5000 to access the homepage.
3. The application provides the following routes for retrieving data:
  - /get-data-line: Returns data for line chart visualization.
  - /get-data-pie: Returns data for pie chart visualization.
  - /get-data-map: Returns data for map visualization.
  - /get-data-bar: Returns data for bar chart visualization.
  - /get-data-scatter: Returns data for scatter plot visualization.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/) - Web framework for Python
- [pandas](https://pandas.pydata.org/) - Data manipulation library
- [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and Object-Relational Mapping (ORM) library
