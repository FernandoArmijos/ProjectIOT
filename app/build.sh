...
#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r app/requirements.txt

# Convert static asset files
python app/manage.py collectstatic --noinput

# Apply any outstanding database migrations
python app/manage.py migrate

gunicorn app.wsgi:application

#Asegúrese de que el script sea ejecutable antes de agregarlo al control de versiones:
#sudo chmod a+x build.sh