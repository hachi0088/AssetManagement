from rest_framework import serializers
from .models import Asset, MarketMaster, CompanyMaster, Dividend, AppMaster

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppMaster
        fields = "__all__"

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketMaster
        fields = "__all__"

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyMaster
        fields = "__all__"

class DividendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dividend
        fields = "__all__"
