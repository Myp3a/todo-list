from django.db import models

class User(models.Model):
    login = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    hash = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.login}: {self.hash}"

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.CharField(max_length=2048)
    descr = models.TextField()
    img_path = models.CharField(max_length=128,default="task_img/def_cat.jpg")
    done = models.BooleanField(default=False)
    due_to = models.DateTimeField(default=None, blank=True, null=True)

    def __str__(self):
        return f"{self.user.login}: {self.task[:30]} ({'Done' if self.done else 'Not done'})"

# class NotifyTask(models.Model):
#     ...