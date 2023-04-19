from rest_framework import serializers
from license.models import License


class LicenseSerailizer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100)
    image_url = serializers.URLField()
    user_id = serializers.IntegerField(write_only=True)
    category_id = serializers.IntegerField(write_only=True)

    def post(self, validated_data):
        name = validated_data["name"]
        image_url = validated_data["image_url"]
        user_id = validated_data["user_id"]
        category_id = validated_data["category_id"]

        if name is None:
            return serializers.ValidationError("이름을 입력하지 않았습니다.")

        if image_url is None:
            return serializers.ValidationError("자격증 사진을 입력하지 않았습니다.")

        if user_id is None:
            return serializers.ValidationError("유저 id를 입력하지 않았습니다.")

        if category_id is None:
            return serializers.ValidationError("카테고리를 입력하지 않았습니다.")

        license = License.objects.create(
            name=name, image_url=image_url, user_id=user_id, category_id=category_id
        )

        return license

    class Meta:
        model = License
        fields = ["id", "name", "image_url", "user_id", "category_id"]


class LicenseDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    image_url = serializers.URLField()
    user_id = serializers.IntegerField(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def patch(self, intance, validated_data):
        name = validated_data["name"]
        image_url = validated_data["image_url"]
        category_id = validated_data["category_id"]

        if intance.name != name:
            intance.name = name

        if intance.image_url != image_url:
            intance.image_url = image_url

        if intance.category_id != category_id:
            intance.category_id = category_id

        intance.save()

        return intance

    class Meta:
        model = License
        fields = [
            "id",
            "name",
            "image_url",
            "status",
            "user_id",
            "category_id",
            "created_at",
        ]
