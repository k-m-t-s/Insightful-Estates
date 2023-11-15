from flask import Flask
from flask_restful import Api, Resource
import pandas as pd
import json

app = Flask(__name__)
api = Api(app)


def addToDataSet():
    db = pd.read_csv("data\SFH_TimeSeries.csv")
    db = db.loc[db['StateName']=="AZ"]
    db = db.drop(columns=["SizeRank","RegionID","RegionName","RegionType", "StateName"])
    db = pd.melt(db)
    db = db[pd.notnull(db['value'])]
    # db = db.to_csv("data\workingSet.csv", index=False)
    db = db.head(5)
    db = db.to_json(orient="records")
    # db = db.replace("\\","")
    db = json.loads(db)
    return db
    
def clearWorkingSet():
    filename = "data\workingSet.csv"
    f = open(filename, "w+")
    f.close()
clearWorkingSet()
addToDataSet()

class state(Resource):
    def get(self,state):
        # return {"sat":state}
        return addToDataSet()
    
api.add_resource(state, "/state/<string:state>")



if __name__ == '__main__':
    app.run(debug=True)