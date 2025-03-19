# Generated by Django 5.1.6 on 2025-03-19 16:24

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_name', models.CharField(max_length=255)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('distance', models.FloatField(blank=True, null=True)),
                ('percentage', models.FloatField()),
                ('confirmed', models.BooleanField(default=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendance.lecture')),
            ],
        ),
        migrations.CreateModel(
            name='Theatre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('geofence_radius', models.FloatField(default=750)),
                ('error_margin', models.FloatField(default=150)),
                ('geofence', django.contrib.gis.db.models.fields.PolygonField(blank=True, null=True, srid=4326)),
            ],
            options={
                'indexes': [models.Index(fields=['center'], name='attendance__center_7ba513_idx')],
            },
        ),
        migrations.AddField(
            model_name='lecture',
            name='theatre',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendance.theatre'),
        ),
    ]
