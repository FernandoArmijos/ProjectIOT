from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import model_to_dict

from config.settings import MEDIA_URL, STATIC_URL

class User(AbstractUser):
    image = models.ImageField(upload_to='users/%Y/%m', null=True, blank=True, verbose_name='Imagen')
    def get_image(self):
        if self.image:
            return '{}{}'.format(MEDIA_URL, self.image)
        return '{}{}'.format(STATIC_URL, 'img/user.png')

    def full_name(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def toJSON(self):
        item = model_to_dict(self, exclude=['groups', 'password', 'user_permission'])
        if self.last_login:
            item['last_login'] = self.last_login.strftime("%d-%m-%Y, %H:%M:%S")
        item['date_joined'] = self.date_joined.strftime('%d-%m-%Y')
        item['image'] = self.get_image()
        item['full_name'] = self.full_name()
        return item
