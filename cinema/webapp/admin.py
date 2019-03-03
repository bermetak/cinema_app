from django.contrib import admin
from webapp.models import Movie, Category, Hall, Seat, Show


class MovieAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'release_date']
    ordering = ['-release_date']
    search_fields = ['name', 'id']

admin.site.register(Movie, MovieAdmin)


class CategoryAdmin(admin.ModelAdmin):
    pass

admin.site.register(Category, CategoryAdmin)


class HallAdmin(admin.ModelAdmin):
    pass

admin.site.register(Hall, HallAdmin)


class SeatAdmin(admin.ModelAdmin):
    pass

admin.site.register(Seat, SeatAdmin)


class ShowAdmin(admin.ModelAdmin):
    pass

admin.site.register(Show, ShowAdmin)
