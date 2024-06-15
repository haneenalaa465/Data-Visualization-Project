# Flask Data Visualization Project
- This project utilizes the Flask framework to create a web application for data visualization. It connects to a SQLite database and uses pandas and SQLAlchemy for data manipulation. The application provides various routes for retrieving and visualizing data from the database.

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
