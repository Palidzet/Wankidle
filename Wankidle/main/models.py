from django.db import models


class Database(models.Model):
    index = models.IntegerField()
    video_id = models.CharField(max_length=200)
    title = models.CharField(max_length= 200  , default = ' ')
    pub_date = models.DateTimeField()
    views = models.IntegerField()
    duration = models.CharField(max_length=200)
    miniature = models.CharField(max_length=200)
    game = models.BooleanField()
    game_title = models.CharField(max_length=200,blank=True,null=True)
    feat = models.BooleanField()
    feat_members = models.CharField(max_length=200,blank=True,null=True)

    NO_CAM = "No cam"
    FACE_CAM = "Face cam"
    IRL_CAM = "IRL cam"
    CAM_CHOICES = [
        (NO_CAM, "No cam"),
        (FACE_CAM, "Face cam"),
        (IRL_CAM, "IRL cam"),
    ]
    irl_face_none = models.CharField(max_length=20,choices=CAM_CHOICES)

    def __str__(self):
        return str(self.index) + " - " + self.title

    def Meta(self):
        ordering = ['index']

