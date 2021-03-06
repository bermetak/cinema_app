from django.shortcuts import render

# Create your views here.
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Reservation
from rest_framework import viewsets
from api_v1.serializers import MovieSerializer, CategorySerializer, HallSerializer, SeatSerializer, ShowSerializer, \
    DiscountSerializer, TicketSerializer, ReservationSerializer, MovieCreateSerializer, UserSerializer, UserRegisterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token




class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'id': user.id,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })

class BaseViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
            permissions.append(IsAdminUser())
        return permissions

class UserCreateView(CreateAPIView):
    model = User
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
    #     token = self.create_token(user)
    #
    # def create_token(self, user):
    #     return RegistrationToken.objects.create(user=user)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
        return permissions

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ['PUT', 'PATCH', 'DELETE'] and obj != request.user:
            self.permission_denied(request, 'Can not edit other users data!')




class MovieViewSet(BaseViewSet):
    queryset = Movie.objects.active().order_by('-release_date')
    serializer_class = MovieSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MovieSerializer
        else:
            return MovieCreateSerializer


class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class HallViewSet(BaseViewSet):
    queryset = Hall.objects.active().order_by('name')
    serializer_class = HallSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

class SeatViewSet(BaseViewSet):
    queryset = Seat.objects.all().order_by('seat')
    serializer_class = SeatSerializer


class DiscountViewSet(BaseViewSet):
    queryset = Discount.objects.all().order_by('name')
    serializer_class = DiscountSerializer

class TicketViewSet(BaseViewSet):
    queryset = Ticket.objects.all().order_by('show')
    serializer_class = TicketSerializer

class ReservationViewSet(BaseViewSet):
    queryset = Reservation.objects.all().order_by('show')
    serializer_class = ReservationSerializer




class ShowViewSet(BaseViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

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