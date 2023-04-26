from django.utils import timezone
import bcrypt
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import serializers, status
from account.models import User


class UserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=100, write_only=True)
    nickname = serializers.CharField(max_length=50)
    created_at = serializers.DateTimeField(read_only=True)

    def validate(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        nickname = validated_data["nickname"]

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("중복된 이메일 입니다.")
        elif User.objects.filter(nickname=nickname).exists():
            raise serializers.ValidationError("중복된 닉네임 입니다.")

        return validated_data

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        nickname = validated_data["nickname"]

        user = User.objects.create(email=email, password=password, nickname=nickname)

        return user

    def update(self, instance, validated_data):
        if instance.email != validated_data["email"]:
            instance.email = validated_data["email"]

        if not bcrypt.checkpw(
            validated_data["password"].encode("utf-8"),
            instance.password.encode("utf-8"),
        ):
            instance.password = validated_data["password"]

        if instance.nickname != validated_data["nickname"]:
            instance.nickname = validated_data["nickname"]

        try:
            instance.save()

        except IntegrityError:
            if User.objects.filter(email=validated_data["email"]).exists():
                return Response({"error": "중복된 이메일 입니다."}, status=status.HTTP_400_BAD_REQUEST)
            elif User.objects.filter(nickname=validated_data["nickname"]).exists():
                return serializers.ValidationError("중복된 닉네임 입니다.")

        return instance

    class Meta:
        model = User
        fields = ["id", "email", "nickname", "password", "created_at"]


class SignInSerializer(serializers.ModelSerializer):
    """
    로그인
    """

    id = serializers.IntegerField(read_only=True)
    email = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=100, write_only=True)
    nickname = serializers.CharField(read_only=True)
    is_instructor = serializers.BooleanField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)

    def validate(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        if email is None:
            raise serializers.ValidationError("이메일을 입력하지 않았습니다.")

        if password is None:
            raise serializers.ValidationError("password를 입력하지 않았습니다.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None

        # 저장되어 있는 비밀번호
        user_password: str = user.password

        # 입력한 비밀번호
        input_password = password.encode("utf-8")
        check = bcrypt.checkpw(input_password, user_password.encode("utf-8"))

        if not check:
            raise serializers.ValidationError("비밀 번호가 일치하지 않습니다.")

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        print(user.is_instructor)

        return {
            "id": user.id,
            "email": user.email,
            "nickname": user.nickname,
            "is_instructor": user.is_instructor,
            "last_login": user.last_login,
        }

    class Meta:
        model = User
        fields = ["id", "email", "nickname", "password", "is_instructor", "last_login"]


# class SignOutSerializer(serializers.ModelSerializer):
