from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import pandas as pd
import json
from prophet import Prophet
app = Flask(__name__)
api = Api(app)
CORS(app)


def getData(type):
    db = pd.read_csv(type)
    db = db.loc[db['StateName']=="WA"]
    db = db.iloc[::5, :]
    db = db.drop(columns=["SizeRank","RegionID","RegionName","RegionType", "StateName"])
    db = pd.melt(db)
    db = db[pd.notnull(db['value'])]
    db = db.to_json(orient="records")
    db = json.loads(db)
    return db

def predict(db):
    m = Prophet()
    m.fit(db)
    future = m.make_future_dataframe(periods=365)
    return future

def addToDataSet():
#     db = pd.read_csv("data\SFH_TimeSeries.csv")
#     # db = db.loc[db['StateName']=="NY"]
#     db = db.drop(columns=["SizeRank","RegionID","RegionName","RegionType", "StateName"])
#     db = pd.melt(db)
#     db = db[pd.notnull(db['value'])]
#     # db = db.to_csv("data\workingSet.csv", index=False)
#     db = db.to_json(orient="records")
#     # db = db.replace("\\","")
#     db = json.loads(db)
#     print(db)
#     print("helos")
#     return db
    print("hi")
    
def clearWorkingSet():
    filename = "data\workingSet.csv"
    f = open(filename, "w+")
    f.close()

class state(Resource):
    def get(self,state):
        # return {"sat":state}
        return addToDataSet() 
class singleFamily(Resource):
    def get(self):
        return getData("data\SFH_TimeSeries.csv")
class Condo(Resource):
    def get(self):
        return getData("data\condo_tier_TimeSeries.csv")
class time(Resource):
    def get(self, time):
        pass

class region(Resource):
    def get(self, region):
        pass


api.add_resource(state, "/state/<string:state>")
api.add_resource(singleFamily, "/singleFamily")
api.add_resource(Condo, "/Condo")



if __name__ == '__main__':
    app.run(debug=True)