from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Reservation
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:user-detail')
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(required=True, allow_blank=False)

    def validate_password(self, value):
        user = self.context['request'].user
        if not authenticate(username=user.username, password=value):
            raise ValidationError('Invalid password for your account')
        return value

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('new_password_confirm'):
            raise ValidationError("Passwords do not match")
        return super().validate(attrs)

    def update(self, instance, validated_data):
        validated_data.pop('password')
        new_password = validated_data.pop('new_password')
        validated_data.pop('new_password_confirm')
        instance = super().update(instance, validated_data)

        if new_password:
            instance.set_password(new_password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name', 'last_name', 'email',
                  'password', 'new_password', 'new_password_confirm']

class UserViewSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:user-detail')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise ValidationError("Passwords do not match")
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password_confirm', 'email']


class InlineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class InlineHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ('id', 'name', 'url')


class MovieCreateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:movie-detail')

    class Meta:
        model = Movie
        fields = ('url', 'id', 'name', 'description', 'poster', 'release_date', 'finish_date', 'categories')


class MovieSerializer(MovieCreateSerializer):
    categories = InlineCategorySerializer(many=True, read_only=True)


class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:category-detail')

    class Meta:
        model = Category
        fields = ('url', 'id', 'name', 'description')

class HallSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:hall-detail')

    class Meta:
        model = Hall
        fields = ('url', 'id', 'name', 'description')

class SeatSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:seat-detail')

    class Meta:
        model = Seat
        fields = ('url', 'id', 'hall', 'row', 'seat')

class ShowSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:show-detail')
    movie_url = serializers.HyperlinkedRelatedField(view_name='api_v1:movie-detail', source='movie', read_only=True)
    hall_url = serializers.HyperlinkedRelatedField(view_name='api_v1:hall-detail', read_only=True, source='hall')
    hall_name = serializers.SerializerMethodField(read_only=True, source='hall')
    movie_name = serializers.SerializerMethodField(read_only=True, source='movie')

    def get_hall_name(self, show):
        return show.hall.name

    def get_movie_name(self, show):
        return show.movie.name

    class Meta:
        model = Show
        fields = ('url', 'id', 'movie', 'movie_name', 'movie_url', 'hall', 'hall_name', 'hall_url', 'start', 'end', 'price')

class DiscountSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:discount-detail')

    class Meta:
        model = Discount
        fields = ('url', 'id', 'name', 'discount', 'starts_date', 'ends_date')

class TicketSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:ticket-detail')
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', source='show', read_only=True)
    seat_url = serializers.HyperlinkedRelatedField(view_name='api_v1:seat-detail', source='seat', read_only=True)
    discount_url = serializers.HyperlinkedRelatedField(view_name='api_v1:discount-detail', source='discount', read_only=True)

    class Meta:
        model = Ticket
        fields = ('url', 'id', 'show', 'show_url', 'seat', 'seat_url', 'discount', 'discount_url', 'returns')

class ReservationSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:reservation-detail')
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', source='show', read_only=True)

    class Meta:
        model = Reservation
        fields = ('url', 'id', 'code', 'show', 'show_url', 'seats', 'status', 'created_at', 'updated_at')