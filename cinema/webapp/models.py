from django.db import models
import random
import string
from django.conf import settings


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'

class Movie(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)
    poster = models.ImageField(upload_to='posters', null=True, blank=True)
    release_date = models.DateField()
    finish_date = models.DateField(null=True, blank=True)
    category = models.ManyToManyField('Category', related_name='movies', blank=True)

    def __str__(self):
        return self.name

class Hall(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.name

class Seat(models.Model):
    hall = models.ForeignKey('Hall', related_name='seats', on_delete=models.PROTECT)
    row = models.DecimalField(max_digits=2, decimal_places=0)
    seat = models.DecimalField(max_digits=3, decimal_places=0)

    def __str__(self):
        return 'Row %s, Seat %s' % (self.row, self.seat)

class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.PROTECT, related_name='shows')
    hall = models.ForeignKey(Hall, on_delete=models.PROTECT, related_name='shows')
    start = models.DateTimeField()
    end = models.DateTimeField()
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return "%s, %s (%s - %s)" % (self.movie, self.hall,
                                     self.start.strftime('%d.%m.%Y %H:%M'),
                                     self.end.strftime('%d.%m.%Y %H:%M'))

class Discount(models.Model):
    name = models.CharField(max_length=255)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    starts_date = models.DateField(null=True, blank=True)
    ends_date = models.DateField(null=True, blank=True)


class Ticket(models.Model):
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='tickets')
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT, related_name='tickets')
    discount = models.ForeignKey(Discount, null=True, blank=True, on_delete=models.PROTECT, related_name='tickets')
    returns = models.BooleanField(default=False)


def generate_code():
    code = ""
    for i in range(0, settings.RESERVATION_CODE_LENGTH):
        code += random.choice(string.digits)
    return code


RESERVATION_STATUS_CHOICES = [
    ('created', 'Created'),
    ('sold', 'Sold'),
    ('canceled', 'Canceled'),
]


class Reservation(models.Model):
    code = models.CharField(max_length=10, unique_for_date='created_at', default=generate_code, editable=False)
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='reservations')
    seats = models.ManyToManyField(Seat, related_name='reservations')
    status = models.CharField(max_length=20, choices=RESERVATION_STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s, %s" % (self.show, self.code)

    def get_seats_display(self):
        seats = ""
        for seat in self.seats.all():
            seats += "R%sS%s " % (seat.row, seat.seat)
        return seats.rstrip()