import hashlib
from flask import Flask
from flask import jsonify
from flask import request
from flask import Response
from flask_cors import CORS
import pyodbc
import jsonpickle


class ValidationState:
    def __init__(self, isCorrect, message):
        self.IsCorrect = isCorrect
        self.Message = message


class Localization:
    def __init__(self, localizationId, name):
        self.LocalizationId = localizationId
        self.Name = name


class AgriculturalTechniques:
    def __init__(self, agriculturalDate, name, data1, data2):
        self.AgriculturalDate = agriculturalDate
        self.Name = name
        self.Data1 = data1
        self.Data2 = data2


class CurrentConditions:
    def __init__(self, plantName, sowingDate, state):
        self.PlantName = plantName
        self.SowingDate = sowingDate
        self.State = state


class Events:
    def __init__(self, eventDate, eventName, lossesPercentage, photoPath):
        self.EventDate = eventDate
        self.EventName = eventName
        self.LossesPercentage = lossesPercentage
        self.PhotoPath = photoPath


class Action:
    def __init__(self, actionId, name):
        self.ActionId = actionId
        self.Name = name


class Plant:
    def __init__(self, plantTypeId, name):
        self.PlantTypeId = plantTypeId
        self.Name = name


class CultivationState:
    def __init__(self, cultivationStateId, name):
        self.CultivationStateId = cultivationStateId
        self.Name = name


class EventType:
    def __init__(self, eventTypeId, name):
        self.EventTypeId = eventTypeId
        self.Name = name


def GetConnectionToDb():
    db = pyodbc.connect(
        'Driver={ODBC Driver 17 for SQL Server};'
        'Server=DESKTOP-N1LV8CP;'
        'Database=IMGW_Test;'
        'Trusted_Connection=yes;'
    )
    return db


app = Flask(__name__)
CORS(app)


@ app.route('/CheckLogIn', methods=['POST'])
def CheckLogIn():
    request_data = request.get_json()
    try:
        db = GetConnectionToDb()
        isCorrect = CheckLoginDetails(
            db, request_data['login'], HashPassword(request_data['password']))
        msg = 'Udany test logowania'

        validationState = ValidationState(isCorrect[0], msg)
        if(validationState.IsCorrect == 1):
            LastSuccessfulLoginSet(db, request_data['login'])

        response = Response(jsonpickle.encode(
            validationState, unpicklable=False), mimetype='application/json')

        return response
    except:
        validationState = ValidationState(0, 'Cos poszlo nie tak')
        response = Response(jsonpickle.encode(
            validationState, unpicklable=False), mimetype='application/json')

        return response
    finally:
        db.close()


def CheckLoginDetails(db, login, haslo):
    cursor = db.cursor()
    cursor.execute('EXEC [User].[CheckLoginDetails] ?, ?', login, haslo)
    for (IsCorrect) in cursor:
        return IsCorrect


def HashPassword(password):
    result = hashlib.md5(password.encode())
    return result.hexdigest()


def LastSuccessfulLoginSet(db, login):
    cursor = db.cursor()
    cursor.execute(
        'EXEC [User].[LastSuccessfulLoginSet] ?', login)
    db.commit()


@ app.route('/LocalizationsGet', methods=['POST'])
def LocalizationsGet():
    try:
        db = GetConnectionToDb()
        request_data = request.get_json()
        login = request_data['login']
        LocalizationsTable = []
        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[LocalizationsGet] ?', login)
        for (localizationId, name) in cursor:
            LocalizationsTable.append(Localization(localizationId, name))

        return Response(jsonpickle.encode(LocalizationsTable, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/AgriculturalTechniquesGet', methods=['POST'])
def AgriculturalTechniquesGet():
    try:
        db = GetConnectionToDb()
        request_data = request.get_json()
        localizationId = request_data['localizationId']
        AgriculturalTechniquesTable = []

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[AgriculturalTechniquesGet] ?', localizationId)

        for (agriculturalDate, name, data1, data2) in cursor:
            AgriculturalTechniquesTable.append(AgriculturalTechniques(
                agriculturalDate, name, data1, data2))

        return Response(jsonpickle.encode(AgriculturalTechniquesTable, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/AgriculturalTechniquesAdd', methods=['POST'])
def AgriculturalTechniquesAdd():
    try:
        request_data = request.get_json()
        db = GetConnectionToDb()
        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[AgriculturalTechniquesAdd] ?, ?, ?, ?, ?', request_data['localizationId'], request_data['agriculturalDate'], request_data['actionId'],    request_data['data1'], request_data['data2'])
        db.commit()

        return jsonify(Status='Dodano zabieg do listy'), 201
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/CurrentConditionsGet', methods=['POST'])
def CurrentConditionsGet():
    try:
        request_data = request.get_json()
        localizationId = request_data['localizationId']
        CurrentConditionsTable = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[CurrentConditionsGet] ?', localizationId)

        for (plantName, sowingDate, state) in cursor:
            CurrentConditionsTable.append(CurrentConditions(
                plantName, sowingDate, state))

        return Response(jsonpickle.encode(CurrentConditionsTable, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/CurrentConditionsAdd', methods=['POST'])
def CurrentConditionsAdd():
    try:
        request_data = request.get_json()
        db = GetConnectionToDb()
        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[CurrentConditionsAdd] ?, ?, ?, ?', request_data['localizationId'], request_data['plantTypeId'], request_data['sowingDate'],    request_data['cultivationStateId'])
        db.commit()

        return jsonify(Status='Dodano warunki do listy'), 201
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/EventsGet', methods=['POST'])
def EventsGet():
    try:
        request_data = request.get_json()
        localizationId = request_data['localizationId']
        EventsTab = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[EventsGet] ?', localizationId)

        for (eventDate, eventName, lossesPercentage, photoPath) in cursor:
            EventsTab.append(Events(
                eventDate, eventName, lossesPercentage, photoPath))

        return Response(jsonpickle.encode(EventsTab, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/EventsAdd', methods=['POST'])
def EventsAdd():
    try:
        request_data = request.get_json()
        db = GetConnectionToDb()
        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[EventsAdd] ?, ?, ?, ?, ?', request_data['localizationId'], request_data['eventDate'], request_data['eventTypeId'],    request_data['lossesPercentage'], request_data['photoPath'])
        db.commit()

        return jsonify(Status='Dodano event do listy'), 201
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/Actions', methods=['GET'])
def ActionsGet():
    try:
        Actions = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[ActionsListGet]')

        for (actionId, name) in cursor:
            Actions.append(Action(actionId, name))

        return Response(jsonpickle.encode(Actions, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/PlantTypes', methods=['GET'])
def PlantTypesGet():
    try:
        Plants = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[PlantsListGet]')

        for (plantTypeId, name) in cursor:
            Plants.append(Plant(plantTypeId, name))

        return Response(jsonpickle.encode(Plants, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/CultivationStates', methods=['GET'])
def CultivationStatesGet():
    try:
        CultivationStates = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[CultivationStatesListGet]')

        for (cultivationStateId, name) in cursor:
            CultivationStates.append(
                CultivationState(cultivationStateId, name))

        return Response(jsonpickle.encode(CultivationStates, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


@ app.route('/EventTypes', methods=['GET'])
def EventTypesGet():
    try:
        EventTypes = []
        db = GetConnectionToDb()

        cursor = db.cursor()
        cursor.execute(
            'EXEC [CurrentConditions].[EventsListGet]')

        for (eventTypeId, name) in cursor:
            EventTypes.append(
                EventType(eventTypeId, name))

        return Response(jsonpickle.encode(EventTypes, unpicklable=False), mimetype='application/json')
    except:
        return jsonify(Status='Cos poszlo nie tak')
    finally:
        db.close()


app.run(port=3000)
