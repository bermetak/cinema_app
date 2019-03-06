from django.contrib import admin
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Reservation


class MovieAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'release_date']
    ordering = ['-release_date']
    search_fields = ['name', 'id']

admin.site.register(Movie, MovieAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    ordering = ['name']
    search_fields = ['name', 'id']

admin.site.register(Category, CategoryAdmin)


class HallAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    ordering = ['name']
    search_fields = ['name', 'id']

admin.site.register(Hall, HallAdmin)


class SeatAdmin(admin.ModelAdmin):
    list_display = ['pk', 'hall', 'row', 'seat']
    ordering = ['hall']
    search_fields = ['seat', 'id']

admin.site.register(Seat, SeatAdmin)


class ShowAdmin(admin.ModelAdmin):
    list_display = ['pk', 'movie', 'hall', 'start', 'end']
    ordering = ['movie']
    search_fields = ['movie', 'id']

admin.site.register(Show, ShowAdmin)


class DiscountAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'discount']
    ordering = ['name']
    search_fields = ['name', 'id']

admin.site.register(Discount, DiscountAdmin)


class TicketAdmin(admin.ModelAdmin):
    list_display = ['pk', 'show', 'seat']
    ordering = ['show']
    search_fields = ['show', 'seat', 'id']

admin.site.register(Ticket, TicketAdmin)


class ReservationAdmin(admin.ModelAdmin):
    list_display = ['pk', 'show', 'code', 'get_seats_display']
    ordering = ['show']
    search_fields = ['code', 'id']

admin.site.register(Reservation, ReservationAdmin)
