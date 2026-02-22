from flask import request, jsonify, current_app, send_from_directory
from core import app, db, bcrypt
import os
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets

from .models import (
    User,
    Category,
    City,
    Gender,
    Company,
    TimeOfWork,
    Profile,
    Job,
    JobApplication,
    Liked
)
GOOGLE_CLIENT_ID = "523156746392-n9hr4aiev403ev6i9ujjr5m1gbm7kro1.apps.googleusercontent.com"


@app.route("/auth/google", methods=["POST"])
def google_login():
    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify({"msg": "Token missing ❌"}), 400

        # Verify token
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        except ValueError:
            return jsonify({"msg": "Invalid token ❌"}), 401

        email = idinfo.get("email")
        username = idinfo.get("name") or email.split("@")[0]

        # DB check
        user = User.query.filter_by(email=email).first()
        if not user:
            # Provide dummy password for OAuth users
            dummy_password = bcrypt.generate_password_hash(secrets.token_urlsafe(16))

            user = User(username=username, email=email, password=dummy_password, role="user")
            db.session.add(user)
            db.session.commit()

        # JWT
        access_token = create_access_token(
            identity=user.id,
            additional_claims={"username": user.username, "role": user.role}
        )

        return jsonify({
            "access_token": access_token,
            "role": user.role,
            "msg": "Google login successful ✅"
        })

    except Exception as e:
        print("Error in /auth/google:", e)
        return jsonify({"msg": "Server error ❌", "error": str(e)}), 500

# Serve uploaded files
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
@app.route('/uploads/images/<filename>')
def uploaded_images(filename):
    return send_from_directory(os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), "images"), filename)
@app.route('/uploads/cv/<filename>')
def uploaded_cv(filename):
    return send_from_directory(os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), "cv"), filename)

@app.route('/uploads/companyImg/<filename>')
def uploaded_companyImg(filename):
    return send_from_directory(os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), "companyImg"), filename)
# Save image helper - ensures folder exists
def save_file(file, folder="uploads"):
    upload_folder = os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), folder)
    os.makedirs(upload_folder, exist_ok=True)
    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    return filename
# -------------END---------------#









# -------------Category---------------#

# --------------GET ALL CATEGORIES
@app.route("/category", methods=["GET"])
def get_categories(): 
    categories = Category.query.order_by(Category.id.asc()).all()
    categories_list = [category.to_dict() for category in categories]
    return jsonify(categories_list), 200


# --------------GET CATEGORY BY ID
@app.route("/category/<string:id>", methods=["GET"])
def get_category_by_id(id): 
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404
    return jsonify(category.to_dict()), 200


# --------------CREATE CATEGORY
@app.route("/category", methods=["POST"])
def create_category():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400


    if Category.query.filter_by(name=name).first():
        return jsonify({"msg": "Category already exists"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201


# --------------EDIT CATEGORY
@app.route("/category/<string:id>", methods=["PUT"])
def edit_category(id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400

    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    category.name = name
    db.session.commit()
    return jsonify(category.to_dict()), 200


# --------------DELETE CATEGORY
@app.route("/category/<string:id>", methods=["DELETE"])
def delete_category(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"msg": "Category deleted successfully"}), 200

# -------------END---------------#










# -------------City---------------#

# --------------GET ALL CITIES
@app.route("/city", methods=["GET"])
def get_cities():  
    cities = City.query.order_by(City.id.asc()).all()
    city_list = [city.to_dict() for city in cities]
    return jsonify(city_list), 200


# --------------GET CITY BY ID
@app.route("/city/<string:id>", methods=["GET"])
def get_city_by_id(id): 
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not found"}), 404
    return jsonify(city.to_dict()), 200


# --------------CREATE CITY
@app.route("/city", methods=["POST"])
def create_city():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400

   
    if City.query.filter_by(name=name).first():
        return jsonify({"msg": "City already exists"}), 400

    new_city = City(name=name)
    db.session.add(new_city)
    db.session.commit()
    return jsonify(new_city.to_dict()), 201


# --------------EDIT CITY
@app.route("/city/<string:id>", methods=["PUT"])
def edit_city(id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400

    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not found"}), 404

    city.name = name
    db.session.commit()
    return jsonify(city.to_dict()), 200


# --------------DELETE CITY
@app.route("/city/<string:id>", methods=["DELETE"])
def delete_city(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not found"}), 404

    db.session.delete(city)
    db.session.commit()
    return jsonify({"msg": "City deleted successfully"}), 200

# -------------END---------------#












# -------------Company---------------#

# GET all companies
@app.route("/company", methods=["GET"])
def get_company():
    companies = Company.query.order_by(Company.id.asc()).all()
    company_list = [company.to_dict() for company in companies]
    return jsonify(company_list)


# GET company by ID
@app.route("/company/<string:id>", methods=["GET"])
def get_by_id_company(id):
    company = Company.query.filter_by(id=id).first()
    if not company:
        return jsonify({"msg": "Company not found"}), 404
    return jsonify(company.to_dict())


# CREATE company
@app.route("/company", methods=["POST"])
def create_company():
    name = request.form.get("name")
    image = request.files.get("image")
    if not name or not image:
        return jsonify({"error": "Name and image are required"}), 400
    f_img = save_file(image, folder='companyImg')
    new_company = Company(name=name, image=f_img)
    db.session.add(new_company)
    db.session.commit()
    return jsonify(new_company.to_dict()), 201


# EDIT company
@app.route("/company/<string:id>", methods=["PUT"])
def edit_company(id):
    company = Company.query.filter_by(id=id).first()
    if not company:
        return jsonify({"msg": "Company not found"}), 404

    name = request.form.get("name")
    image = request.files.get("image")

    if name:
        company.name = name
    if image:
        company.image = save_file(image, folder='companyImg')
    db.session.commit()
    return jsonify(company.to_dict()), 200


# DELETE company
@app.route("/company/<string:id>", methods=["DELETE"])
def delete_company(id):
    company = Company.query.filter_by(id=id).first()
    if not company:
        return jsonify({"msg": "Company not found"}), 404
    db.session.delete(company)
    db.session.commit()
    return jsonify({"msg": "Company deleted successfully"}), 200

# -------------END---------------#












# -------------Gender---------------#


#--------------GET
@app.route("/gender", methods=["GET"])
def get_gender():
    genders = Gender.query.order_by(Gender.id.asc()).all()
    gender_list = [gender.to_dict() for gender in genders]
    return jsonify(gender_list)


#--------------GET_ID
@app.route("/gender/<string:id>", methods=["GET"])
def get_by_id_gender(id):
    gender = Gender.query.filter_by(id=id).first()
    return jsonify(gender.to_dict())


#--------------CREATE
@app.route("/gender", methods=["POST"])
def create_gender():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_gender = Gender(name=name)
    db.session.add(new_gender)
    db.session.commit()
    return jsonify(new_gender.to_dict())


#--------------EDIT
@app.route("/gender/<string:id>", methods=["PUT"])
def edit_gender(id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    gender = Gender.query.filter_by(id=id).first()
    if name:
        gender.name = name
    db.session.commit()
    return jsonify(gender.to_dict())


#--------------DELETE
@app.route("/gender/<string:id>", methods=["DELETE"])
def delete_gender(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "This city cant find "})
    db.session.delete(gender)
    db.session.commit()
    return jsonify({"msg": "You delete successfully"})
# -------------END---------------#









# -------------TimeOfWork---------------#

# --------------GET ALL TIME OF WORK
@app.route("/time_of_work", methods=["GET"])
def get_time_of_works():  # renamed function
    time_of_works = TimeOfWork.query.order_by(TimeOfWork.id.asc()).all()  # fix: was Gender.id.asc()
    time_of_work_list = [t.to_dict() for t in time_of_works]
    return jsonify(time_of_work_list), 200


# --------------GET TIME OF WORK BY ID
@app.route("/time_of_work/<string:id>", methods=["GET"])
def get_time_of_work_by_id(id):  # renamed function
    time_of_work = TimeOfWork.query.filter_by(id=id).first()
    if not time_of_work:
        return jsonify({"msg": "Time of Work not found"}), 404
    return jsonify(time_of_work.to_dict()), 200


# --------------CREATE TIME OF WORK
@app.route("/time_of_work", methods=["POST"])
def create_time_of_work():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400

    # Optional: prevent duplicates
    if TimeOfWork.query.filter_by(name=name).first():
        return jsonify({"msg": "This time of work already exists"}), 400

    new_time_of_work = TimeOfWork(name=name)
    db.session.add(new_time_of_work)
    db.session.commit()
    return jsonify(new_time_of_work.to_dict()), 201


# --------------EDIT TIME OF WORK
@app.route("/time_of_work/<string:id>", methods=["PUT"])
def edit_time_of_work(id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"}), 400

    time_of_work = TimeOfWork.query.filter_by(id=id).first()
    if not time_of_work:
        return jsonify({"msg": "Time of Work not found"}), 404

    time_of_work.name = name
    db.session.commit()
    return jsonify(time_of_work.to_dict()), 200


# --------------DELETE TIME OF WORK
@app.route("/time_of_work/<string:id>", methods=["DELETE"])
def delete_time_of_work(id):
    time_of_work = TimeOfWork.query.filter_by(id=id).first()
    if not time_of_work:
        return jsonify({"msg": "Time of Work not found"}), 404

    db.session.delete(time_of_work)
    db.session.commit()
    return jsonify({"msg": "Time of Work deleted successfully"}), 200

# -------------END---------------#








# -------------Register---------------#
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    hash_password = bcrypt.generate_password_hash(password).decode("utf-8")
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "This username already exists"})
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "This email already exists"})
    new_user = User(username=username, email=email, password=hash_password, role="user")
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

# -------------END---------------#








# -------------Login---------------#
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401
    access_token = create_access_token(identity=user.id)

    return jsonify(
        {           "msg": "Successfully logged in ✅",

            "user": user.id,
            "access_token": access_token,
            "role": user.role,
            "username": user.username,
        }
    )
# -------------END---------------#









# -------------Profile---------------#
#--------------GET
@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=current_user).first()

    if not profile:

        return jsonify({'msg': 'Profile does not exist'}), 404
    return jsonify(profile.to_dict()), 200

#--------------CREATE
@app.route("/profile", methods=["POST"])
@jwt_required()
def create_profile():
    current_user = get_jwt_identity()

    # Check if profile already exists for this user
    if Profile.query.filter_by(user_id=current_user).first():
        return jsonify({'msg': 'Profile already exists'}), 400

    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    img = request.files.get("img")
    bio = request.form.get("bio")
    cv = request.files.get("cv")
    document_for_indicated = request.form.get("document_for_indicated")
    city_id = request.form.get("city_id")
    gender_id = request.form.get("gender_id")

    if not first_name or not last_name:
        return jsonify({'msg': 'First name and last name are required'}), 400

    convert_img = save_file(img, folder="images") if img else None
    convert_cv = save_file(cv, folder="cv") if cv else None
    
    new_profile = Profile(
        first_name=first_name,
        last_name=last_name,
        img=convert_img,
        bio=bio,
        cv=convert_cv,
        document_for_indicated=document_for_indicated,
        city_id=city_id,
        gender_id=gender_id,
        user_id=current_user
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify(new_profile.to_dict()), 201

#--------------EDIT

@app.route("/profile/<string:id>", methods=["PUT"])
@jwt_required()
def edit_profile(id):
    current_user = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=current_user, id=id).first()
    if not profile:
        return jsonify({"msg": "Profile not found"}), 404

    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    img = request.files.get("img")
    bio = request.form.get("bio")
    cv = request.files.get("cv")
    document_for_indicated = request.form.get("document_for_indicated")
    city_id = request.form.get("city_id")
    gender_id = request.form.get("gender_id")

    if first_name:
        profile.first_name = first_name
    if last_name:
        profile.last_name = last_name
    if img:
        profile.img = save_file(img, folder="images")
    if bio:
        profile.bio = bio
    if cv:
        profile.cv = save_file(cv, folder="cv")
    if document_for_indicated:
        profile.document_for_indicated = document_for_indicated
    if city_id:
        profile.city_id = city_id
    if gender_id:
        profile.gender_id = gender_id

    db.session.commit()
    return jsonify(profile.to_dict()), 200

# -------------END---------------#









# -------------Job---------------#

#--------------GET
@app.route('/job',methods=['GET'])
def get_job():
    jobs = Job.query.order_by(Job.id.asc()).all()
    return jsonify([job.to_dict() for job in jobs])


#--------------GET_ID
@app.route('/job/<string:id>',methods=['GET'])
def get_by_id_job(id):
    job = Job.query.filter_by(id=id).first()
    if not job:
        return jsonify({"msg": "Job not found"}), 404
    return jsonify(job.to_dict())


#--------------CREATE
@app.route('/job', methods=['POST'])
@jwt_required()
def create_job():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if user.role != 'admin':
        return jsonify({'msg':'You cant do nothing'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'msg': 'No data sent'}), 400

    new_job = Job(
        title=data.get("title"),
        description=data.get("description"),
        requirement=data.get("requirement"),
        min_price=data.get("min_price"),
        max_price=data.get("max_price"),
        is_showed=data.get("is_showed", False),
        category_id=data.get("category_id"),
        city_id=data.get("city_id"),
        company_id=data.get("company_id"),
        time_of_work_id=data.get("time_of_work_id"),
        user_id=user.id
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201



#--------------EDIT
@app.route('/job/<string:id>', methods=['PUT'])
@jwt_required()
def edit_job(id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    
    # Admin check
    if user.role != 'admin':
        return jsonify({'msg': 'You cannot do this'}), 403

    # Fetch job (admin can edit any job)
    job = Job.query.filter_by(id=id).first()
    if not job:
        return jsonify({'msg': 'Job not found'}), 404

    # Read JSON data from React
    data = request.get_json()

    # Update job fields if provided
    job.title = data.get('title', job.title)
    job.description = data.get('description', job.description)
    job.requirement = data.get('requirement', job.requirement)
    job.min_price = data.get('min_price', job.min_price)
    job.max_price = data.get('max_price', job.max_price)
    job.is_showed = bool(data.get('is_showed', job.is_showed))

    if data.get('category_id'):
        job.category_id = data['category_id']
    if data.get('city_id'):
        job.city_id = data['city_id']
    if data.get('company_id'):
        job.company_id = data['company_id']
    if data.get('time_of_work_id'):
        job.time_of_work_id =data['time_of_work_id']

    db.session.commit()

    # Return the updated job as JSON
    return jsonify(job.to_dict())


 
 #--------------DELETE
@app.route('/job/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_job(id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user or user.role != 'admin':
        return jsonify({'msg': 'You do not have permission'}), 403  

    job = Job.query.filter_by(user_id=user.id, id=id).first()
    if not job:
        return jsonify({'msg': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({'msg': 'Job deleted successfully'}), 200

# -------------END---------------#



# -------------JobApplication---------------#

# GET all job applications of the current user
@app.route('/jobApplication', methods=['GET'])
@jwt_required()
def get_job_application():
    user_id = get_jwt_identity()
    jobs = JobApplication.query.filter_by(user_id=user_id).all()
    return jsonify([job.job_id for job in jobs])
@app.route('/jobApplication/user', methods=['GET'])
@jwt_required()
def get_jo_application():
    user_id = get_jwt_identity()
    jobs = JobApplication.query.filter_by(user_id=user_id).all()
    return jsonify([job.to_dict() for job in jobs])
@app.route('/jobApplication/admin', methods=['GET'])
@jwt_required()
def get_all_job_applications():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role != "admin":
        return jsonify({"msg": "Unauthorized access"}), 403

    jobs = JobApplication.query.order_by(JobApplication.id.desc()).all()
    return jsonify([job.to_dict() for job in jobs])
# GET a specific job application by job ID for the current user
@app.route('/jobApplication/<string:id>', methods=['GET'])
@jwt_required()
def get_job_id_application(id):
    current_user = get_jwt_identity()
    job_apps = JobApplication.query.filter_by(user_id=current_user, job_id=id).all()
    if not job_apps:
        return jsonify({'msg': 'No applications found for this job'}), 404

    result = []
    for app in job_apps:
        result.append({
            'id': app.id,
            'job_id': app.job_id,
            'status': app.status
        })
    return jsonify(result)


# CREATE a job application
@app.route('/jobApplication/<string:id>', methods=['POST'])
@jwt_required()
def create_job_application(id):
    current_user = get_jwt_identity()
    job = Job.query.filter_by(id=id).first()
    if not job:
        return jsonify({'msg': 'Job not found'}), 404

    existing_app = JobApplication.query.filter_by(user_id=current_user, job_id=job.id).first()
    if existing_app:
        return jsonify({'msg': 'You have already applied to this job'}), 400

    new_job_application = JobApplication(user_id=current_user, job_id=job.id, status='pending')
    db.session.add(new_job_application)
    db.session.commit()
    return jsonify(new_job_application.to_dict()), 201


# EDIT a job application (update status)
@app.route('/jobApplication/<string:id>', methods=['PUT'])
@jwt_required()
def edit_job_application(id):
    current_user = get_jwt_identity()
    data = request.get_json()
    status = data.get('status')

    if not status:
        return jsonify({'msg': 'Status is required'}), 400

    # ✅ Admin should find by JobApplication.id (not job_id)
    job_app = JobApplication.query.filter_by(id=id).first()
    if not job_app:
        return jsonify({'msg': 'Job application not found'}), 404

    # Optional: If you want only admins to update statuses
    user = User.query.get(current_user)
    if user.role != "admin":
        return jsonify({'msg': 'Unauthorized'}), 403

    job_app.status = status
    db.session.commit()

    return jsonify(job_app.to_dict()), 200

# -------------END---------------#





# ----# -------------Liked---------------#
# -------------Liked---------------#

# GET all liked job IDs
@app.route('/liked', methods=['GET'])
@jwt_required()
def get_liked():
    user_id = get_jwt_identity()
    liked_list = Liked.query.filter_by(user_id=user_id).all()
    return jsonify([item.job_id for item in liked_list]), 200


# GET detailed liked jobs
@app.route('/liked/myList', methods=['GET'])
@jwt_required()
def get_liked_my():
    user_id = get_jwt_identity()
    liked_list = Liked.query.filter_by(user_id=user_id).all()

    result = []
    for item in liked_list:
        job = item.job
        if job:  # ensure the job still exists
            result.append({
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "requirement": job.requirement,
                "min_price": job.min_price,
                "max_price": job.max_price,
                "is_showed": job.is_showed,
                "company": job.company.name if job.company else None,
                "city": job.city.name if job.city else None,
                "category": job.category.name if job.category else None,
                "time_of_work": job.time_of_work.name if job.time_of_work else None,
            })

    return jsonify(result), 200


# CREATE liked job
@app.route('/liked/<string:job_id>', methods=['POST'])
@jwt_required()
def create_liked(job_id):
    current_user = get_jwt_identity()
    job = Job.query.filter_by(id=job_id).first()
    if not job:
        return jsonify({"msg": "Job not found"}), 404

    existing = Liked.query.filter_by(user_id=current_user, job_id=job.id).first()
    if existing:
        return jsonify({"msg": "Job already in wishlist"}), 400

    new_liked = Liked(user_id=current_user, job_id=job.id)
    db.session.add(new_liked)
    db.session.commit()
    return jsonify(new_liked.to_dict()), 201


# DELETE liked job
@app.route('/liked/<string:job_id>', methods=['DELETE'])
@jwt_required()
def delete_liked(job_id):
    current_user = get_jwt_identity()
    liked_item = Liked.query.filter_by(user_id=current_user, job_id=job_id).first()
    if not liked_item:
        return jsonify({"msg": "Job not in wishlist"}), 404

    db.session.delete(liked_item)
    db.session.commit()
    return jsonify({"msg": "Job removed from wishlist"}), 200


# -------------END---------------#
