from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import pandas as pd
import json
from prophet import Prophet
app = Flask(__name__)
api = Api(app)
CORS(app)


def getData(file,type, limit):
    db = pd.read_csv(file)
    db = db.loc[db['StateName']==type]
    db = db.drop(columns=["SizeRank","RegionID","RegionName","RegionType", "StateName"])

    db = pd.melt(db)
    if limit:
        if len(db.index) < 4000:
            print("two")
            db = db.iloc[::3,:]
        elif len(db.index) < 6000:
            print("three")
            db = db.iloc[::5,:]
        elif len(db.index) < 8000:
            print("four")
            db = db.iloc[::8,:]
        elif len(db.index) < 10000:
            print("four")
            db = db.iloc[::10,:]
        else:
            print("else")
            db = db.iloc[::15,:]
    db = db[pd.notnull(db['value'])]

    print(db)
    return db



def toJSON(data):
    return json.loads(data.to_json(orient="records"))

def predictR(db):
    db.columns= ['ds','y']
    m = Prophet()
    m.fit(db)
    future = m.make_future_dataframe(periods=1095)
    forecast = m.predict(future)
    forecast = forecast.drop(columns=["trend","trend_lower", "trend_upper","additive_terms","additive_terms_lower","additive_terms_upper","yearly", "yearly_lower","yearly_upper","multiplicative_terms","multiplicative_terms_lower","multiplicative_terms_upper"])
    forecast.columns= ['variable','lower', 'upper', 'value']
    forecast = forecast.astype({'variable': str})
    from2015 = forecast[forecast['variable'] == "2015-01-31"].index.astype(int)[0]
    print(from2015)
    forecast = forecast.iloc[from2015:-1]
    print(forecast)
    return forecast

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
        return toJSON(getData("data\SFH_TimeSeries.csv", state, True))
class types(Resource):
    def get(self,state, types):
        if types == "1":
            print("first")
            return toJSON(getData("data\SFH_TimeSeries.csv", state, True))
        else:
            print("second")
            return toJSON(getData("data\condo_tier_TimeSeries.csv", state, True))

class predict(Resource):
    def get(self, state, types):
        if types == "1":
            return toJSON(predictR(getData("data\SFH_TimeSeries.csv", state, False)))
        
        else:
            return toJSON(predictR(getData("data\condo_tier_TimeSeries.csv", state, False)))
        

api.add_resource(state, "/state/<string:state>")
api.add_resource(types, "/state/<string:state>/<string:types>")
api.add_resource(predict, "/predict/<string:state>/<string:types>")



if __name__ == '__main__':
    app.run(debug=True)