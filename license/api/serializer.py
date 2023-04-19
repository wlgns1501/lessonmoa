from rest_framework import serializers
from license.models import License


class LicenseSerailizer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100)
    image_url = serializers.URLField()

    class Meta:
        model = License
        fields = ["id", "name", "image_url"]
