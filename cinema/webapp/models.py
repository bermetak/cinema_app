from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)
    poster = models.ImageField(upload_to='posters', null=True, blank=True)
    release_date = models.DateField()
    finish_date = models.DateField(null=True, blank=True)
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

class Hall(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Seat(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.PROTECT)
    row = models.DecimalField(max_digits=2, decimal_places=0)
    seat = models.DecimalField(max_digits=3, decimal_places=0)

    def __str__(self):
        return self.seat

class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
    hall = models.ForeignKey(Hall, on_delete=models.PROTECT)
    start = models.DateTimeField()
    end = models.DateTimeField()
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.movie