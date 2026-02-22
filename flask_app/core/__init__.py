from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

import os
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///myDatabase.db' 
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'uploads')
app.config['SECRET_KEY'] = '48acc0b5273209690ee832e5'
app.config['JWT_SECRET_KEY'] = '48acc0b5273209690ee832e5'
db=SQLAlchemy(app)
migrate = Migrate(app,db)
jwt = JWTManager(app)
bcrypt =Bcrypt(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
from .models import *
from .routers import *
