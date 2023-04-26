from datetime import datetime, timedelta
import json
from django.conf import settings
from django.http import JsonResponse
import jwt
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils.decorators import method_decorator
from account.authentication import JWTAuthentication
from account.models import User
from account.api.serializers import SignInSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt


def generate_access_token(user):
    dt = datetime.now() + timedelta(days=1)
    print(user["is_instructor"])
    token = jwt.encode(
        {
            "id": user["id"],
            "email": user["email"],
            "is_instructor": user["is_instructor"],
            "exp": dt.utcfromtimestamp(dt.timestamp()),
        },
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return token


def generate_refresh_token(user):
    dt = datetime.now() + timedelta(days=7)

    token = jwt.encode(
        {
            "id": user["id"],
            "email": user["email"],
            "is_instructor": user["is_instructor"],
            "exp": dt.utcfromtimestamp(dt.timestamp()),
        },
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return token


# class UserView(generics.ListAPIView):
#     serializer_class = UserSerializer
#     queryset = User.objects.all()

#     @swagger_auto_schema(tags=['유저 리스트'], query_serializer=PaginationSerializer,
#         manual_parameters=[
#             openapi.Parameter('page', openapi.IN_QUERY, description="offset", type=openapi.TYPE_INTEGER),
#             openapi.Parameter('page_size', openapi.IN_QUERY, description="limit", type=openapi.TYPE_INTEGER),
#         ])
#     def get(self, request) :
#         page = request.query_params['page']
#         page_size = request.query_params['page_size']

#         try:
#             users = User.objects.all().order_by('-created_at')
#         except User.DoesNotExist :
#             return Response(data = users , status=status.HTTP_200_OK)

#         paginator = Paginator(users, page_size)
#         paginated_users = paginator.get_page(page).object_list

#         serializer = self.serializer_class(paginated_users)

#         print(serializer.data)

#         return Response({users : }, status=status.HTTP_200_OK)


class SignUpView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @transaction.atomic
    @swagger_auto_schema(tags=["유저 생성"], request_body=UserSerializer)
    def post(self, request):
        body = json.loads(request.body)

        with transaction.atomic():
            serializer = self.serializer_class(data=body)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response(
                {"user": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.error_messages)
            return Response(
                {"message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


class SignInView(APIView):
    serializer_class = SignInSerializer
    queryset = User.objects.all()

    @swagger_auto_schema(tags=["로그인"], request_body=SignInSerializer)
    def post(self, request):

        body = json.loads(request.body)
        serializer = self.serializer_class(data=body)

        if serializer.is_valid(raise_exception=True):
            access_token = generate_access_token(serializer.data)
            refresh_token = generate_refresh_token(serializer.data)
            response = JsonResponse({"data": serializer.data, "status": status.HTTP_200_OK})
            response.set_cookie("access_token", access_token, expires=datetime.now() + timedelta(days=1))
            response.set_cookie(
                "refresh_token", refresh_token, expires=datetime.now() + timedelta(days=7), domain="auth/refresh"
            )
            return response

        else:
            return Response({"data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LogOutView(APIView):
    @swagger_auto_schema(tags=["로그아웃"])
    def post(self, request):
        response = Response({"success": True})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class UserDetailView(APIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()

    def get_one(self, user_id: int):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @transaction.atomic
    @method_decorator(
        decorator=swagger_auto_schema(
            tags=["개인정보 수정하기"],
            request_body=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "email": openapi.Schema(type=openapi.TYPE_STRING, description="email"),
                    "nickname": openapi.Schema(type=openapi.TYPE_STRING, description="nickname"),
                    "password": openapi.Schema(type=openapi.TYPE_STRING, description="password"),
                },
            ),
        )
    )
    def patch(self, request):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

        body = json.loads(request.body)

        user = self.get_one(user_id)

        if user is None:
            return Response({"success": False}, status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            serializer = self.serializer_class(user, data=body)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            access_token = generate_access_token(serializer.data)
            refresh_token = generate_refresh_token(serializer.data)
            response = JsonResponse({"data": serializer.data, "status": status.HTTP_200_OK})
            response.set_cookie("access_token", access_token, expires=datetime.now() + timedelta(days=1))
            response.set_cookie(
                "refresh_token", refresh_token, expires=datetime.now() + timedelta(days=7), domain="auth/refresh"
            )
            return response

        else:
            return Response({"data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    @swagger_auto_schema(tags=["탈퇴"])
    def delete(self, request):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

        user = self.get_one(user_id)

        if user is None:
            return Response({"message": "해당 유저가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                user.delete()

                response = JsonResponse({"success": True})
                response.delete_cookie("access_token")
                response.delete_cookie("refresh_token")

                return response
        except:
            return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)
