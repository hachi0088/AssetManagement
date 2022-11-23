from rest_framework.views import APIView
from rest_framework.status import *
from rest_framework.response import Response
from .models import *
from .serializers import *
import datetime as dt

class AssetListAPIView(APIView):
    def get(self, request):
        asset = Asset.objects.all().order_by('created_at')
        serializer = AssetSerializer(asset, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

    def post(self, request):
        date = dt.date.today()
        asset_amount = int(request.data['asset'])
        managed_app = request.data['app']
        memo = request.data['memo']
        last_data = Asset.objects.filter(managed_app=managed_app).order_by("created_at").last()
        diff = asset_amount - last_data.asset_amount
        diff_rate = round((asset_amount/last_data.asset_amount-1)*100, 2)
        data = {'asset_amount': asset_amount,
                'created_at': date,
                'diff': diff,
                'diff_rate': diff_rate,
                'managed_app': managed_app,
                'memo': memo
                }
        serializer = AssetSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def put(self, request):
        req_data = request.data
        data = {'id': req_data['id'], 'asset_amount': req_data['asset_amount'], 'diff': req_data['diff'],
                'diff_rate': req_data['diff_rate'], 'created_at': req_data['created_at'],
                'managed_app': req_data['managed_app'], 'memo': req_data['memo']}
        pre_data = Asset.objects.get(id=data['id'])
        serializer = AssetSerializer(pre_data, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request):
        req_target = request.query_params.get('target')
        data = Asset.objects.get(id=req_target)
        data.delete()
        return Response(status=HTTP_204_NO_CONTENT)

class AssetAmountAPIView(APIView):
    def get(self, request):
        req_target = request.query_params.get('target')
        if req_target:
            asset = Asset.objects.filter(managed_app__name=req_target)
            asset = asset.values('asset_amount')
            asset_list = [
                {
                    'amount': a['asset_amount']
                }
                for a in asset
            ]
            data_list = []
            for a in asset_list:
                data_list.append(a['amount'])

        return Response({'data': data_list}, status=HTTP_200_OK)

class AssetDateAPIView(APIView):
    def get(self, request):
        asset = Asset.objects.filter(managed_app__name='Zaim')
        asset = asset.values('created_at')
        asset_list = [
            {
                'created_at': a['created_at']
            }
            for a in asset
        ]
        date_list = []
        for a in asset_list:
            date_list.append(a['created_at'].strftime('%Y/%m/%d'))

        return Response({'data': date_list}, status=HTTP_200_OK)

class AppListAPIView(APIView):
    def get(self, request):
        app = AppMaster.objects.all().order_by('id')
        serializer = AppSerializer(app, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

class MarketListAPIView(APIView):
    def get(self, request):
        market = MarketMaster.objects.all()
        serializer = MarketSerializer(market, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

class CompanyListAPIView(APIView):
    def get(self, request):
        company = CompanyMaster.objects.all()
        serializer = CompanySerializer(company, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

class DividendListAPIView(APIView):
    def get(self, request):
        dividend = Dividend.objects.all()
        serializer = DividendSerializer(dividend, many=True)

        return Response(serializer.data, status=HTTP_200_OK)