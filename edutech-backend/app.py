from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_pymongo import PyMongo
from passlib.hash import pbkdf2_sha256
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/edutech')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

mongo = PyMongo(app)
jwt = JWTManager(app)

# User model
class User:
    def __init__(self, username, email, password, full_name=None):
        self.username = username
        self.email = email
        self.password = pbkdf2_sha256.hash(password)
        self.full_name = full_name
        self.is_active = True
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({'username': username})

    def save(self):
        result = mongo.db.users.insert_one({
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        })
        return str(result.inserted_id)

    def to_dict(self):
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],  # This should already be hashed
            full_name=data.get('full_name')
        )
        user._id = data.get('_id')
        user.is_active = data.get('is_active', True)
        user.created_at = data.get('created_at')
        user.updated_at = data.get('updated_at')
        return user


# ✅ Root route to verify server is running
@app.route('/')
def home():
    return jsonify({"message": "EduTech backend is running!"}), 200


# 🔐 Auth routes
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')

    if User.find_by_email(email):
        return jsonify({'detail': 'Email already registered'}), 400

    if User.find_by_username(username):
        return jsonify({'detail': 'Username already taken'}), 400

    user = User(username, email, password, full_name)
    user_id = user.save()

    # Return user data as expected by frontend
    user_data = {
        'id': user_id,
        'email': email,
        'username': username,
        'full_name': full_name,
        'is_active': True,
        'created_at': user.created_at.isoformat(),
        'updated_at': user.updated_at.isoformat()
    }

    return jsonify(user_data), 200


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.find_by_email(email)
    if not user or not pbkdf2_sha256.verify(password, user['password']):
        return jsonify({'detail': 'Incorrect email or password'}), 401

    access_token = create_access_token(identity=user['username'])
    return jsonify({'access_token': access_token, 'token_type': 'bearer'}), 200


@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_username = get_jwt_identity()
    user = User.find_by_username(current_username)
    if not user:
        return jsonify({'detail': 'User not found'}), 404

    user_data = {
        'id': str(user['_id']),
        'email': user['email'],
        'username': user['username'],
        'full_name': user.get('full_name'),
        'is_active': user.get('is_active', True),
        'created_at': user.get('created_at').isoformat() if user.get('created_at') else None,
        'updated_at': user.get('updated_at').isoformat() if user.get('updated_at') else None
    }

    return jsonify(user_data), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
