from core import db
from uuid import uuid4
from datetime import datetime

def get_uuid():
    return uuid4().hex


class Category(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    name = db.Column(db.String(32), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship('Job', backref='category', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {'id': self.id, 'name': self.name}


class City(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    name = db.Column(db.String(32), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship('Job', backref='city', lazy=True, cascade="all, delete-orphan")
    profiles = db.relationship('Profile', backref='city', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {'id': self.id, 'name': self.name}


class Gender(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    name = db.Column(db.String(32), nullable=False, unique=True)
    profiles = db.relationship('Profile', backref='gender', lazy=True, cascade="all, delete-orphan")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}


class Company(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    name = db.Column(db.String(32), nullable=False, unique=True)
    image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship('Job', backref='company', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'image': self.image}


class TimeOfWork(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    name = db.Column(db.String(32), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship('Job', backref='time_of_work', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {'id': self.id, 'name': self.name}


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(32), nullable=False)
    profile = db.relationship('Profile', backref='user', uselist=False, cascade="all, delete-orphan")
    jobs = db.relationship('Job', backref='user', lazy=True, cascade="all, delete-orphan")
    applications = db.relationship('JobApplication', backref='user', lazy=True, cascade="all, delete-orphan")
    liked = db.relationship('Liked', backref='user', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }


class Profile(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    img = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.String(255), nullable=True)
    cv = db.Column(db.String(255), nullable=True)
    document_for_indicated = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    city_id = db.Column(db.String(32), db.ForeignKey('city.id'), nullable=False)
    gender_id = db.Column(db.String(32), db.ForeignKey('gender.id'), nullable=False)

    def to_dict(self):
        return {
        'id': self.id,
        'first_name': self.first_name,
        'last_name': self.last_name,
        'img': self.img,
        'bio': self.bio,
        'cv': self.cv,
        'document_for_indicated': self.document_for_indicated,
        'city_id': self.city_id,
        'city': self.city.name if self.city else None,
        'gender_id': self.gender_id,
        'gender': self.gender.name if self.gender else None
    }


class Job(db.Model):
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    requirement = db.Column(db.String(255), nullable=False)
    min_price = db.Column(db.Float, nullable=False)
    max_price = db.Column(db.Float, nullable=False)
    is_showed = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category_id = db.Column(db.String(32), db.ForeignKey('category.id'), nullable=True)
    city_id = db.Column(db.String(32), db.ForeignKey('city.id'), nullable=True)
    company_id = db.Column(db.String(32), db.ForeignKey('company.id'), nullable=True)
    time_of_work_id = db.Column(db.String(32), db.ForeignKey('time_of_work.id'), nullable=True)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=True)

    applications = db.relationship('JobApplication', backref='job', lazy=True, cascade="all, delete-orphan")
    def to_dict(self):
        return {
        'id': self.id,
        'title': self.title,
        'description': self.description,
        'requirement': self.requirement,
        'min_price': self.min_price,
        'max_price': self.max_price,
        'is_showed': self.is_showed,
        'city': {'id': self.city.id, 'name': self.city.name} if self.city else None,
        'category': {'id': self.category.id, 'name': self.category.name} if self.category else None,
        'company': {'id': self.company.id, 'name': self.company.name} if self.company else None,
        'time_of_work': {'id': self.time_of_work.id, 'name': self.time_of_work.name} if self.time_of_work else None,
        'created_at': self.created_at.isoformat() if self.created_at else None
    }


class JobApplication(db.Model):
    __tablename__ = "job_application"

    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.String(32), db.ForeignKey('job.id'), nullable=False)
    status = db.Column(db.String(32), default="pending")
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'job_id', name='unique_user_job'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
        "profile": self.user.profile.to_dict() if self.user and self.user.profile else None,

            "job_id": self.job_id,
            "job_title": self.job.title if self.job else None,
            "status": self.status,
            "applied_at": self.applied_at.strftime("%A %d %B %Y, %H:%M") if self.applied_at else None
        }


class Liked(db.Model):
    __tablename__ = "wishlist"
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'))
    job_id = db.Column(db.String(32), db.ForeignKey('job.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    job = db.relationship('Job', backref='liked', lazy='joined')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'job_id', name='unique_user_like'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job': self.job.to_dict() if self.job else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
