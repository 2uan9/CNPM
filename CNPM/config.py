import os
basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = 'your-secret-key'
WTF_CSRF_SECRET_KEY = 'another-secret-key'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False

UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'jpg', 'png'}
