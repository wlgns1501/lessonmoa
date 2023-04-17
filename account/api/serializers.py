from django.utils import timezone
import bcrypt
from django.db import IntegrityError
from rest_framework import serializers
from account.models import User

class UserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=100, write_only = True)
    nickname = serializers.CharField(max_length=50)
    created_at = serializers.DateTimeField(read_only = True)

    def post(self, validated_data) :
        email = validated_data['email']
        password = validated_data['password']
        nickname = validated_data['nickname']

        try :
            user = User.objects.create(
                email = email,
                password = password,
                nickname = nickname
            )

            return user
        
        except IntegrityError as e :
            if 'account_user_email_key' in e.args[0] :
                raise serializers.ValidationError('중복된 이메일 입니다.')
            elif 'account_user_nickname_key' in e.args[0]:
                raise serializers.ValidationError('중복된 닉네임 입니다.')

    def update(self, instance, validated_data):
        if instance.email != validated_data['email'] :
            instance.email = validated_data['email']
        
        if not bcrypt.checkpw(validated_data['password'].encode('utf-8'), instance.password.encode('utf-8')):
            instance.password = validated_data['password']

        if instance.nickname != validated_data['nickname'] :
            instance.nickname = validated_data['nickname']

        try :
            instance.save()
        except IntegrityError as e :
            if 'account_user_email_key' in e.args[0] :
                raise serializers.ValidationError('중복된 이메일 입니다.')
            elif 'account_user_nickname_key' in e.args[0]:
                raise serializers.ValidationError('중복된 닉네임 입니다.')

        return instance


    class Meta:
        model = User
        fields = ['id', 'email', 'nickname', 'password', 'created_at']



class SignInSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=100, write_only = True)
    nickname = serializers.CharField(read_only=True)
    last_login = serializers.DateTimeField(read_only = True)

    def validate(self, validated_data) :
        email = validated_data['email']
        password = validated_data['password']

        if email is None :
            raise serializers.ValidationError(
                '이메일을 입력하지 않았습니다.'
            )

        if password is None:
            raise serializers.ValidationError(
                'password를 입력하지 않았습니다.'
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None

        # 저장되어 있는 비밀번호
        user_password: str = user.password
        
        # 입력한 비밀번호
        input_password = password.encode('utf-8')
        check = bcrypt.checkpw(input_password, user_password.encode('utf-8'))

        if not check:
            raise serializers.ValidationError(
                '비밀 번호가 일치하지 않습니다.'
            )

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])


        return {
            'id' : user.id,
            'email' : user.email,
            'nickname' : user.nickname,
            'last_login' : user.last_login
        }

    class Meta :
        model = User
        fields = ["id", "email", "nickname" ,"password", "last_login"]

# class SignOutSerializer(serializers.ModelSerializer):
