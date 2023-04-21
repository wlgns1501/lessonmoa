# Generated by Django 4.2 on 2023-04-21 05:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("category", "0001_initial"),
        ("sub_category", "0002_alter_subcategory_category"),
    ]

    operations = [
        migrations.AlterField(
            model_name="subcategory",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sub_categories",
                to="category.category",
            ),
        ),
    ]
