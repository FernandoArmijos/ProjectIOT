...
#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

#Asegúrese de que el script sea ejecutable antes de agregarlo al control de versiones:
#sudo chmod a+x build.sh