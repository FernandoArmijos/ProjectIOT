...
#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r app/requirements.txt

# Convert static asset files
python manage.py collectstatic --noinput

# Apply any outstanding database migrations
python manage.py migrate

#Asegúrese de que el script sea ejecutable antes de agregarlo al control de versiones:
#sudo chmod a+x build.sh