from django.shortcuts import render
from rest_framework.views import APIView
from lesson.api.serializers import LessonSerializer
from lesson.models import Lesson
from rest_framework.response import Response
from rest_framework import status
from account.authentication import JWTAuthentication
from license.models import License
from drf_yasg.utils import swagger_auto_schema


class LessonView(APIView):
    serializer_class = LessonSerializer

    @swagger_auto_schema(tags=["레슨 리스트"])
    def get(self, request):
        try:
            lessons = Lesson.objects.all()
        except Lesson.DoesNotExist:
            return Response({"lessons": []}, status=status.HTTP_200_OK)

        serializer = self.serializer_class(lessons)

        return Response({"lessons": serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["레슨 등록하기"], request_body=LessonSerializer)
    def post(self, request):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id
        is_instructor = user[0].is_instructor

        if is_instructor == False:
            return Response({"error": "스포츠 자격증을 인증한 유저만 수업을 등록할 수 있습니다."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            licenses = list(License.objects.filter(user_id=user_id))
        except License.DoesNotExist:
            return Response({"error": "스포츠 자격증을 인증한 유저만 수업을 등록할 수 있습니다."}, status=status.HTTP_401_UNAUTHORIZED)

        print(licenses)

        # 자격증이 하나인데 아직 인증되지 않은 경우
        # 자격증이 등록되었는데, 다른 스포츠로 수업을 등록하는 경우
        #

