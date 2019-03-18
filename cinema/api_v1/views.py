from django.shortcuts import render

# Create your views here.
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Reservation
from rest_framework import viewsets
from api_v1.serializers import MovieSerializer, CategorySerializer, HallSerializer, SeatSerializer, ShowSerializer, \
    DiscountSerializer, TicketSerializer, ReservationSerializer, MovieCreateSerializer


class NoAuthModelViewSet(viewsets.ModelViewSet):
    authentication_classes = []


class MovieViewSet(NoAuthModelViewSet):
    queryset = Movie.objects.all().order_by('id')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MovieSerializer
        else:
            return MovieCreateSerializer


class CategoryViewSet(NoAuthModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class HallViewSet(NoAuthModelViewSet):
    queryset = Hall.objects.all().order_by('name')
    serializer_class = HallSerializer

class SeatViewSet(NoAuthModelViewSet):
    queryset = Seat.objects.all().order_by('seat')
    serializer_class = SeatSerializer


class DiscountViewSet(NoAuthModelViewSet):
    queryset = Discount.objects.all().order_by('name')
    serializer_class = DiscountSerializer

class TicketViewSet(NoAuthModelViewSet):
    queryset = Ticket.objects.all().order_by('show')
    serializer_class = TicketSerializer

class ReservationViewSet(NoAuthModelViewSet):
    queryset = Reservation.objects.all().order_by('show')
    serializer_class = ReservationSerializer




class ShowViewSet(NoAuthModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

    # фильтр сеансов показа фильмов по id фильма и по дате начала сеанса
    # сюда требуется добавить фильтр по id зала.
    def get_queryset(self):
        queryset = self.queryset
        movie_id = self.request.query_params.get('movie_id', None)
        hall_id = self.request.query_params.get('hall_id', None)
        starts_after = self.request.query_params.get('starts_after', None)
        starts_before = self.request.query_params.get('starts_before', None)

        if hall_id:
            queryset = queryset.filter(hall_id=hall_id)
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        if starts_after:
            queryset = queryset.filter(start__gte=starts_after)
        if starts_before:
            queryset = queryset.filter(start__lte=starts_before)
        return queryset