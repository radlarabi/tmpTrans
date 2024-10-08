# Generated by Django 5.1 on 2024-09-07 15:15

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0004_alter_customuser_custom_uid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='custom_uid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
