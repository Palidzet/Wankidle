from django.db import models


class Database(models.Model):
    pub_date = models.DateTimeField("publication date")
    
    irl_face_none = models.IntegerField(default=0) #0 pour aucun, 1 pour face cam , 2 pour irl
    game_category = models.CharField(max_length=200, default=' ')
    game_or_not = models.BooleanField
    feat_or_not = models.CharField(max_length=200, default=' ')
    views = models.IntegerField(default=0)
    image = models.ImageField
