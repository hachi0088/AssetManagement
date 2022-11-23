from django.db import models

class AppMaster(models.Model):
    name = models.CharField(max_length=128, unique=True)

class Asset(models.Model):
    created_at = models.DateField()
    asset_amount = models.IntegerField()
    diff = models.IntegerField()
    diff_rate = models.FloatField()
    managed_app = models.ForeignKey(AppMaster, on_delete=models.CASCADE, related_name='asett_app')
    memo = models.CharField(max_length=256, null=True, blank=True)

class MarketMaster(models.Model):
    name = models.CharField(max_length=128)
    country = models.CharField(max_length=128)

class CompanyMaster(models.Model):
    name = models.CharField(max_length=128)
    code = models.CharField(max_length=128)
    market = models.ForeignKey(MarketMaster, on_delete=models.CASCADE, related_name='company_market')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "code"],
                name="company_unique"
            ),
        ]

class Dividend(models.Model):
    created_at = models.DateTimeField()
    company = models.ForeignKey(CompanyMaster, on_delete=models.CASCADE, related_name='dividend_company')
    num_of_shares = models.IntegerField()
    dividend = models.IntegerField()
    memo = models.CharField(max_length=128, null=True, blank=True)

