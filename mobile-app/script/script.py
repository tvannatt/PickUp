import csv
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(r'D:\expo-firebase-starter-master\expo-firebase-starter-master\mobile-app\script\firebase_app.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Parse CSV and Upload to Firestore
with open('D:\expo-firebase-starter-master\expo-firebase-starter-master\mobile-app\script\Miller_Elementary_Pickup_Info.csv', 'r', encoding='utf-8-sig') as file: 
    reader = csv.DictReader(file)
    users_ref = db.collection('users_test')
    children_ref = db.collection('children_test')
    added_guardian_emails = set()
    added_staff_emails = set()

    for row in reader:
        guardian_email = row['Guardian Email'].strip()
        guardian_name = row['Guardian_Name'].strip()
        child_names = row['Child_Name(s)'].split(',')
        child_ids = row['Student_ID(s)'].split(',')
        staff_email = row['Staff Email'].strip()
        staff_name = row['Staff Name'].strip()

        child_uids = []

        for name, id in zip(child_names, child_ids):
            # Check if child exists
            existing_child = children_ref.where('ID', '==', int(id)).get()
            
            if not existing_child:
                # If child doesn't exist, add it with an auto-generated ID
                child_doc_ref, child_doc = children_ref.add({
                    'ID': int(id),
                    'name': name,
                    'status': "inSchool",
                    'parent': guardian_name,
                    'loc': '1',
                    'vehicle': "car",
                })
                child_uids.append(child_doc.id)
            else:
                # If child exists, add its ID to the child_uids list
                child_uids.append(existing_child[0].id)

        # Process guardian
        guardian_doc_ref = users_ref.document(guardian_email)  # Document reference with email as ID
        user_data = {
            'email': guardian_email,
            'role': 'guardian',
            'name': guardian_name,
            'children': child_uids,
            'isCheckedIn': False,
            'loc': None,
        }

        # If user doesn't exist or needs update, set/update the data
        guardian_doc_ref.set(user_data, merge=True)
        added_guardian_emails.add(guardian_email)
        
        # Process staff
        if staff_email and staff_email not in added_staff_emails and staff_email not in added_guardian_emails:
            staff_doc_ref = users_ref.document(staff_email)  # Document reference with email as ID
            staff_data = {
                'email': staff_email,
                'role': 'staff',
                'name': staff_name,
            }
            staff_doc_ref.set(staff_data, merge=True)
            added_staff_emails.add(staff_email)