from django.urls import path
from . import views

urlpatterns = [
    path('v1/assetlist/', views.AssetListAPIView.as_view()),
    path('v1/asset-amount/', views.AssetAmountAPIView.as_view()),
    path('v1/asset-date/', views.AssetDateAPIView.as_view()),
    path('v1/appmaster/', views.AppListAPIView.as_view()),
    path('v1/dividend/', views.DividendListAPIView.as_view()),
    path('v1/market/', views.MarketListAPIView.as_view()),
]